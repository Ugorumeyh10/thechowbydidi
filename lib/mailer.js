// Email sending. Two backends, picked automatically:
//   1. Gmail SMTP (nodemailer) — if GMAIL_USER + GMAIL_APP_PASSWORD are set.
//      Sends FROM your Gmail; works to any recipient with no domain verification.
//   2. Resend — if RESEND_API_KEY is set (needs a verified sending domain).
// If neither is configured, sendMail() is a silent no-op (forms still save).

let _transporter

async function gmailTransporter() {
  if (_transporter) return _transporter
  const nodemailer = (await import('nodemailer')).default
  _transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
  return _transporter
}

export function emailConfigured() {
  return Boolean(
    (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) ||
      process.env.RESEND_API_KEY
  )
}

// attachments: [{ filename, content }] where content is base64 (no data: prefix)
export async function sendMail({ to, subject, html, attachments = [] }) {
  if (!to) return

  // Prefer Gmail SMTP — no domain verification required.
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    const t = await gmailTransporter()
    const fromName = process.env.MAIL_FROM_NAME || 'Chowby Didi Haus'
    await t.sendMail({
      from: `"${fromName}" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
      attachments: attachments.map((a) => ({
        filename: a.filename,
        content: a.content,
        encoding: 'base64',
      })),
    })
    return
  }

  // Fallback: Resend
  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    const from = process.env.MAIL_FROM || 'Chowby Didi Haus <hello@chowbydidihaus.com>'
    await resend.emails.send({ from, to, subject, html, attachments })
    return
  }
}
