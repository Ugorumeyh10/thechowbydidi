// POST /api/receipt
// Receives a bank-transfer payment receipt (image/PDF as base64), stores it,
// emails it to Didi, and confirms to the customer.

import { saveReceipt } from '../../lib/db'
import { sendMail, emailConfigured } from '../../lib/mailer'
import { notifyTeam } from '../../lib/notify'
import { getClientIp, rateLimited, isBot, detectFileType } from '../../lib/security'

// Receipts (photos/PDFs) can exceed Next's default 1mb body limit.
export const config = {
  api: { bodyParser: { sizeLimit: '8mb' } },
  maxDuration: 30,
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
const MAX_BYTES = 6 * 1024 * 1024 // 6 MB

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Spam protection: honeypot + per-IP rate limit
  if (isBot(req.body)) {
    return res.status(200).json({ success: true, id: 'RCP-ignored' })
  }
  if (rateLimited(`receipt:${getClientIp(req)}`, { max: 5, windowMs: 60_000 })) {
    return res.status(429).json({ error: 'Too many requests. Please try again shortly.' })
  }

  const { name, email, reference, amount, fileName, fileType, fileData } = req.body

  if (!name || !fileData) {
    return res.status(400).json({ error: 'Name and a receipt file are required' })
  }

  // fileData is a base64 string (without the data: prefix). Validate size.
  const base64 = String(fileData).includes(',') ? String(fileData).split(',').pop() : fileData
  const approxBytes = Math.floor((base64.length * 3) / 4)
  if (approxBytes > MAX_BYTES) {
    return res.status(413).json({ error: 'Receipt is too large (max 6 MB)' })
  }

  // Verify the actual file content by magic bytes — don't trust the claimed MIME.
  const detected = detectFileType(base64)
  if (!detected || !ALLOWED_TYPES.includes(detected)) {
    return res.status(400).json({ error: 'Receipt must be a real JPG, PNG, WEBP or PDF file' })
  }

  const receipt = {
    id: `RCP-${Date.now()}`,
    timestamp: new Date().toISOString(),
    name,
    email: email || '',
    reference: reference || '',
    amount: amount || '',
    fileName: fileName || 'receipt',
    fileType: detected,
    fileData: base64,
    status: 'pending',
  }

  try {
    await saveReceipt(receipt)

    // ── Alert the team (Slack / WhatsApp Cloud API — no-op if unconfigured)
    notifyTeam(`💸 New payment receipt — ${name}${amount ? ' · ' + amount : ''}${reference ? ' · ref ' + reference : ''} (${receipt.id})`)

    // Email is best-effort — must NEVER fail the receipt upload.
    try {
    if (emailConfigured()) {
      // Notify Didi with the receipt attached
      await sendMail({
        to: process.env.DIDI_EMAIL || 'chef@chowbydidihaus.com',
        subject: `Payment receipt: ${receipt.amount || 'transfer'} — ${name}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#f7f4f0;color:#1a1a1a;">
            <h1 style="font-style:italic;color:#e24b4a;margin-bottom:4px;">Chowby Didi Haus</h1>
            <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(226,75,74,0.5);margin-bottom:32px;">New Payment Receipt</p>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:10px 0;border-bottom:1px solid #e8e4df;font-weight:600;width:140px;">Receipt ID</td><td style="padding:10px 0;border-bottom:1px solid #e8e4df;">${receipt.id}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #e8e4df;font-weight:600;">Name</td><td style="padding:10px 0;border-bottom:1px solid #e8e4df;">${name}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #e8e4df;font-weight:600;">Booking Ref</td><td style="padding:10px 0;border-bottom:1px solid #e8e4df;">${receipt.reference || '—'}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #e8e4df;font-weight:600;">Amount</td><td style="padding:10px 0;border-bottom:1px solid #e8e4df;color:#e24b4a;font-weight:600;">${receipt.amount || '—'}</td></tr>
              <tr><td style="padding:10px 0;font-weight:600;">Email</td><td style="padding:10px 0;">${receipt.email || '—'}</td></tr>
            </table>
            <p style="margin-top:24px;color:rgba(26,26,26,0.65);">The receipt file is attached. Confirm the transfer before securing the date.</p>
          </div>
        `,
        attachments: [{ filename: receipt.fileName, content: base64 }],
      })

      // Confirm to the customer if they gave an email
      if (receipt.email) {
        await sendMail({
          to: receipt.email,
          subject: `We received your payment receipt — ${receipt.id}`,
          html: `
            <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#f7f4f0;color:#1a1a1a;">
              <h1 style="font-style:italic;color:#e24b4a;margin-bottom:4px;">Chowby Didi Haus</h1>
              <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(226,75,74,0.5);margin-bottom:32px;">Made to Hit Different</p>
              <p>Dear ${name},</p>
              <p style="line-height:1.8;color:rgba(26,26,26,0.65);margin:16px 0;">Thank you — we've received your payment receipt${receipt.reference ? ` for booking <strong>${receipt.reference}</strong>` : ''}. Our team will verify the transfer and confirm your booking within 24 hours.</p>
              <p style="line-height:1.8;color:rgba(26,26,26,0.65);">Your receipt reference is <strong>${receipt.id}</strong>.</p>
              <p style="line-height:1.8;color:rgba(26,26,26,0.65);margin-top:16px;font-style:italic;">With love,<br/>Chef Didi &amp; the Chowby Didi Haus team</p>
            </div>
          `,
        })
      }
    }
    } catch (mailErr) {
      console.error('Email send failed (receipt was saved):', mailErr)
    }

    return res.status(200).json({
      success: true,
      id: receipt.id,
      message: 'Receipt received. We will verify and confirm within 24 hours.',
    })
  } catch (error) {
    console.error('Receipt handler error:', error)
    return res.status(500).json({ error: 'Failed to upload receipt. Please WhatsApp us directly.' })
  }
}
