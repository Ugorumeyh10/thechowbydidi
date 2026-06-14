import Head from 'next/head'
import { useEffect, useState, useCallback, useMemo } from 'react'

const RED = '#e24b4a'
const CREAM = '#f7f4f0'
const INK = '#1a1a1a'
const PAGE_SIZE = 20

const STATUS_COLORS = {
  new: '#8a8a8a', contacted: '#c9a84c', booked: '#2d7a4f', closed: '#b0a99e',
  pending: '#c9a84c', verified: '#2d7a4f', rejected: '#c0392b',
}

export default function Admin() {
  const [token, setToken] = useState('')
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState('enquiries')
  const [enquiries, setEnquiries] = useState([])
  const [receipts, setReceipts] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [store, setStore] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(0)

  useEffect(() => {
    const saved = typeof window !== 'undefined' && localStorage.getItem('cdh_admin_token')
    if (saved) { setToken(saved); setAuthed(true) }
  }, [])

  const load = useCallback(async (tk) => {
    setLoading(true); setError('')
    try {
      const headers = { Authorization: `Bearer ${tk}` }
      const [eRes, rRes, sRes] = await Promise.all([
        fetch('/api/admin/enquiries', { headers }),
        fetch('/api/admin/receipts', { headers }),
        fetch('/api/admin/subscribers', { headers }),
      ])
      if ([eRes, rRes, sRes].some((r) => r.status === 401)) throw new Error('Invalid token')
      const eJson = await eRes.json()
      const rJson = await rRes.json()
      const sJson = await sRes.json()
      setEnquiries(eJson.enquiries || [])
      setReceipts(rJson.receipts || [])
      setSubscribers(sJson.subscribers || [])
      setStore(eJson.store || '')
      setAuthed(true)
      localStorage.setItem('cdh_admin_token', tk)
    } catch (err) {
      setError(err.message || 'Failed to load'); setAuthed(false)
      localStorage.removeItem('cdh_admin_token')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => {
    if (authed && token) load(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed])

  useEffect(() => { setPage(0) }, [tab, query, statusFilter])

  const logout = () => {
    localStorage.removeItem('cdh_admin_token')
    setToken(''); setAuthed(false); setEnquiries([]); setReceipts([]); setSubscribers([])
  }

  const fmt = (d) => { try { return new Date(d).toLocaleString() } catch { return d } }

  // Auto-link receipts to enquiries by reference
  const receiptsByRef = useMemo(() => {
    const map = {}
    for (const r of receipts) {
      const ref = (r.reference || '').trim()
      if (ref) (map[ref] = map[ref] || []).push(r)
    }
    return map
  }, [receipts])

  // PATCH a status and update local state in place
  const setStatus = async (kind, id, status) => {
    try {
      const res = await fetch(`/api/admin/${kind}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Update failed')
      const setter = kind === 'enquiries' ? setEnquiries : setReceipts
      setter((rows) => rows.map((r) => (r.id === id ? { ...r, status } : r)))
    } catch (err) { setError(err.message) }
  }

  // Search + status filtering
  const filterRows = (rows) => {
    const q = query.trim().toLowerCase()
    return rows.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false
      if (!q) return true
      return Object.values(r).some((v) => String(v ?? '').toLowerCase().includes(q))
    })
  }

  const activeRows = tab === 'enquiries' ? enquiries : tab === 'receipts' ? receipts : subscribers
  const filtered = tab === 'subscribers'
    ? subscribers.filter((s) => !query.trim() || s.email.includes(query.trim().toLowerCase()))
    : filterRows(activeRows)
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  const exportUrl = (type) => `/api/admin/export?type=${type}&token=${encodeURIComponent(token)}`

  // ── Login screen ────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <Shell>
        <div style={{ maxWidth: 380, margin: '12vh auto', textAlign: 'center' }}>
          <h1 style={{ fontStyle: 'italic', color: RED, marginBottom: 6 }}>Chowby Didi Haus</h1>
          <p style={{ letterSpacing: 3, textTransform: 'uppercase', fontSize: 11, color: 'rgba(226,75,74,0.6)', marginBottom: 32 }}>Admin Dashboard</p>
          <input type="password" placeholder="Admin token" value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load(token)} style={inputStyle} />
          <button onClick={() => load(token)} style={btnStyle} disabled={loading || !token}>
            {loading ? 'Checking…' : 'Enter'}
          </button>
          {error && <p style={{ color: RED, marginTop: 16, fontSize: 14 }}>{error}</p>}
        </div>
      </Shell>
    )
  }

  // ── Dashboard ───────────────────────────────────────────────────────────────
  return (
    <Shell>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontStyle: 'italic', color: RED, margin: 0 }}>Chowby Didi Haus</h1>
          <p style={{ letterSpacing: 3, textTransform: 'uppercase', fontSize: 11, color: 'rgba(226,75,74,0.6)', margin: '4px 0 0' }}>
            Admin Dashboard · storage: {store || '—'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => load(token)} style={ghostBtn}>{loading ? 'Refreshing…' : 'Refresh'}</button>
          <button onClick={logout} style={ghostBtn}>Log out</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, margin: '28px 0 16px', flexWrap: 'wrap' }}>
        <Tab active={tab === 'enquiries'} onClick={() => setTab('enquiries')}>Enquiries ({enquiries.length})</Tab>
        <Tab active={tab === 'receipts'} onClick={() => setTab('receipts')}>Receipts ({receipts.length})</Tab>
        <Tab active={tab === 'subscribers'} onClick={() => setTab('subscribers')}>Subscribers ({subscribers.length})</Tab>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
        <input placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)}
          style={{ ...inputStyle, width: 240, marginBottom: 0 }} />
        {tab !== 'subscribers' && (
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ ...inputStyle, width: 'auto', marginBottom: 0 }}>
            <option value="all">All statuses</option>
            {(tab === 'enquiries' ? ['new', 'contacted', 'booked', 'closed'] : ['pending', 'verified', 'rejected']).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}
        <a href={exportUrl(tab)} style={{ ...ghostBtn, textDecoration: 'none' }}>Export CSV</a>
        <span style={{ color: 'rgba(26,26,26,0.5)', fontSize: 13 }}>{filtered.length} result{filtered.length === 1 ? '' : 's'}</span>
      </div>

      {error && <p style={{ color: RED }}>{error}</p>}

      {/* Tables */}
      {tab === 'enquiries' && (
        <Wrap empty={!pageRows.length}>
          <THead cols={['Date', 'Ref', 'Type', 'Name', 'Email', 'Phone', 'Service', 'Event', 'Guests', 'Budget', 'Payment', 'Status', 'Actions']} />
          <tbody>
            {pageRows.map((e) => {
              const linked = receiptsByRef[e.id] || []
              return (
                <tr key={e.id} style={rowStyle}>
                  <Td>{fmt(e.created_at || e.timestamp)}</Td>
                  <Td>{e.id}</Td>
                  <Td>{e.type || 'enquiry'}</Td>
                  <Td>{e.name}</Td>
                  <Td>{e.email || '—'}</Td>
                  <Td>{e.phone}</Td>
                  <Td>{e.service}</Td>
                  <Td>{e.event_date || e.date || '—'}</Td>
                  <Td>{e.guests || '—'}</Td>
                  <Td>{e.budget || '—'}</Td>
                  <Td>{linked.length
                    ? linked.map((r) => (
                        <a key={r.id} href={`/api/admin/receipts?id=${encodeURIComponent(r.id)}&token=${encodeURIComponent(token)}`}
                          target="_blank" rel="noreferrer" style={{ color: RED, display: 'block' }}>
                          {r.amount || 'receipt'} <Badge status={r.status} />
                        </a>))
                    : <span style={{ color: '#b0a99e' }}>none</span>}
                  </Td>
                  <Td><Badge status={e.status} /></Td>
                  <Td>
                    <Actions current={e.status} options={['contacted', 'booked', 'closed']}
                      onSet={(s) => setStatus('enquiries', e.id, s)} />
                  </Td>
                </tr>
              )
            })}
          </tbody>
        </Wrap>
      )}

      {tab === 'receipts' && (
        <Wrap empty={!pageRows.length}>
          <THead cols={['Date', 'Receipt ID', 'Name', 'Email', 'Booking Ref', 'Amount', 'File', 'Status', 'Actions']} />
          <tbody>
            {pageRows.map((r) => (
              <tr key={r.id} style={rowStyle}>
                <Td>{fmt(r.created_at || r.timestamp)}</Td>
                <Td>{r.id}</Td>
                <Td>{r.name}</Td>
                <Td>{r.email || '—'}</Td>
                <Td>{r.reference || '—'}</Td>
                <Td>{r.amount || '—'}</Td>
                <Td>
                  <a href={`/api/admin/receipts?id=${encodeURIComponent(r.id)}&token=${encodeURIComponent(token)}`}
                    target="_blank" rel="noreferrer" style={{ color: RED }}>
                    {r.file_name || r.fileName || 'view'}
                  </a>
                </Td>
                <Td><Badge status={r.status} /></Td>
                <Td><Actions current={r.status} options={['verified', 'rejected', 'pending']}
                  onSet={(s) => setStatus('receipts', r.id, s)} /></Td>
              </tr>
            ))}
          </tbody>
        </Wrap>
      )}

      {tab === 'subscribers' && (
        <Wrap empty={!pageRows.length}>
          <THead cols={['Date', 'Email', 'Source']} />
          <tbody>
            {pageRows.map((s) => (
              <tr key={s.email} style={rowStyle}>
                <Td>{fmt(s.created_at)}</Td>
                <Td>{s.email}</Td>
                <Td>{s.source || '—'}</Td>
              </tr>
            ))}
          </tbody>
        </Wrap>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 18 }}>
          <button style={ghostBtn} disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>← Prev</button>
          <span style={{ fontSize: 13, color: 'rgba(26,26,26,0.6)' }}>Page {page + 1} of {pageCount}</span>
          <button style={ghostBtn} disabled={page >= pageCount - 1} onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}>Next →</button>
        </div>
      )}
    </Shell>
  )
}

// ── Presentational helpers ──────────────────────────────────────────────────────
function Shell({ children }) {
  return (
    <>
      <Head><title>Admin · Chowby Didi Haus</title><meta name="robots" content="noindex" /></Head>
      <div style={{ minHeight: '100vh', background: CREAM, color: INK, fontFamily: 'Georgia, serif', padding: '40px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>{children}</div>
      </div>
    </>
  )
}

function Tab({ active, onClick, children }) {
  return <button onClick={onClick} style={{ ...ghostBtn, background: active ? RED : 'transparent', color: active ? '#fff' : INK, borderColor: RED }}>{children}</button>
}

function Wrap({ children, empty }) {
  if (empty) return <p style={{ color: 'rgba(26,26,26,0.5)' }}>Nothing to show.</p>
  return (
    <div style={{ overflowX: 'auto', border: '1px solid #e8e4df', borderRadius: 8, background: '#fff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>{children}</table>
    </div>
  )
}

function THead({ cols }) {
  return (
    <thead><tr>{cols.map((h) => (
      <th key={h} style={{ textAlign: 'left', padding: '12px 14px', borderBottom: '2px solid #e8e4df', whiteSpace: 'nowrap', color: RED, textTransform: 'uppercase', letterSpacing: 1, fontSize: 11 }}>{h}</th>
    ))}</tr></thead>
  )
}

function Td({ children }) {
  return <td style={{ padding: '11px 14px', verticalAlign: 'top', maxWidth: 240 }}>{children}</td>
}

function Badge({ status }) {
  return <span style={{ display: 'inline-block', padding: '2px 9px', borderRadius: 20, fontSize: 11, color: '#fff', background: STATUS_COLORS[status] || '#8a8a8a', textTransform: 'uppercase', letterSpacing: 0.5 }}>{status}</span>
}

function Actions({ current, options, onSet }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {options.filter((o) => o !== current).map((o) => (
        <button key={o} onClick={() => onSet(o)} style={{ ...miniBtn, borderColor: STATUS_COLORS[o] || '#ccc', color: STATUS_COLORS[o] || INK }}>{o}</button>
      ))}
    </div>
  )
}

const rowStyle = { borderBottom: '1px solid #f0ece6' }
const inputStyle = { width: '100%', padding: '12px 14px', fontSize: 14, fontFamily: 'Georgia, serif', border: '1px solid #d8d2c8', borderRadius: 8, marginBottom: 14, background: '#fff', color: INK, boxSizing: 'border-box' }
const btnStyle = { width: '100%', padding: '14px 16px', fontSize: 14, letterSpacing: 1, textTransform: 'uppercase', background: RED, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }
const ghostBtn = { padding: '10px 16px', fontSize: 13, letterSpacing: 0.5, fontFamily: 'Georgia, serif', background: 'transparent', color: INK, border: '1px solid #d8d2c8', borderRadius: 8, cursor: 'pointer' }
const miniBtn = { padding: '4px 9px', fontSize: 11, fontFamily: 'Georgia, serif', background: 'transparent', border: '1px solid #ccc', borderRadius: 6, cursor: 'pointer', textTransform: 'capitalize' }
