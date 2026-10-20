const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Contract = require('../models/Contract');
const { HERBAL_INGREDIENTS } = require('../config/constants');
const { getSecurityAuditLogs } = require('../middleware/security');

/**
 * @desc    Get admin platform overview stats
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
exports.getAdminStats = async (req, res) => {
  try {
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const verifiedFarmers = await User.countDocuments({ role: 'farmer', isVerified: true });
    const totalCompanies = await User.countDocuments({ role: 'company' });
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: 'available' });
    const totalContracts = await Contract.countDocuments();

    const orders = await Order.find();
    const totalOrders = orders.length;
    const completedOrders = orders.filter((o) => o.status === 'Paid').length;

    // Platform GMV & Commission
    const gmv = orders.reduce((sum, o) => sum + (o.subtotal || 0), 0);
    const totalCommissionEarned = orders.reduce((sum, o) => sum + (o.commissionAmount || 0), 0);

    res.status(200).json({
      success: true,
      stats: {
        totalFarmers,
        verifiedFarmers,
        unverifiedFarmers: totalFarmers - verifiedFarmers,
        totalCompanies,
        totalProducts,
        activeProducts,
        totalContracts,
        totalOrders,
        completedOrders,
        grossMerchandiseValue: gmv,
        platformCommissionEarned: totalCommissionEarned,
        currentCommissionRate: process.env.PLATFORM_COMMISSION_PERCENT || 2.5
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get farmers list for admin verification
 * @route   GET /api/admin/farmers
 * @access  Private (Admin)
 */
exports.getAdminFarmers = async (req, res) => {
  try {
    const farmers = await User.find({ role: 'farmer' })
      .select('-password')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: farmers.length,
      farmers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Toggle farmer verification status
 * @route   PATCH /api/admin/farmers/:id/verify
 * @access  Private (Admin)
 */
exports.toggleFarmerVerification = async (req, res) => {
  try {
    const farmer = await User.findById(req.params.id);

    if (!farmer || farmer.role !== 'farmer') {
      return res.status(404).json({ success: false, message: 'Farmer not found' });
    }

    farmer.isVerified = !farmer.isVerified;
    await farmer.save();

    res.status(200).json({
      success: true,
      message: `Farmer ${farmer.name} is now ${farmer.isVerified ? 'VERIFIED' : 'UNVERIFIED'}`,
      isVerified: farmer.isVerified
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Admin delete a spam or non-compliant product
 * @route   DELETE /api/admin/products/:id
 * @access  Private (Admin)
 */
exports.adminDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product removed by admin moderation'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Admin list or manage master herbal ingredients
 * @route   GET /api/admin/ingredients
 * @access  Private (Admin)
 */
exports.getAdminIngredients = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: HERBAL_INGREDIENTS.length,
      ingredients: HERBAL_INGREDIENTS
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update platform commission
 * @route   PATCH /api/admin/commission
 * @access  Private (Admin)
 */
exports.updateCommission = async (req, res) => {
  try {
    const { commissionPercent } = req.body;
    if (commissionPercent === undefined || commissionPercent < 0) {
      return res.status(400).json({ success: false, message: 'Invalid commission percent' });
    }

    process.env.PLATFORM_COMMISSION_PERCENT = String(commissionPercent);

    res.status(200).json({
      success: true,
      message: `Platform commission updated to ${commissionPercent}%`,
      commissionPercent
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get real-time security audit log events
 * @route   GET /api/admin/security-audit
 * @access  Private (Admin)
 */
exports.getSecurityAudit = async (req, res) => {
  try {
    const logs = getSecurityAuditLogs();
    res.status(200).json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
