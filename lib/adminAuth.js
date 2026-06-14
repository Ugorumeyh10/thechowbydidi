// Shared bearer-token guard for /api/admin/* routes.
// Returns true if the request is authorised; otherwise writes the error response
// and returns false (caller should stop).

export function requireAdmin(req, res) {
  const token = process.env.ADMIN_TOKEN
  if (!token) {
    res.status(500).json({ error: 'ADMIN_TOKEN is not configured' })
    return false
  }
  const auth = req.headers.authorization || ''
  const provided = auth.startsWith('Bearer ') ? auth.slice(7) : req.query.token
  if (provided !== token) {
    res.status(401).json({ error: 'Unauthorized' })
    return false
  }
  return true
}
