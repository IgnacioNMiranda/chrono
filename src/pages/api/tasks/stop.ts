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

  if (!body.taskId || !body.userId) {
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

  const task = await Task.findOne({ taskId }).exec()
  if (!task) return res.status(400).end('Bad request. Cannot find task')
  if (!task.lastRun) return res.status(400).end('Bad request. Task were not running')

  task.accTimeSecs += getSecondsDiff(date, task.lastRun)
  task.status = TaskStatus.IDLE

  todayRecord.hasTaskRunning = false

  await task.save()
  await todayRecord.save()

  return res.status(200).json(task)
}

export default stopTask

// Handle case when task has been stopped and day has already passed
