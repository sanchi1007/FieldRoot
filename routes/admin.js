const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAdminFarmers,
  toggleFarmerVerification,
  adminDeleteProduct,
  getAdminIngredients,
  updateCommission,
  getSecurityAudit
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/security');

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/farmers', getAdminFarmers);
router.patch('/farmers/:id/verify', validateObjectId('id'), toggleFarmerVerification);
router.delete('/products/:id', validateObjectId('id'), adminDeleteProduct);
router.get('/ingredients', getAdminIngredients);
router.patch('/commission', updateCommission);
router.get('/security-audit', getSecurityAudit);

module.exports = router;
