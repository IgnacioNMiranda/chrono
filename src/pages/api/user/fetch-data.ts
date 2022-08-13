import type { NextApiRequest, NextApiResponse } from 'next'
import { User, Record } from '../../../database/models'
import { connectToDatabase } from '../../../database/connection'
import { getDateData } from '../../../utils'

const fetchData = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return res.status(400).end('Bad request')

  if (!req.query.email || !req.query.provider || !req.query.locale)
    return res.status(400).end('Bad request. Missing parameters')
  const { email, provider, locale } = req.query

  try {
    await connectToDatabase()
  } catch (error) {
    return res.status(504).end('Server is not responding...')
  }

  const dbUser = await User.findOne({ email, provider }).populate({
    path: 'records',
    populate: {
      path: 'tasks',
      model: 'Task',
    },
  })
  if (!dbUser) return res.status(404).end('Unexpected error. Please contact support')

  const { month, week, day, year } = getDateData((locale as string) ?? 'en', dbUser.timezone)

  let todayRecord = await Record.findOne({
    user: dbUser._id,
    month,
    day,
    week,
    year,
  }).exec()
  if (!todayRecord) {
    todayRecord = new Record({
      day,
      week,
      month,
      year,
      tasks: [],
      user: dbUser._id,
    })
    await dbUser.updateOne({ $push: { records: todayRecord._id } }).exec()
    await todayRecord.save()
  }

  return res.status(200).json(dbUser)
}

export default fetchData
