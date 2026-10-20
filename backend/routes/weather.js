const express = require('express');
const router = express.Router();
const {
  getCurrentWeather,
  getSeasonalCalendar
} = require('../controllers/weatherController');

router.get('/current', getCurrentWeather);
router.get('/calendar', getSeasonalCalendar);

module.exports = router;
