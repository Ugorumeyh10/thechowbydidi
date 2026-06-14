// Outbound notifications to the Chowby Didi Haus team.
// All channels are optional and no-op unless their env vars are configured —
// so the app works fine with none of them set.

// ── Slack (free Incoming Webhook) ─────────────────────────────────────────────
// Create one at https://api.slack.com/messaging/webhooks and set SLACK_WEBHOOK_URL.
export async function sendSlack(text) {
  const url = process.env.SLACK_WEBHOOK_URL
  if (!url) return
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
  } catch (err) {
    console.error('Slack notify failed:', err)
  }
}

// ── WhatsApp Cloud API (free tier) ────────────────────────────────────────────
// Set WHATSAPP_TOKEN, WHATSAPP_PHONE_ID and WHATSAPP_TO (Didi's number, digits only).
// Note: outside the 24h window, Cloud API only allows pre-approved template
// messages. We send a plain text message which works in test/24h-session mode;
// configure WHATSAPP_TEMPLATE to send an approved template name instead.
export async function sendWhatsApp(text) {
  const token = process.env.WHATSAPP_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_ID
  const to = (process.env.WHATSAPP_TO || '').replace(/[^0-9]/g, '')
  if (!token || !phoneId || !to) return

  const body = process.env.WHATSAPP_TEMPLATE
    ? {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: { name: process.env.WHATSAPP_TEMPLATE, language: { code: 'en' } },
      }
    : {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: text },
      }

  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) console.error('WhatsApp notify failed:', await res.text())
  } catch (err) {
    console.error('WhatsApp notify failed:', err)
  }
}

// Fan out to all configured channels at once.
export async function notifyTeam(text) {
  await Promise.allSettled([sendSlack(text), sendWhatsApp(text)])
}
