const express = require('express');
const router = express.Router();
const { getPrices, getPriceMeta } = require('../controllers/priceController');

router.get('/', getPrices);
router.get('/meta', getPriceMeta);

module.exports = router;
