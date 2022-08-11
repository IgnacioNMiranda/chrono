import { handleAuth, handleCallback, AfterCallback } from '@auth0/nextjs-auth0'
import { connectToDatabase } from '../../../database/connection'
import { User } from '../../../database/models'

const afterCallback: AfterCallback = async (req, res, session, state) => {
  if (!session) {
    throw new Error('Unexpected error. Try again later')
  }

  await connectToDatabase()

  const email = session?.user.email
  const provider = session?.user.sub.split('|')[0]

  const user = await User.findOne({ email, provider }).exec()

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
