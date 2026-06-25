const jwt = require('jsonwebtoken')

/**
 * Authentication middleware — verifies JWT access token
 * Token is read from Authorization header (Bearer) or httpOnly cookie
 */
function authMiddleware(req, res, next) {
  try {
    // Check Authorization header first, then cookie
    let token = null
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken
    }

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    req.adminId = decoded.adminId
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' })
    }
    return res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = authMiddleware
