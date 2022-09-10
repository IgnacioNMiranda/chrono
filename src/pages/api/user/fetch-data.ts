import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from 'database/models'
import { connectToDatabase } from 'database/connection'

const fetchData = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return res.status(400).end('Bad request')

  if (!req.query.email || !req.query.provider)
    return res.status(400).end('Bad request. Missing parameters')
  const { email, provider } = req.query

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

  return res.status(200).json(dbUser)
}

export default fetchData
