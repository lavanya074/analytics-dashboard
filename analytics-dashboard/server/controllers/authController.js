const db     = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const crypto = require('crypto');
const { sendResetEmail } = require('../utils/email');

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

    const [orgResult] = await db.query(
      'INSERT INTO organizations (name) VALUES (?)', [orgName]
    );
    const orgId = orgResult.insertId;

    const hash = await bcrypt.hash(password, 10);

    const [userResult] = await db.query(
      `INSERT INTO users (org_id, name, email, password_hash, role)
       VALUES (?, ?, ?, ?, 'admin')`,
      [orgId, name || 'Admin', email, hash]
    );

    await seedDemoEvents(orgId);

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

// FORGOT PASSWORD — generates a token, saves it, emails a reset link
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);

    // Always respond the same way whether the email exists or not.
    // This prevents attackers from discovering which emails are registered.
    if (rows.length === 0) {
      return res.json({ message: 'If that email exists, a reset link has been sent' });
    }

    const token   = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.query(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
      [token, expires, email]
    );

    console.log('Attempting to send reset email to:', email);

try {
  await sendResetEmail(email, token);
  console.log('Email sent successfully!');
} catch (emailErr) {
  console.error('EMAIL SENDING FAILED:', emailErr);
}

res.json({ message: 'If that email exists, a reset link has been sent' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// RESET PASSWORD — verifies the token and sets a new password
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const [rows] = await db.query(
      `SELECT id FROM users
       WHERE reset_token = ? AND reset_token_expires > NOW()`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset link' });
    }

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      `UPDATE users
       SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL
       WHERE id = ?`,
      [hash, rows[0].id]
    );

    res.json({ message: 'Password updated successfully. You can now log in.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };