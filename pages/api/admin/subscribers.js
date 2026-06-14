// GET /api/admin/subscribers → list newsletter subscribers. Token protected.

import { getSubscribers, usingPostgres } from '../../../lib/db'
import { requireAdmin } from '../../../lib/adminAuth'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const subscribers = await getSubscribers()
    return res.status(200).json({
      store: usingPostgres() ? 'postgres' : 'local-file',
      count: subscribers.length,
      subscribers,
    })
  } catch (error) {
    console.error('Admin subscribers error:', error)
    return res.status(500).json({ error: 'Failed to load subscribers' })
  }
}
