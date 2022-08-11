import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../database/connection'
import { Task, User } from '../../../database/models'
import { TaskStatus } from '../../../database/enums'
import { Record } from '../../../database/models'
import { getDateData, getSecondsDiff } from '../../../utils'

const stopTask = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') return res.status(400).end('Bad request')

  await connectToDatabase()

  const body = JSON.parse(req.body)

  if (!body.taskId || !body.userId || !body.timezone) {
    return res.status(400).end('Bad request. Some parameters are missing or bad formatted')
  }

  const { taskId, userId } = body

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

  const { month, week, day, year, date } = getDateData(user.timezone)

  const todayRecord = await Record.findOne({
    month,
    week,
    day,
    year,
    user: userId,
  }).exec()

  if (!todayRecord) return res.status(400).end('Bad request. Could not find today record')

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

  const datetime_str = new Date().toLocaleString('en-US', { timeZone: body.timezone })

  task.lastRun = new Date(datetime_str)

  todayRecord.hasTaskRunning = true

  await task.save()
  await todayRecord.save()

  return res.status(200).json(task)
}

export default stopTask
