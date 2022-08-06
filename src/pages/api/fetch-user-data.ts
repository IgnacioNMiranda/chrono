import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../database'

const endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectToDatabase()
  res.status(200).json({ name: 'John Doe' })
}

export default endpoint
