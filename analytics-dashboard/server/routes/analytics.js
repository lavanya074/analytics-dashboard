const express    = require('express');
const router     = express.Router();
const { protect, requireRole } = require('../middleware/auth');
const apiKeyAuth = require('../middleware/apiKeyAuth');
const {
  ingestEvent,
  getOverview,
  generateApiKey
} = require('../controllers/analyticsController');

// POST /api/events — uses API key auth (called by tracker.js)
router.post('/events', apiKeyAuth, ingestEvent);

// GET /api/analytics/overview — uses JWT auth, restricted by role
router.get(
  '/analytics/overview',
  protect,
  requireRole('admin', 'analyst'),
  getOverview
);

// POST /api/settings/api-key — generates a new API key for the org
router.post('/settings/api-key', protect, requireRole('admin'), generateApiKey);

module.exports = router;
