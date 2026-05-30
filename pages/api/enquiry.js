// POST /api/enquiry
// Receives booking form submissions, stores them, sends confirmation email

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const {
    name,
    phone,
    service,
    date,
    guests,
    budget,
    notes
  } = req.body

  // Basic validation
  if (!name || !phone || !service) {
    return res.status(400).json({ error: 'Name, phone and service are required' })
  }

  const enquiryData = {
    id: `ENQ-${Date.now()}`,
    timestamp: new Date().toISOString(),
    name,
    phone,
    service,
    date: date || 'TBD',
    guests: guests || 'Not specified',
    budget: budget || 'Not specified',
    notes: notes || '',
    status: 'new'
  }

  try {
    // ── If Resend API key is configured, send email notification to Didi
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)

      // Notify Didi
      await resend.emails.send({
        from: 'Chowby Didi Haus <hello@chowbydidihaus.com>',
        to: process.env.DIDI_EMAIL || 'chef@chowbydidihaus.com',
        subject: `New Enquiry: ${service} — ${name}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#f7f4f0;color:#1a1a1a;">
            <h1 style="font-style:italic;color:#e24b4a;margin-bottom:4px;">Chowby Didi Haus</h1>
            <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(226,75,74,0.5);margin-bottom:32px;">New Booking Enquiry</p>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:10px 0;border-bottom:1px solid #e8e4df;font-weight:600;width:140px;">Reference</td><td style="padding:10px 0;border-bottom:1px solid #e8e4df;">${enquiryData.id}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #e8e4df;font-weight:600;">Name</td><td style="padding:10px 0;border-bottom:1px solid #e8e4df;">${name}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #e8e4df;font-weight:600;">Phone/WhatsApp</td><td style="padding:10px 0;border-bottom:1px solid #e8e4df;">${phone}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #e8e4df;font-weight:600;">Service</td><td style="padding:10px 0;border-bottom:1px solid #e8e4df;color:#e24b4a;font-weight:600;">${service}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #e8e4df;font-weight:600;">Event Date</td><td style="padding:10px 0;border-bottom:1px solid #e8e4df;">${enquiryData.date}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #e8e4df;font-weight:600;">Guest Count</td><td style="padding:10px 0;border-bottom:1px solid #e8e4df;">${enquiryData.guests}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #e8e4df;font-weight:600;">Budget</td><td style="padding:10px 0;border-bottom:1px solid #e8e4df;">${enquiryData.budget}</td></tr>
              <tr><td style="padding:10px 0;font-weight:600;vertical-align:top;">Notes</td><td style="padding:10px 0;">${notes || '—'}</td></tr>
            </table>
            <div style="margin-top:32px;padding:16px;background:#e24b4a;text-align:center;">
              <p style="color:white;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0;">Reply within 24 hours to confirm availability</p>
            </div>
          </div>
        `
      })

      // Send confirmation to client
      await resend.emails.send({
        from: 'Chef Didi <hello@chowbydidihaus.com>',
        to: phone.includes('@') ? phone : process.env.DIDI_EMAIL,
        subject: `We received your enquiry — ${enquiryData.id}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#f7f4f0;color:#1a1a1a;">
            <h1 style="font-style:italic;color:#e24b4a;margin-bottom:4px;">Chowby Didi Haus</h1>
            <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(226,75,74,0.5);margin-bottom:32px;">Made to Hit Different</p>
            <p>Dear ${name},</p>
            <p style="line-height:1.8;color:rgba(26,26,26,0.65);margin:16px 0;">Thank you for your enquiry. We've received your request for <strong>${service}</strong> and will be in touch within 24 hours to confirm availability and discuss next steps.</p>
            <p style="line-height:1.8;color:rgba(26,26,26,0.65);">Your reference number is <strong>${enquiryData.id}</strong> — please keep this for your records.</p>
            <p style="line-height:1.8;color:rgba(26,26,26,0.65);margin-top:16px;font-style:italic;">With love,<br/>Chef Didi &amp; the Chowby Didi Haus team</p>
          </div>
        `
      })
    }

    return res.status(200).json({
      success: true,
      id: enquiryData.id,
      message: 'Enquiry received. We will contact you within 24 hours.'
    })

  } catch (error) {
    console.error('Enquiry handler error:', error)
    return res.status(500).json({ error: 'Failed to process enquiry. Please WhatsApp us directly.' })
  }
}
