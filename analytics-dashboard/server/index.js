const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

// Allow the React frontend to call this API
app.use(cors({ origin: 'http://localhost:3000' }));

// Parse incoming JSON request bodies
app.use(express.json());

// Serve tracker.js as a public static file — GET /tracker.js
app.use(express.static('public'));

// Mount routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api',      require('./routes/analytics'));

// Health check — useful for confirming the server is running
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Global error handler — catches anything that falls through
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
