import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase, User } from '../../../database'
import { Record, RecordStatus } from '../../../database'
import { getDateData } from '../../../utils'

const fetchData = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return res.status(400).end('Bad request')

  const { email, provider } = req.query
  if (!email || !provider) return res.status(400).end('Bad request. Missing parameters')

  await connectToDatabase()

  const dbUser = await User.findOne({ email, provider }).populate('records')
  if (!dbUser) return res.status(404).end('Unexpected error. Please contact support')

  const { month, week, day, year } = getDateData(dbUser.timezone)

  let todayRecord = await Record.findOne({
    user: dbUser._id,
    month,
    day,
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
      status: RecordStatus.IDLE,
    })
    dbUser.records.push(todayRecord)
    await todayRecord.save()
    await dbUser.save()
  }

  return res.status(200).json(dbUser)
}

export default fetchData
