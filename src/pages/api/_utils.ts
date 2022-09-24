import { label, Middleware } from 'next-api-middleware'

const history: Record<string, Record<'date' | 'times', number>> = {}

const canMakeRequest: Middleware = async (req, res, next) => {
  const clientIp =
    (((req.headers['x-real-ip'] as string) || '').split(',').pop() || '').trim() ||
    req.socket.remoteAddress

  if (!clientIp) {
    res.status(500)
    return res.json({ error: 'Unexpected error' })
  }

  // If last call arrived later than "now - 10 minutes", rate-limit user
  if (
    history[clientIp] &&
    history[clientIp].times >= 10 &&
    history[clientIp].date > Date.now() - 10 * 60 * 1000
  ) {
    res.status(429)
    return res.json({ error: 'Too many requests' })
  }

  if (
    typeof history[clientIp] === 'undefined' ||
    history[clientIp].date < Date.now() - 10 * 60 * 1000
  ) {
    history[clientIp] = {
      date: Date.now(),
      times: 1,
    }
  } else history[clientIp].times += 1

  await next()
}

export const withMiddleware = label({
  canMakeRequest,
})
