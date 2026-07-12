import { useState, useMemo } from 'react'
import { SERVICE_OPTIONS, SERVICE_FROM, naira, COLOR_THEMES, FLOWERS, ACCESSORIES, LIGHTING, VENUES, PRESETS } from '../lib/content'
import { waLink } from './Layout'

const BUDGETS = ['Under ₦100,000', '₦100,000 – ₦300,000', '₦300,000 – ₦600,000', '₦600,000 – ₦1,000,000', '₦1,000,000+']
const EMPTY_STYLE = { theme: '', venue: [], flowers: [], accessories: [], lighting: [] }

const toBase64 = (file) => new Promise((res, rej) => {
  const r = new FileReader(); r.onload = () => res(String(r.result).split(',').pop()); r.onerror = rej; r.readAsDataURL(file)
})

export default function BookingForm({ initialService = '', initialType = 'enquiry' }) {
  const [f, setF] = useState({
    name: '', phone: '', email: '', service: initialService, date: '',
    guests: '', budget: '', notes: '', company: '', type: initialType,
  })
  const [style, setStyle] = useState(EMPTY_STYLE)
  const [inspiration, setInspiration] = useState(null) // File
  const [status, setStatus] = useState({ state: 'idle', msg: '' })
  const [sent, setSent] = useState(null) // { id, wa } after a successful booking
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  // toggle a value in one of the multi-select style arrays
  const toggle = (group, val) => setStyle((s) => ({
    ...s, [group]: s[group].includes(val) ? s[group].filter((v) => v !== val) : [...s[group], val],
  }))
  const pickTheme = (name) => setStyle((s) => ({ ...s, theme: s.theme === name ? '' : name }))
  const applyPreset = (p) => setStyle({
    theme: p.theme, venue: p.venue || [], flowers: p.flowers || [],
    accessories: p.accessories || [], lighting: p.lighting || [],
  })

  const deposit = useMemo(() => {
    const from = SERVICE_FROM[f.service]
    return from ? { from, dep: Math.round(from / 2) } : null
  }, [f.service])

  // Compile the chosen decor into a readable summary line.
  const styleSummary = () => {
    const parts = []
    if (style.venue.length) parts.push(`Setting: ${style.venue.join(', ')}`)
    if (style.theme) parts.push(`Theme: ${style.theme}`)
    if (style.flowers.length) parts.push(`Flowers: ${style.flowers.join(', ')}`)
    if (style.accessories.length) parts.push(`Decor: ${style.accessories.join(', ')}`)
    if (style.lighting.length) parts.push(`Lighting: ${style.lighting.join(', ')}`)
    return parts.join('  •  ')
  }
  const composedNotes = () => {
    const s = styleSummary()
    return [f.notes, s && `Styling — ${s}`, inspiration && '📎 Inspiration photo attached']
      .filter(Boolean).join('\n')
  }

  // Build the WhatsApp message from a data object (+ optional reference)
  const buildWaMsg = (d, ref) =>
    `Hi Chowby Didi Haus! I'd like to book:\n` +
    (ref ? `• Ref: ${ref}\n` : '') +
    `• Name: ${d.name}\n• Phone: ${d.phone}\n• Email: ${d.email || '—'}\n` +
    `• Service: ${d.service}\n• Date: ${d.date || '—'}\n• Guests: ${d.guests || '—'}\n` +
    `• Budget: ${d.budget || '—'}\n• Notes: ${d.notes || '—'}`

  const submit = async () => {
    if (!f.name || !f.phone || !f.service) {
      setStatus({ state: 'err', msg: 'Please fill in Name, Phone & Service.' }); return
    }
    if (inspiration && inspiration.size > 6 * 1024 * 1024) {
      setStatus({ state: 'err', msg: 'Inspiration photo is too large (max 6MB).' }); return
    }
    setStatus({ state: 'loading', msg: 'Sending…' })
    const payload = { ...f, notes: composedNotes() }
    const snapshot = { ...payload }
    try {
      if (inspiration) {
        payload.inspirationData = await toBase64(inspiration)
        payload.inspirationName = inspiration.name
        payload.inspirationType = inspiration.type
      }
      const res = await fetch('/api/enquiry', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Failed')
      const wa = waLink(buildWaMsg(snapshot, j.id))
      setSent({ id: j.id, wa })
      setStatus({ state: 'ok', msg: '' })
      setF((s) => ({ ...s, name: '', phone: '', email: '', date: '', guests: '', budget: '', notes: '' }))
      setStyle(EMPTY_STYLE); setInspiration(null)
      // Best-effort: pop WhatsApp open so the details land with Didi in one tap.
      try { window.open(wa, '_blank') } catch {}
    } catch (e) {
      // Even if saving hiccuped, let them send via WhatsApp so nothing is lost.
      setSent({ id: null, wa: waLink(buildWaMsg(snapshot)) })
      setStatus({ state: 'err', msg: 'We couldn’t reach the server — please send your details on WhatsApp below.' })
    }
  }

  const waMessage = buildWaMsg({ ...f, notes: composedNotes() })

  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="grid2">
        <div className="field"><label>Your Name</label><input value={f.name} onChange={set('name')} placeholder="Full name" /></div>
        <div className="field"><label>Phone / WhatsApp</label><input value={f.phone} onChange={set('phone')} placeholder="+234…" /></div>
      </div>
      <div className="field"><label>Email</label><input type="email" value={f.email} onChange={set('email')} placeholder="you@email.com — for your confirmation" /></div>
      <div className="field">
        <label>Service</label>
        <select value={f.service} onChange={set('service')}>
          <option value="">Select a service…</option>
          {SERVICE_OPTIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="grid2">
        <div className="field"><label>Event Date</label><input type="date" value={f.date} onChange={set('date')} /></div>
        <div className="field"><label>Guest Count</label><input value={f.guests} onChange={set('guests')} placeholder="Approx. guests" /></div>
      </div>
      <div className="field">
        <label>Budget Range</label>
        <select value={f.budget} onChange={set('budget')}>
          <option value="">Select range…</option>
          {BUDGETS.map((b) => <option key={b}>{b}</option>)}
        </select>
      </div>
      <div className="field"><label>Additional Details</label><textarea rows={3} value={f.notes} onChange={set('notes')} placeholder="Theme, vision, anything special…" /></div>

      {/* ── Style your event (interactive) ── */}
      <div className="styler">
        <div style={{ margin: '4px 0 14px' }}>
          <div className="eyebrow">Optional</div>
          <div className="app-serif" style={{ fontSize: 20 }}>Style Your Event</div>
          <p className="note" style={{ marginTop: 4 }}>Pick a vibe and we’ll bring it to life — or leave it to Chef Blessing.</p>
        </div>

        <div className="styler__group">
          <div className="styler__label"><span className="dot" /> Quick Looks — one tap</div>
          <div className="pills">
            {PRESETS.map((p) => (
              <button type="button" key={p.name} className="pill" onClick={() => applyPreset(p)}>✨ {p.name}</button>
            ))}
          </div>
        </div>

        <div className="styler__group">
          <div className="styler__label"><span className="dot" /> Setting</div>
          <div className="pills">
            {VENUES.map((v) => (
              <button type="button" key={v} className={`pill ${style.venue.includes(v) ? 'on' : ''}`} onClick={() => toggle('venue', v)}>{v}</button>
            ))}
          </div>
        </div>

        <div className="styler__group">
          <div className="styler__label"><span className="dot" /> Colour Theme</div>
          <div className="swatches">
            {COLOR_THEMES.map((t) => (
              <button type="button" key={t.name} className={`swatch ${style.theme === t.name ? 'on' : ''}`} onClick={() => pickTheme(t.name)}>
                <span className="swatch__check">✓</span>
                <span className="swatch__colors">{t.colors.map((c, i) => <span key={i} style={{ background: c }} />)}</span>
                <span className="swatch__name">{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="styler__group">
          <div className="styler__label"><span className="dot" /> Flowers</div>
          <div className="pills">
            {FLOWERS.map((v) => (
              <button type="button" key={v} className={`pill ${style.flowers.includes(v) ? 'on' : ''}`} onClick={() => toggle('flowers', v)}>{v}</button>
            ))}
          </div>
        </div>

        <div className="styler__group">
          <div className="styler__label"><span className="dot" /> Decor & Accessories</div>
          <div className="pills">
            {ACCESSORIES.map((v) => (
              <button type="button" key={v} className={`pill ${style.accessories.includes(v) ? 'on' : ''}`} onClick={() => toggle('accessories', v)}>{v}</button>
            ))}
          </div>
        </div>

        <div className="styler__group">
          <div className="styler__label"><span className="dot" /> Lighting</div>
          <div className="pills">
            {LIGHTING.map((v) => (
              <button type="button" key={v} className={`pill ${style.lighting.includes(v) ? 'on' : ''}`} onClick={() => toggle('lighting', v)}>{v}</button>
            ))}
          </div>
        </div>

        <div className="styler__group">
          <div className="styler__label"><span className="dot" /> Inspiration Photo</div>
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setInspiration(e.target.files?.[0] || null)} />
          {inspiration && <p className="note" style={{ marginTop: 6 }}>📎 {inspiration.name} — we’ll style around it.</p>}
        </div>

        {styleSummary() && (
          <div className="styler__summary"><b>Your styling:</b> {styleSummary()}</div>
        )}
      </div>

      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden value={f.company} onChange={set('company')} />

      {deposit && (
        <div style={{ background: 'var(--cream)', border: '1px dashed var(--line)', borderRadius: 12, padding: 14, marginBottom: 14, fontSize: 14 }}>
          <strong>{f.service}</strong> starts from {naira(deposit.from)}. Estimated 50% deposit to hold your date:{' '}
          <strong style={{ color: 'var(--crimson)' }}>{naira(deposit.dep)}</strong>. Final quote within 24 hours.
        </div>
      )}

      {sent ? (
        <div style={{ background: 'var(--cream)', border: '1px solid var(--line)', borderRadius: 14, padding: 18, textAlign: 'center' }}>
          {sent.id
            ? <p className="msg-ok" style={{ margin: '0 0 4px', fontWeight: 600 }}>✓ Received — your reference is {sent.id}</p>
            : <p className="msg-err" style={{ margin: '0 0 4px', fontWeight: 600 }}>Couldn’t reach the server</p>}
          <p className="note" style={{ marginTop: 0 }}>
            {sent.id ? 'We’ll reply within 24 hours. Tap below to also send your details to us on WhatsApp.'
                     : 'Send your details straight to us on WhatsApp so we don’t miss your booking.'}
          </p>
          <a className="btn btn--wa" href={sent.wa} target="_blank" rel="noopener">📲 Send my booking on WhatsApp</a>
          <button className="btn btn--ghost" style={{ marginTop: 10 }} onClick={() => { setSent(null); setStatus({ state: 'idle', msg: '' }) }}>Make another booking</button>
        </div>
      ) : (
        <>
          <button className="btn" onClick={submit} disabled={status.state === 'loading'}>
            {status.state === 'loading' ? 'Sending…' : 'Send Enquiry — Secure Your Date'}
          </button>
          <a className="btn btn--wa" style={{ marginTop: 10 }} href={waLink(waMessage)} target="_blank" rel="noopener">Or continue on WhatsApp →</a>
          {status.msg && <p className={`note ${status.state === 'err' ? 'msg-err' : ''}`}>{status.msg}</p>}
          <p className="note">Confirmation within 24 hours · Deposit required to hold date · All deposits non-refundable</p>
        </>
      )}
    </div>
  )
}
