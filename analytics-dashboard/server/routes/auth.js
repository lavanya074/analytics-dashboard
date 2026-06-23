const express   = require('express');
const router    = express.Router();
const rateLimit = require('express-rate-limit');
const {
  register,
  login,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

// Max 10 login attempts per 15 minutes per IP — prevents brute force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  message:  { message: 'Too many attempts, try again later' }
});

// Max 5 reset requests per hour per IP — prevents email-bombing someone
const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max:      5,
  message:  { message: 'Too many reset attempts, try again later' }
});

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.post('/forgot-password', resetLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;