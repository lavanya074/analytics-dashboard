const db     = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

// Seed 50 demo events spread across the last 14 days
// so the dashboard is never empty on first login.
const seedDemoEvents = async (org_id) => {
  const types = ['page_view', 'button_click', 'user_signup', 'page_exit'];
  const pages = ['/', '/pricing', '/features', '/contact', '/about'];

  for (let i = 0; i < 50; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const page = pages[Math.floor(Math.random() * pages.length)];

    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 14));
    date.setHours(Math.floor(Math.random() * 24));

    await db.query(
      `INSERT INTO events (org_id, event_type, properties, created_at)
       VALUES (?, ?, ?, ?)`,
      [org_id, type, JSON.stringify({ page }), date]
    );
  }
};

// REGISTER — creates org + admin user + seeds demo data + returns JWT
const register = async (req, res) => {
  const { orgName, name, email, password } = req.body;

  if (!orgName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?', [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Step 1 — create organization
    const [orgResult] = await db.query(
      'INSERT INTO organizations (name) VALUES (?)', [orgName]
    );
    const orgId = orgResult.insertId;

    // Step 2 — hash password (never store plain text)
    const hash = await bcrypt.hash(password, 10);

    // Step 3 — create admin user
    const [userResult] = await db.query(
      `INSERT INTO users (org_id, name, email, password_hash, role)
       VALUES (?, ?, ?, ?, 'admin')`,
      [orgId, name || 'Admin', email, hash]
    );

    // Step 4 — seed demo events so dashboard isn't empty
    await seedDemoEvents(orgId);

    // Step 5 — issue JWT
    const token = jwt.sign(
      { id: userResult.insertId, org_id: orgId, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      token,
      role:  'admin',
      orgId,
      name:  name || 'Admin'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// LOGIN — verify credentials and return JWT
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ? AND is_active = true',
      [email]
    );

    // Always say "Invalid credentials" — never reveal
    // whether the email exists or the password was wrong
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user    = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, org_id: user.org_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      role:  user.role,
      orgId: user.org_id,
      name:  user.name
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login };
