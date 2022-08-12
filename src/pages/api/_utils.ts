import { NextApiRequest } from 'next'

const history: Record<string, number> = {}

export const canMakeRequest = async (req: NextApiRequest) => {
  const clientIp = req.headers['client-ip'] as string
  // If last call arrived later than "now - 10 minutes", rate-limit user
  if (history[clientIp] > Date.now() - 10 * 60 * 1000) {
    return true
  }

  history[clientIp] = Date.now()

  return false
}
