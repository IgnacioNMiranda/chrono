import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from 'database/connection'
import { Task, User } from 'database/models'
import { TaskStatus } from 'database/enums'
import { ToggleTaskStatusDto } from 'database/dtos'
import { getDateData, getSecondsDiff } from 'utils'
import { withMiddleware } from '../_utils'

const startTask = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') return res.status(400).end('Bad request')

  await connectToDatabase()

  const body = JSON.parse(req.body)

  if (!body.taskId || !body.userId || !body.selectedDay || !body.locale) {
    return res.status(400).end('Bad request. Some parameters are missing or bad formatted')
  }

  const { taskId, userId, selectedDay, locale }: ToggleTaskStatusDto = body

  const user = await User.findById(userId)
    .populate({
      path: 'records',
      populate: {
        path: 'tasks',
        model: 'Task',
      },
    })
    .exec()
  if (!user) return res.status(401).end('Forbidden. You have no credentials to perform this action')

  const serverTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const { date } = getDateData(locale, serverTimezone)

  const selectedRecord = user.records.find(
    (record) =>
      record.month === Number(selectedDay.month) &&
      record.day === Number(selectedDay.day) &&
      record.week === Number(selectedDay.week) &&
      record.year === Number(selectedDay.year),
  )

  if (!selectedRecord) return res.status(400).end('Bad request. Could not find today record')

  const task = await Task.findById(taskId).exec()
  if (!task) return res.status(400).end('Bad request. Cannot find task')

  const recordAlreadyRunning = user.records.find((record) => record.hasTaskRunning)
  const taskAlreadyRunning = recordAlreadyRunning?.tasks.find(
    (task) => task.status === TaskStatus.RUNNING,
  )
  if (recordAlreadyRunning && taskAlreadyRunning) {
    recordAlreadyRunning.hasTaskRunning = false
    taskAlreadyRunning.status = TaskStatus.IDLE
    taskAlreadyRunning.accTimeSecs += getSecondsDiff(date, taskAlreadyRunning.lastRun)
    await recordAlreadyRunning.save()
    await taskAlreadyRunning.save()
  }

  task.status = TaskStatus.RUNNING

  task.lastRun = date

  selectedRecord.hasTaskRunning = true

  await task.save()
  await selectedRecord.save()

  return res.status(200).json(task)
}

export default withMiddleware('canMakeRequest')(startTask)
