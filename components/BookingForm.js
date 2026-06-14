import { useState, useMemo } from 'react'
import { SERVICE_OPTIONS, SERVICE_FROM, naira } from '../lib/content'
import { waLink } from './Layout'

const BUDGETS = ['Under ₦100,000', '₦100,000 – ₦300,000', '₦300,000 – ₦600,000', '₦600,000 – ₦1,000,000', '₦1,000,000+']

export default function BookingForm({ initialService = '', initialType = 'enquiry' }) {
  const [f, setF] = useState({
    name: '', phone: '', email: '', service: initialService, date: '',
    guests: '', budget: '', notes: '', company: '', type: initialType,
  })
  const [status, setStatus] = useState({ state: 'idle', msg: '' })
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  const deposit = useMemo(() => {
    const from = SERVICE_FROM[f.service]
    return from ? { from, dep: Math.round(from / 2) } : null
  }, [f.service])

  const submit = async () => {
    if (!f.name || !f.phone || !f.service) {
      setStatus({ state: 'err', msg: 'Please fill in Name, Phone & Service.' }); return
    }
    setStatus({ state: 'loading', msg: 'Sending…' })
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Failed')
      setStatus({ state: 'ok', msg: `✓ Received — your reference is ${j.id}. We’ll reply within 24 hours.` })
      setF((s) => ({ ...s, name: '', phone: '', email: '', date: '', guests: '', budget: '', notes: '' }))
    } catch (e) {
      setStatus({ state: 'err', msg: 'Something went wrong — please WhatsApp us directly.' })
    }
  }

  const waMessage =
    `Hi Chowby Didi Haus! I'd like to book:\n• Name: ${f.name}\n• Service: ${f.service}\n• Date: ${f.date}\n• Guests: ${f.guests}\n• Budget: ${f.budget}\n• Notes: ${f.notes}`

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
      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden value={f.company} onChange={set('company')} />

      {deposit && (
        <div style={{ background: 'var(--cream)', border: '1px dashed var(--line)', borderRadius: 12, padding: 14, marginBottom: 14, fontSize: 14 }}>
          <strong>{f.service}</strong> starts from {naira(deposit.from)}. Estimated 50% deposit to hold your date:{' '}
          <strong style={{ color: 'var(--crimson)' }}>{naira(deposit.dep)}</strong>. Final quote within 24 hours.
        </div>
      )}

      <button className="btn" onClick={submit} disabled={status.state === 'loading'}>
        {status.state === 'loading' ? 'Sending…' : 'Send Enquiry — Secure Your Date'}
      </button>
      <a className="btn btn--wa" style={{ marginTop: 10 }} href={waLink(waMessage)} target="_blank" rel="noopener">Or continue on WhatsApp →</a>

      {status.msg && <p className={`note ${status.state === 'ok' ? 'msg-ok' : status.state === 'err' ? 'msg-err' : ''}`}>{status.msg}</p>}
      <p className="note">Confirmation within 24 hours · Deposit required to hold date · All deposits non-refundable</p>
    </div>
  )
}
