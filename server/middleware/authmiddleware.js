const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  // Get token from request header
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No token, access denied' })
  }

  try {
    // Verify token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ error: 'Token is invalid' })
  }
}

module.exports = authMiddleware