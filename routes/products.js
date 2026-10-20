const express = require('express');
const router = express.Router();
const {
  getProducts,
  getMyProducts,
  getProductById,
  createProduct,
  updateProduct,
  toggleProductStatus,
  deleteProduct,
  getIngredientsList
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateObjectId } = require('../middleware/security');

// Public routes
router.get('/ingredients-list', getIngredientsList);
router.get('/', getProducts);

// Protected Farmer routes
router.get('/my', protect, authorize('farmer', 'admin'), getMyProducts);
router.post('/', protect, authorize('farmer', 'admin'), upload.array('photos', 4), createProduct);

// Single Product routes (with ObjectId input validation)
router.get('/:id', validateObjectId('id'), getProductById);
router.put('/:id', protect, validateObjectId('id'), upload.array('photos', 4), updateProduct);
router.patch('/:id/status', protect, validateObjectId('id'), toggleProductStatus);
router.delete('/:id', protect, validateObjectId('id'), deleteProduct);

module.exports = router;
