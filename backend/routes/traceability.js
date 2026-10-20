const express = require('express');
const router = express.Router();
const { getTraceabilityByBatch } = require('../controllers/traceabilityController');

router.get('/:batchNumber', getTraceabilityByBatch);

module.exports = router;
