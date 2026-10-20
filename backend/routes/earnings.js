const express = require('express');
const router = express.Router();
const {
  getFarmerEarnings,
  getCompanyAnalytics
} = require('../controllers/earningsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/farmer', protect, authorize('farmer', 'admin'), getFarmerEarnings);
router.get('/company-analytics', protect, authorize('company', 'admin'), getCompanyAnalytics);

module.exports = router;
