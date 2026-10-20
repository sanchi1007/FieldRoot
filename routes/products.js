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

// Public routes
router.get('/ingredients-list', getIngredientsList);
router.get('/', getProducts);

// Protected Farmer routes
router.get('/my', protect, authorize('farmer', 'admin'), getMyProducts);
router.post('/', protect, authorize('farmer', 'admin'), upload.array('photos', 4), createProduct);

// Single Product routes
router.get('/:id', getProductById);
router.put('/:id', protect, upload.array('photos', 4), updateProduct);
router.patch('/:id/status', protect, toggleProductStatus);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
