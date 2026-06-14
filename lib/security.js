// Lightweight, dependency-free protections for the public form endpoints.
//
// NOTE: the rate limiter is in-memory and per-instance. On serverless it resets
// when an instance is recycled and isn't shared across instances — good enough to
// blunt casual abuse for a small site. For strong limits use Upstash Ratelimit
// (free tier) or a Postgres-backed counter later.

const HITS = new Map() // key -> [timestamps]

export function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for']
  if (fwd) return String(fwd).split(',')[0].trim()
  return req.socket?.remoteAddress || 'unknown'
}

// Returns true if the caller is over the limit (should be rejected).
export function rateLimited(key, { max = 5, windowMs = 60_000 } = {}) {
  const now = Date.now()
  const arr = (HITS.get(key) || []).filter((t) => now - t < windowMs)
  arr.push(now)
  HITS.set(key, arr)
  // Opportunistic cleanup so the map doesn't grow unbounded.
  if (HITS.size > 5000) {
    for (const [k, v] of HITS) {
      if (!v.length || now - v[v.length - 1] > windowMs) HITS.delete(k)
    }
  }
  return arr.length > max
}

// Honeypot: a hidden field bots tend to fill. Real users leave it empty.
export function isBot(body, field = 'company') {
  return Boolean(body && body[field])
}

// Validate a file's real type by its magic bytes (not just the claimed MIME).
// `base64` is the raw base64 (no data: prefix). Returns the detected type or null.
export function detectFileType(base64) {
  let head
  try {
    head = Buffer.from(String(base64).slice(0, 32), 'base64')
  } catch {
    return null
  }
  const startsWith = (...bytes) => bytes.every((b, i) => head[i] === b)
  if (startsWith(0xff, 0xd8, 0xff)) return 'image/jpeg'
  if (startsWith(0x89, 0x50, 0x4e, 0x47)) return 'image/png'
  if (startsWith(0x25, 0x50, 0x44, 0x46)) return 'application/pdf' // %PDF
  // WEBP: "RIFF"...."WEBP"
  if (startsWith(0x52, 0x49, 0x46, 0x46) && head[8] === 0x57 && head[9] === 0x45 && head[10] === 0x42 && head[11] === 0x50) {
    return 'image/webp'
  }
  return null
}
