const express = require('express');
const router = express.Router();
const {
  recommendCrops,
  getDemandAlerts
} = require('../controllers/advisorController');

router.post('/recommend', recommendCrops);
router.get('/demand-alerts', getDemandAlerts);

module.exports = router;
