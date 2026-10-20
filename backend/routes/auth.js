const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  updateLanguage,
  getFarmers
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');

// Strict rate-limiting on sensitive authentication endpoints
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.put('/update-language', protect, updateLanguage);
router.get('/farmers', getFarmers);

module.exports = router;
