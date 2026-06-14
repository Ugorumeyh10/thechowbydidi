// GET /api/admin/export?type=enquiries|receipts|subscribers → CSV download.
// Token protected.

import { getEnquiries, getReceipts, getSubscribers } from '../../../lib/db'
import { requireAdmin } from '../../../lib/adminAuth'

function toCsv(rows) {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const escape = (v) => {
    if (v === null || v === undefined) return ''
    const s = String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = [headers.join(',')]
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(','))
  }
  return lines.join('\n')
}

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const type = req.query.type || 'enquiries'
  try {
    let rows
    if (type === 'enquiries') rows = await getEnquiries()
    else if (type === 'receipts') rows = await getReceipts({ includeFile: false })
    else if (type === 'subscribers') rows = await getSubscribers()
    else return res.status(400).json({ error: 'Invalid type' })

    const csv = toCsv(rows)
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="${type}-${Date.now()}.csv"`)
    return res.status(200).send(csv)
  } catch (error) {
    console.error('Admin export error:', error)
    return res.status(500).json({ error: 'Failed to export' })
  }
}
