import { UserProfile } from '@auth0/nextjs-auth0'

export const getUserData = async (user?: UserProfile) => {
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
}
