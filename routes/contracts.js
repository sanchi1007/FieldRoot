const express = require('express');
const router = express.Router();
const {
  getContracts,
  getMyContracts,
  getContractById,
  createContract,
  acceptContract,
  updateTimeline
} = require('../controllers/contractController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getContracts);
router.get('/my', protect, getMyContracts);
router.get('/:id', getContractById);

router.post('/', protect, authorize('company', 'admin'), createContract);
router.post('/:id/accept', protect, authorize('farmer'), acceptContract);
router.patch('/:id/timeline', protect, authorize('company', 'admin'), updateTimeline);

module.exports = router;
