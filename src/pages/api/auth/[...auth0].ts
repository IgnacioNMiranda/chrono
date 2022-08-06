import { handleAuth, handleCallback, AfterCallback } from '@auth0/nextjs-auth0'
import { connectToDatabase, User } from '../../../database'

const afterCallback: AfterCallback = async (req, res, session, state) => {
  if (!session) {
    throw new Error('Unexpected error. Try again later')
  }

  await connectToDatabase()

  const email = session?.user.email
  const provider = session?.user.sub.split('|')[0]

  const user = await User.findOne({ email, provider }).exec()
  console.log(user)

  if (!user) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    const newUser = new User({
      email,
      provider,
      timezone,
      records: [],
    })
    await newUser.save()
  }

  return session
}

export default handleAuth({
  async callback(req, res) {
    try {
      await handleCallback(req, res, { afterCallback })
    } catch (error: any) {
      res.status(error.status || 500).end(error.message)
    }
  },
})

/**
  user: {
    given_name: 'Ignacio',
    family_name: 'Miranda Figueroa',
    nickname: 'i.miranda.f99',
    name: 'Ignacio Miranda Figueroa',
    picture: 'https://lh3.googleusercontent.com/a/AItbvmlWOsbjkRTHbYs8uJ62m2vWGwPwitBDF4rW0kEq=s96-c',
    locale: 'en',
    updated_at: '2022-08-06T17:26:52.396Z',
    email: 'i.miranda.f99@gmail.com',
    email_verified: true,
    sub: 'google-oauth2|115808732162191110709'
  }


   user: {
    nickname: 'i.miranda.f99',
    name: 'i.miranda.f99@gmail.com',
    picture: 'https://s.gravatar.com/avatar/91961f0c7312870fa091b43b31ba4a73?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fi.png',
    updated_at: '2022-08-06T17:31:31.793Z',
    email: 'i.miranda.f99@gmail.com',
    email_verified: false,
    sub: 'auth0|62e9ca16282570c0ea38676f'
  },
 */
