const jwt = require('jsonwebtoken');

// protect — checks if a valid JWT was sent.
// Attaches the decoded payload to req.user so controllers can read it.
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token must arrive as: Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // jwt.verify throws if the token is expired or tampered with
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, org_id, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// requireRole — runs AFTER protect. Restricts access by role.
// usage: router.get('/x', protect, requireRole('admin'), handler)
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = { protect, requireRole };
