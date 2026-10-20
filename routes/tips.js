const express = require('express');
const router = express.Router();
const { getTips, getTipById, createTip } = require('../controllers/tipController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getTips);
router.get('/:id', getTipById);
router.post('/', protect, authorize('admin'), createTip);

module.exports = router;
