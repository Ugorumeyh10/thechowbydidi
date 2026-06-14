// Storage layer for Chowby Didi Haus
// ─────────────────────────────────────────────────────────────────────────────
// Strategy: free until deploy.
//   • If DATABASE_URL is set  → store in Postgres (Neon free tier, Supabase,
//     Railway, or any standard `postgres://` connection string — no payment
//     required on their free plans).
//   • If DATABASE_URL is NOT set → fall back to local JSON files (.data/) so the
//     site works immediately on your machine with zero signup.
//
// Set up a free Postgres in ~2 minutes:
//   1. Go to https://neon.tech (or supabase.com) — sign up, no credit card.
//   2. Create a project, copy the connection string.
//   3. Put it in .env.local as DATABASE_URL=postgres://...
// The exact same code then runs in production on Vercel.

import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), '.data')
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json')
const RECEIPTS_FILE = path.join(DATA_DIR, 'receipts.json')
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json')

// Accept whatever name the provider uses, and prefer a STANDARD postgres URL
// that the `pg` driver can actually open. Prisma Postgres may inject a
// `prisma+postgres://` Accelerate URL — `pg` can't use that, so we skip it.
function connectionString() {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.STORAGE_DATABASE_URL,
    process.env.STORAGE_POSTGRES_URL,
  ].filter(Boolean)
  // Prefer a direct postgres:// / postgresql:// URL.
  const direct = candidates.find((u) => /^postgres(ql)?:\/\//.test(u))
  return direct || candidates[0] || ''
}

export function usingPostgres() {
  return !!connectionString()
}

// ── Postgres (lazy-initialised so the file fallback never loads `pg`) ──────────
let _pool
let _schemaReady

async function getPool() {
  if (!_pool) {
    const { Pool } = await import('pg')
    const url = connectionString()
    const isLocal = url.includes('localhost') || url.includes('127.0.0.1')
    _pool = new Pool({
      connectionString: url,
      // Hosted free-tier Postgres (Neon/Supabase) requires SSL.
      ssl: isLocal ? false : { rejectUnauthorized: false },
    })
  }
  if (!_schemaReady) {
    await _pool.query(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id          TEXT PRIMARY KEY,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        type        TEXT NOT NULL DEFAULT 'enquiry',
        name        TEXT NOT NULL,
        email       TEXT,
        phone       TEXT NOT NULL,
        service     TEXT NOT NULL,
        event_date  TEXT,
        guests      TEXT,
        budget      TEXT,
        notes       TEXT,
        status      TEXT NOT NULL DEFAULT 'new'
      )
    `)
    // Safe upgrades for databases created before these columns existed.
    await _pool.query(`ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS email TEXT`)
    await _pool.query(`ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'enquiry'`)
    await _pool.query(`
      CREATE TABLE IF NOT EXISTS receipts (
        id          TEXT PRIMARY KEY,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        name        TEXT NOT NULL,
        email       TEXT,
        reference   TEXT,
        amount      TEXT,
        file_name   TEXT,
        file_type   TEXT,
        file_data   TEXT,
        status      TEXT NOT NULL DEFAULT 'pending'
      )
    `)
    await _pool.query(`
      CREATE TABLE IF NOT EXISTS subscribers (
        email       TEXT PRIMARY KEY,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        source      TEXT
      )
    `)
    _schemaReady = true
  }
  return _pool
}

// ── Local JSON file fallback ──────────────────────────────────────────────────
function readFile(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return []
  }
}

function writeFile(file, rows) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(file, JSON.stringify(rows, null, 2))
}

// ── Enquiries ─────────────────────────────────────────────────────────────────
export async function saveEnquiry(e) {
  if (usingPostgres()) {
    const pool = await getPool()
    await pool.query(
      `INSERT INTO enquiries
         (id, created_at, type, name, email, phone, service, event_date, guests, budget, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [e.id, e.timestamp, e.type || 'enquiry', e.name, e.email, e.phone, e.service, e.date, e.guests, e.budget, e.notes, e.status]
    )
    return
  }
  const rows = readFile(ENQUIRIES_FILE)
  rows.push(e)
  writeFile(ENQUIRIES_FILE, rows)
}

