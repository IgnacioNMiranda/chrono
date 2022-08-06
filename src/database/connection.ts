import { connect } from 'mongoose'
import { environment } from '../config/environment'

let cachedClient: typeof import('mongoose') | null = null

export const connectToDatabase = async () => {
  if (cachedClient) {
    return { client: cachedClient }
  }

  const client = await connect(environment.db.uri, {})

  cachedClient = client

  return { client }
}
