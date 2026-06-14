// GET   /api/admin/receipts            → list receipts (no file blobs)
// GET   /api/admin/receipts?id=RCP-...  → stream a single receipt file
// PATCH /api/admin/receipts  { id, status }  → update a receipt's status
// Protected by a bearer token (ADMIN_TOKEN).

import { getReceipts, getReceipt, updateReceiptStatus, usingPostgres } from '../../../lib/db'
import { requireAdmin } from '../../../lib/adminAuth'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  if (req.method === 'PATCH') {
    const { id, status } = req.body || {}
    if (!id || !status) {
      return res.status(400).json({ error: 'id and status are required' })
    }
    try {
      const ok = await updateReceiptStatus(id, status)
      if (!ok) return res.status(404).json({ error: 'Receipt not found' })
      return res.status(200).json({ success: true })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Single receipt file download/view
    if (req.query.id) {
      const r = await getReceipt(req.query.id)
      if (!r) return res.status(404).json({ error: 'Receipt not found' })
      const fileData = r.file_data ?? r.fileData
      const fileType = r.file_type ?? r.fileType ?? 'application/octet-stream'
      const fileName = r.file_name ?? r.fileName ?? 'receipt'
      const buffer = Buffer.from(fileData, 'base64')
      res.setHeader('Content-Type', fileType)
      res.setHeader('Content-Disposition', `inline; filename="${fileName}"`)
      return res.status(200).send(buffer)
    }

    const receipts = await getReceipts({ includeFile: false })
    return res.status(200).json({
      store: usingPostgres() ? 'postgres' : 'local-file',
      count: receipts.length,
      receipts,
    })
  } catch (error) {
    console.error('Admin receipts error:', error)
    return res.status(500).json({ error: 'Failed to load receipts' })
  }
}
