import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../database/connection'
import { Task, User } from '../../../database/models'
import { TaskStatus } from '../../../database/enums'
import { Record } from '../../../database/models'
import { getDateData, isValidTime } from '../../../utils'

const createTask = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(400).end('Bad request')

  await connectToDatabase()

  const body = JSON.parse(req.body)

  if (
    !body.title ||
    (body.time !== '' && !isValidTime(body.time)) ||
    !body.userId ||
    !body.locale
  ) {
    return res.status(400).end('Bad request. Some parameters are missing or bad formatted')
  }

  const { title, time, notes, userId, locale } = body

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

  const { month, week, day, year, date: todayDate } = getDateData(locale, user.timezone)

  const todayRecord = await Record.findOne({
    month,
    week,
    day,
    year,
    user: userId,
  }).exec()

  if (!todayRecord) return res.status(400).end('Bad request. Cannot find today record')

  const normTime = time || '0:00'
  const [hours, minutes] = normTime.split(':')
  const accTimeSecs = Number(hours) * 60 * 60 + Number(minutes) * 60

  const taskAlreadyRunning = user.records
    .find((record) => record.hasTaskRunning)
    ?.tasks.find((task) => task.status === TaskStatus.RUNNING)

  const newTask = new Task({
    title,
    notes: notes ?? '',
    lastRun: taskAlreadyRunning ? null : todayDate,
    accTimeSecs,
    record: todayRecord._id,
    status: taskAlreadyRunning ? TaskStatus.IDLE : TaskStatus.RUNNING,
  })

  const hasTaskRunningQuery = taskAlreadyRunning ? {} : { $set: { hasTaskRunning: true } }

  await newTask.save()
  await todayRecord.updateOne({ ...hasTaskRunningQuery, $push: { tasks: newTask._id } }).exec()

  return res.status(200).json(newTask)
}

export default createTask
