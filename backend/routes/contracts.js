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
const { validateObjectId } = require('../middleware/security');

router.get('/', getContracts);
router.get('/my', protect, getMyContracts);
router.get('/:id', validateObjectId('id'), getContractById);

router.post('/', protect, authorize('company', 'admin'), createContract);
router.post('/:id/accept', protect, authorize('farmer'), validateObjectId('id'), acceptContract);
router.patch('/:id/timeline', protect, authorize('company', 'admin'), validateObjectId('id'), updateTimeline);

module.exports = router;
