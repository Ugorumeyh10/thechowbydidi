// GET   /api/admin/enquiries           → list all enquiries
// PATCH /api/admin/enquiries  { id, status }  → update an enquiry's status
// Protected by a bearer token (ADMIN_TOKEN).

import { getEnquiries, updateEnquiryStatus, usingPostgres } from '../../../lib/db'
import { requireAdmin } from '../../../lib/adminAuth'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  if (req.method === 'PATCH') {
    const { id, status } = req.body || {}
    if (!id || !status) {
      return res.status(400).json({ error: 'id and status are required' })
    }
    try {
      const ok = await updateEnquiryStatus(id, status)
      if (!ok) return res.status(404).json({ error: 'Enquiry not found' })
      return res.status(200).json({ success: true })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const enquiries = await getEnquiries()
    return res.status(200).json({
      store: usingPostgres() ? 'postgres' : 'local-file',
      count: enquiries.length,
      enquiries,
    })
  } catch (error) {
    console.error('Admin enquiries error:', error)
    return res.status(500).json({ error: 'Failed to load enquiries' })
  }
}
