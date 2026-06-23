const mysql = require('mysql2');
require('dotenv').config();

// createPool keeps 10 connections open and reuses them.
// Much faster than opening a fresh connection for every request.
const pool = mysql.createPool({
  host:               process.env.DB_HOST,
  port:               process.env.DB_PORT || 3306,
  user:               process.env.DB_USER,
  password:           process.env.DB_PASSWORD,
  database:           process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  // Aiven (and most managed MySQL hosts) require SSL. Set DB_SSL=true
  // in production env vars; leave it unset for local dev (XAMPP/local
  // MySQL doesn't need this and will fail to connect if forced on).
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined
});

// .promise() lets us use async/await instead of callbacks
module.exports = pool.promise();