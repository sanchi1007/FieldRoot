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

router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.post('/', protect, authorize('company', 'admin'), createOrder);
router.post('/:id/counter', protect, counterOffer);
router.patch('/:id/status', protect, updateOrderStatus);
router.post('/:id/dispatch', protect, authorize('farmer', 'admin'), dispatchOrder);
router.post('/:id/rate', protect, authorize('company', 'admin'), rateOrder);

module.exports = router;
