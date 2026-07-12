// Email sending. Two backends, picked automatically:
//   1. Gmail SMTP (nodemailer) — if GMAIL_USER + GMAIL_APP_PASSWORD are set.
//      Sends FROM your Gmail; works to any recipient with no domain verification.
//   2. Resend — if RESEND_API_KEY is set (needs a verified sending domain).
// If neither is configured, sendMail() is a silent no-op (forms still save).

let _transporter

async function gmailTransporter() {
  if (_transporter) return _transporter
  const nodemailer = (await import('nodemailer')).default
  // Use port 587 (STARTTLS) explicitly — more widely allowed than 465, which
  // some networks/hosts block.
  _transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    // Fail fast on serverless instead of hanging past the function time limit.
    connectionTimeout: 7000,
    greetingTimeout: 5000,
    socketTimeout: 7000,
    pool: false,
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
