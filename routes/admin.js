const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAdminFarmers,
  toggleFarmerVerification,
  adminDeleteProduct,
  getAdminIngredients,
  updateCommission
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require protect and admin role
router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/farmers', getAdminFarmers);
router.patch('/farmers/:id/verify', toggleFarmerVerification);
router.delete('/products/:id', adminDeleteProduct);
router.get('/ingredients', getAdminIngredients);
router.patch('/commission', updateCommission);

module.exports = router;
