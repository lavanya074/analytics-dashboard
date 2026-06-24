const express    = require('express');
const cors       = require('cors');
const router     = express.Router();
const { protect, requireRole } = require('../middleware/auth');
const apiKeyAuth = require('../middleware/apiKeyAuth');
const {
  ingestEvent,
  getOverview,
  generateApiKey
} = require('../controllers/analyticsController');

// Restricted CORS — same allowed list as index.js, used for routes
// that only your own dashboard frontend should ever call.
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:5500',
  'http://localhost:5500'
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}
const restrictedCors = cors({ origin: allowedOrigins });

// Open CORS — ANY website, anywhere, can call this endpoint.
const openCors = cors();

// IMPORTANT: router.options() explicitly handles the browser's automatic
// preflight OPTIONS request for each path, using the same CORS rules.
// Without this, the OPTIONS request never matches any route and the
// browser blocks the real POST/GET that follows.
router.options('/events', openCors);
router.options('/analytics/overview', restrictedCors);
router.options('/settings/api-key', restrictedCors);

// POST /api/events — open to any website, protected by API key only
router.post('/events', openCors, apiKeyAuth, ingestEvent);

// GET /api/analytics/overview — dashboard only, protected by JWT + role
router.get(
  '/analytics/overview',
  restrictedCors,
  protect,
  requireRole('admin', 'analyst'),
  getOverview
);

// POST /api/settings/api-key — dashboard only, protected by JWT + role
router.post(
  '/settings/api-key',
  restrictedCors,
  protect,
  requireRole('admin'),
  generateApiKey
);

module.exports = router;