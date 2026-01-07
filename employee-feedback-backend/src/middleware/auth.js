const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../utils/jwt')

// Helper: auth middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader || null

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

// Helper: admin middleware
function adminMiddleware(req, res, next) {
  if (req.user.role !== 1) {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

module.exports = { authMiddleware, adminMiddleware }

