import { useState } from 'react'

const BANK = {
  name: process.env.NEXT_PUBLIC_BANK_NAME || 'First Bank',
  account: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || 'Christopher Blessing',
  number: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || '3114512287',
}

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).split(',').pop())
    r.onerror = reject
    r.readAsDataURL(file)
  })

export default function ReceiptForm() {
  const [f, setF] = useState({ name: '', email: '', reference: '', amount: '', company: '' })
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState({ state: 'idle', msg: '' })
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  const submit = async () => {
    if (!f.name || !file) { setStatus({ state: 'err', msg: 'Add your name and a receipt file.' }); return }
    if (file.size > 6 * 1024 * 1024) { setStatus({ state: 'err', msg: 'File too large (max 6MB).' }); return }
    setStatus({ state: 'loading', msg: 'Uploading…' })
    try {
      const fileData = await toBase64(file)
      const res = await fetch('/api/receipt', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, fileName: file.name, fileType: file.type, fileData }),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Failed')
      setStatus({ state: 'ok', msg: `✓ Received — reference ${j.id}. We’ll verify within 24 hours.` })
      setF({ name: '', email: '', reference: '', amount: '', company: '' }); setFile(null)
    } catch {
      setStatus({ state: 'err', msg: 'Upload failed — please WhatsApp us the receipt.' })
    }
  }

  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="eyebrow">Secure your date</div>
      <h3 className="app-italic" style={{ fontSize: 24, margin: '6px 0 6px' }}>Pay by Bank Transfer</h3>
      <p className="lead" style={{ fontSize: 14 }}>Send your deposit to the account below, then upload your receipt. We verify and confirm within 24 hours. (Card payment coming soon.)</p>

      <div className="bank">
        <div className="bank__cell"><div className="bank__k">Bank</div><div className="bank__v">{BANK.name}</div></div>
        <div className="bank__cell"><div className="bank__k">Account Name</div><div className="bank__v">{BANK.account}</div></div>
        <div className="bank__cell" style={{ gridColumn: '1 / -1' }}><div className="bank__k">Account Number</div><div className="bank__v" style={{ letterSpacing: 1 }}>{BANK.number}</div></div>
      </div>

      <div className="grid2">
        <div className="field"><label>Your Name</label><input value={f.name} onChange={set('name')} placeholder="Full name" /></div>
        <div className="field"><label>Email</label><input type="email" value={f.email} onChange={set('email')} placeholder="you@email.com" /></div>
        <div className="field"><label>Booking Reference</label><input value={f.reference} onChange={set('reference')} placeholder="ENQ-… (optional)" /></div>
        <div className="field"><label>Amount Paid</label><input value={f.amount} onChange={set('amount')} placeholder="e.g. ₦150,000" /></div>
      </div>
      <div className="field">
        <label>Receipt (JPG, PNG or PDF · max 6MB)</label>
        <input type="file" accept="image/png,image/jpeg,image/webp,application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>
      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden value={f.company} onChange={set('company')} />

      <button className="btn" onClick={submit} disabled={status.state === 'loading'}>
        {status.state === 'loading' ? 'Uploading…' : 'Upload Receipt'}
      </button>
      {status.msg && <p className={`note ${status.state === 'ok' ? 'msg-ok' : status.state === 'err' ? 'msg-err' : ''}`}>{status.msg}</p>}
    </div>
  )
}
