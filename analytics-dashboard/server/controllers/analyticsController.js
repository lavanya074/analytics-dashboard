const db     = require('../config/db');
const crypto = require('crypto');

// INGEST EVENT — called by tracker.js running on a tracked website.
// org_id always comes from the API key — never trusted from the request body.
const ingestEvent = async (req, res) => {
  const { event_type, properties } = req.body;
  const org_id = req.user.org_id;

  if (!event_type) {
    return res.status(400).json({ message: 'event_type is required' });
  }

  try {
    await db.query(
      `INSERT INTO events (org_id, event_type, properties)
       VALUES (?, ?, ?)`,
      [org_id, event_type, JSON.stringify(properties || {})]
    );
    res.status(201).json({ message: 'Event recorded' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET OVERVIEW — total count + daily trend + breakdown by type.
// Every query is scoped by org_id — this is the multi-tenancy safety net.
const getOverview = async (req, res) => {
  const org_id = req.user.org_id;

  // Default to last 30 days if no range given
  const from = req.query.from ||
    new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  const to = req.query.to ||
    new Date().toISOString().slice(0, 10);

  const start = from;
  const end   = to + ' 23:59:59';

  try {
    const [totalRows] = await db.query(
      `SELECT COUNT(*) AS total FROM events
       WHERE org_id = ? AND created_at BETWEEN ? AND ?`,
      [org_id, start, end]
    );

    const [trendRows] = await db.query(
      `SELECT DATE(created_at) AS date, COUNT(*) AS count
       FROM events
       WHERE org_id = ? AND created_at BETWEEN ? AND ?
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [org_id, start, end]
    );

    const [breakdownRows] = await db.query(
      `SELECT event_type, COUNT(*) AS count
       FROM events
       WHERE org_id = ? AND created_at BETWEEN ? AND ?
       GROUP BY event_type
       ORDER BY count DESC
       LIMIT 10`,
      [org_id, start, end]
    );

    res.json({
      total:     totalRows[0].total,
      trend:     trendRows,
      breakdown: breakdownRows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GENERATE API KEY — returns the raw key once. Only the hash is stored.
const generateApiKey = async (req, res) => {
  const org_id = req.user.org_id;

  try {
    const rawKey = 'tc_live_' + crypto.randomBytes(24).toString('hex');
    const hash   = crypto.createHash('sha256').update(rawKey).digest('hex');

    await db.query(
      'INSERT INTO api_keys (org_id, key_hash, label) VALUES (?, ?, ?)',
      [org_id, hash, 'Production']
    );

    res.json({
      key:     rawKey,
      message: 'Save this key — it will not be shown again'
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { ingestEvent, getOverview, generateApiKey };