export async function getEnquiries() {
  if (usingPostgres()) {
    const pool = await getPool()
    const { rows } = await pool.query('SELECT * FROM enquiries ORDER BY created_at DESC')
    return rows
  }
  return readFile(ENQUIRIES_FILE).slice().reverse()
}

const ENQUIRY_STATUSES = ['new', 'contacted', 'booked', 'closed']
export async function updateEnquiryStatus(id, status) {
  if (!ENQUIRY_STATUSES.includes(status)) throw new Error('Invalid enquiry status')
  if (usingPostgres()) {
    const pool = await getPool()
    const { rowCount } = await pool.query('UPDATE enquiries SET status = $1 WHERE id = $2', [status, id])
    return rowCount > 0
  }
  const rows = readFile(ENQUIRIES_FILE)
  const row = rows.find((r) => r.id === id)
  if (!row) return false
  row.status = status
  writeFile(ENQUIRIES_FILE, rows)
  return true
}

// ── Payment receipts (bank transfer proof) ────────────────────────────────────
export async function saveReceipt(r) {
  if (usingPostgres()) {
    const pool = await getPool()
    await pool.query(
      `INSERT INTO receipts
         (id, created_at, name, email, reference, amount, file_name, file_type, file_data, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [r.id, r.timestamp, r.name, r.email, r.reference, r.amount, r.fileName, r.fileType, r.fileData, r.status]
    )
    return
  }
  const rows = readFile(RECEIPTS_FILE)
  rows.push(r)
  writeFile(RECEIPTS_FILE, rows)
}

// includeFile=false omits the (large) base64 blob — used by the admin list view.
export async function getReceipts({ includeFile = false } = {}) {
  if (usingPostgres()) {
    const pool = await getPool()
    const cols = includeFile
      ? '*'
      : 'id, created_at, name, email, reference, amount, file_name, file_type, status'
    const { rows } = await pool.query(`SELECT ${cols} FROM receipts ORDER BY created_at DESC`)
    return rows
  }
  const rows = readFile(RECEIPTS_FILE).slice().reverse()
  if (includeFile) return rows
  return rows.map(({ fileData, ...rest }) => rest)
}

export async function getReceipt(id) {
  if (usingPostgres()) {
    const pool = await getPool()
    const { rows } = await pool.query('SELECT * FROM receipts WHERE id = $1', [id])
    return rows[0] || null
  }
  return readFile(RECEIPTS_FILE).find((r) => r.id === id) || null
}

const RECEIPT_STATUSES = ['pending', 'verified', 'rejected']
export async function updateReceiptStatus(id, status) {
  if (!RECEIPT_STATUSES.includes(status)) throw new Error('Invalid receipt status')
  if (usingPostgres()) {
    const pool = await getPool()
    const { rowCount } = await pool.query('UPDATE receipts SET status = $1 WHERE id = $2', [status, id])
    return rowCount > 0
  }
  const rows = readFile(RECEIPTS_FILE)
  const row = rows.find((r) => r.id === id)
  if (!row) return false
  row.status = status
  writeFile(RECEIPTS_FILE, rows)
  return true
}

// ── Newsletter subscribers ────────────────────────────────────────────────────
export async function saveSubscriber(email, source = 'website') {
  const clean = String(email).trim().toLowerCase()
  if (usingPostgres()) {
    const pool = await getPool()
    await pool.query(
      `INSERT INTO subscribers (email, source) VALUES ($1, $2)
       ON CONFLICT (email) DO NOTHING`,
      [clean, source]
    )
    return
  }
  const rows = readFile(SUBSCRIBERS_FILE)
  if (!rows.some((r) => r.email === clean)) {
    rows.push({ email: clean, source, created_at: new Date().toISOString() })
    writeFile(SUBSCRIBERS_FILE, rows)
  }
}

export async function getSubscribers() {
  if (usingPostgres()) {
    const pool = await getPool()
    const { rows } = await pool.query('SELECT * FROM subscribers ORDER BY created_at DESC')
    return rows
  }
  return readFile(SUBSCRIBERS_FILE).slice().reverse()
}
