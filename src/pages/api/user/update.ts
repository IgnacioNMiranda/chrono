import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from '../../../database/models'
import { connectToDatabase } from '../../../database/connection'
import { environment } from '../../../config/environment'

const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PATCH') return res.status(400).end('Bad request')

  const body = JSON.parse(req.body)

  if (!body.name || !body.nick || !body.email || !body.id || !body.provider) {
    return res.status(400).end('Bad request. Some parameters are missing or bad formatted')
  }

  const { name, nick, email, id, backgroundImage, thumbnailImage, provider } = body

  const auth0TokenResponse = await fetch(`${environment.auth0.domain}/oauth/token`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: environment.auth0.m2mClientId,
      client_secret: environment.auth0.m2mClientSecret,
      audience: `${environment.auth0.domain}/api/v2/`,
    }),
  })

  if (!auth0TokenResponse.ok) return res.status(400).end('Bad request. Invalid credentials')

  const auth0Token = await auth0TokenResponse.json()

  const query = `email=${email}&fields=user_id`
  const auth0UsersResponse = await fetch(
    `${environment.auth0.domain}/api/v2/users-by-email?${query}`,
    {
      headers: {
        authorization: `Bearer ${auth0Token.access_token}`,
      },
    },
  )
  if (!auth0UsersResponse.ok) return res.status(404).end('User not found')

  const auth0Users: {
    user_id: string
  }[] = await auth0UsersResponse.json()
  const auth0UserId = auth0Users.find((user) => user.user_id.startsWith(provider))?.user_id

  const updateUserResponse = await fetch(
    `${environment.auth0.domain}/api/v2/users/${auth0UserId}`,
    {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${auth0Token.access_token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        given_name: name,
        nickname: nick,
      }),
    },
  )

  if (!updateUserResponse.ok)
    return res.status(400).end('User could not be updated. Try again later')

  try {
    await connectToDatabase()
  } catch (error) {
    return res.status(504).end('Server is not responding...')
  }

  const dbUser = await User.findById(id).exec()
  if (!dbUser) return res.status(404).end('Unexpected error. Please contact support')

  dbUser.backgroundImage = backgroundImage
  dbUser.thumbnailImage = thumbnailImage

  try {
    await dbUser.save()
  } catch (error) {
    return res.status(500).end('Unexpected error. Please contact support')
  }

  return res.status(200).json(dbUser)
}

export default updateUser
