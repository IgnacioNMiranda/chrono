import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase, Task, User } from '../../../database'
import { Record } from '../../../database'
import { getDateData, isValidTime } from '../../../utils'

const createTask = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(400).end('Bad request')

  await connectToDatabase()

  const body = JSON.parse(req.body)

  if (!body.title || (body.time !== '' && !isValidTime(req.body.time)) || !body.userId) {
    return res.status(400).end('Bad request. Some parameters are missing or bad formatted')
  }

  const { title, time, notes, userId } = body

  const user = await User.findById(userId).populate('records')
  if (!user) return res.status(401).end('Forbidden. You have no credentials to perform this action')

  const { month, week, day, year } = getDateData(user.timezone)

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

  const newTask = new Task({
    title,
    notes: notes ?? '',
    lastRun: new Date(),
    accTimeSecs,
    record: todayRecord,
  })
  console.log(newTask)

  todayRecord.tasks.push(newTask)
  await newTask.save()
  await todayRecord.save()

  return res.status(200).json(newTask)
}

export default createTask
