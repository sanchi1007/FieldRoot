const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  counterOffer,
  updateOrderStatus,
  dispatchOrder,
  rateOrder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/security');

router.get('/', protect, getOrders);
router.get('/:id', protect, validateObjectId('id'), getOrderById);
router.post('/', protect, authorize('company', 'admin'), createOrder);
router.post('/:id/counter', protect, validateObjectId('id'), counterOffer);
router.patch('/:id/status', protect, validateObjectId('id'), updateOrderStatus);
router.post('/:id/dispatch', protect, authorize('farmer', 'admin'), validateObjectId('id'), dispatchOrder);
router.post('/:id/rate', protect, authorize('company', 'admin'), validateObjectId('id'), rateOrder);

module.exports = router;
