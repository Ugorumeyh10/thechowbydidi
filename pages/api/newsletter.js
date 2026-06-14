// POST /api/newsletter — subscribe an email to the mailing list.

import { saveSubscriber } from '../../lib/db'
import { notifyTeam } from '../../lib/notify'
import { getClientIp, rateLimited, isBot } from '../../lib/security'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (isBot(req.body)) {
    return res.status(200).json({ success: true }) // silently drop bots
  }
  if (rateLimited(`newsletter:${getClientIp(req)}`, { max: 5, windowMs: 60_000 })) {
    return res.status(429).json({ error: 'Too many requests. Please try again shortly.' })
  }

  const { email, source } = req.body
  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'A valid email is required' })
  }

  try {
    await saveSubscriber(email, source || 'website')
    notifyTeam(`📨 New newsletter subscriber: ${email}`)
    return res.status(200).json({ success: true, message: 'Subscribed. Welcome to the Haus.' })
  } catch (error) {
    console.error('Newsletter error:', error)
    return res.status(500).json({ error: 'Could not subscribe. Please try again.' })
  }
}
