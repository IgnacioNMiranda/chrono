import { UserProfile } from '@auth0/nextjs-auth0'
import { HydratedDocument } from 'mongoose'
import { IUser } from '../database/models'

export const getUserData = async (user?: UserProfile): Promise<HydratedDocument<IUser>> => {
  const invalidDataError = new Error('Invalid Data')

  if (!user) throw invalidDataError
  const { email, sub } = user
  if (!email || !sub) throw invalidDataError

  const provider = sub?.split('|')[0]

  const uri = `/api/user/fetch-data?email=${email}&provider=${provider}`

  const response = await fetch(uri)

  if (response.ok) {
    const json = await response.json()
    return json
  }
  throw new Error('User data could not be retrieved. Try again later')
}
