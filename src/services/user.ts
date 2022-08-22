import { UserProfile } from '@auth0/nextjs-auth0'
import { HydratedDocument } from 'mongoose'
import { IUser } from '../database/models'

export const getUserData = async (
  user?: UserProfile,
  locale?: string,
): Promise<HydratedDocument<IUser>> => {
  const invalidDataError = new Error('Invalid Data')

  if (!user) throw invalidDataError
  const { email, sub } = user
  if (!email || !sub) throw invalidDataError

  const provider = sub?.split('|')[0]

  const uri = `/api/user/fetch-data?email=${email}&provider=${provider}&locale=${locale}`

  const response = await fetch(uri)

  if (response.ok) {
    const json = await response.json()
    return json
  }
  throw new Error('' + response.status)
}

export const updateUserData = async ({
  name,
  nick,
  backgroundImage,
  thumbnailImage,
}: {
  name: string
  nick: string
  backgroundImage: string
  thumbnailImage: string
}) => {
  const uri = '/api/user/update'

  const response = await fetch(uri, {
    method: 'PATCH',
    body: JSON.stringify({
      name,
      nick,
      backgroundImage,
      thumbnailImage,
    }),
  })

  if (response.ok) {
    const json = await response.json()
    return json
  }
  throw new Error('' + response.status)
}
