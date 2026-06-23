const mysql = require('mysql2');
require('dotenv').config();

// createPool keeps 10 connections open and reuses them.
// Much faster than opening a fresh connection for every request.
const pool = mysql.createPool({
  host:               process.env.DB_HOST,
  user:               process.env.DB_USER,
  password:           process.env.DB_PASSWORD,
  database:           process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0
});

// .promise() lets us use async/await instead of callbacks
module.exports = pool.promise();
