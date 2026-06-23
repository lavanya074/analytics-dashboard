const express   = require('express');
const router    = express.Router();
const rateLimit = require('express-rate-limit');
const { register, login } = require('../controllers/authController');

// Max 10 login attempts per 15 minutes per IP — prevents brute force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  message:  { message: 'Too many attempts, try again later' }
});

router.post('/register', register);
router.post('/login', loginLimiter, login);

module.exports = router;
