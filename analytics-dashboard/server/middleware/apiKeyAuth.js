const db     = require('../config/db');
const crypto = require('crypto');

// Used for requests coming from the tracker.js snippet on a website,
// instead of a logged-in user's JWT.
const apiKeyAuth = async (req, res, next) => {
  const key = req.headers['x-api-key'];

  if (!key) {
    return res.status(401).json({ message: 'API key required' });
  }

  try {
    // Hash the incoming key and compare to the stored hash
    const hash = crypto
      .createHash('sha256')
      .update(key)
      .digest('hex');

    const [rows] = await db.query(
      'SELECT org_id FROM api_keys WHERE key_hash = ?',
      [hash]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid API key' });
    }

    // Attach org_id the same way JWT middleware does,
    // so controllers work identically for both auth types
    req.user = { org_id: rows[0].org_id };
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = apiKeyAuth;
