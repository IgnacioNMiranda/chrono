import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase, User } from '../../../database'

const fetchData = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return res.status(400).end('Bad request')

  const { email, provider } = req.query
  if (!email || !provider) return res.status(400).end('Bad request. Missing parameters')

  await connectToDatabase()

  const dbUser = await User.findOne({ email, provider })
  if (!dbUser) return res.status(404).end('Unexpected error. Please contact support')

  return res.status(200).json(dbUser)
}

export default fetchData
