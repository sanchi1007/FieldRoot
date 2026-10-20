const Order = require('../models/Order');
const Product = require('../models/Product');
const Rating = require('../models/Rating');
const User = require('../models/User');
const Payment = require('../models/Payment');

/**
 * @desc    Get user's orders (Farmer sales, Company purchases, or Admin all)
 * @route   GET /api/orders
 * @access  Private
 */
exports.getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (req.user.role === 'farmer') {
      query.farmer = req.user.id;
    } else if (req.user.role === 'company') {
      query.buyer = req.user.id;
    }

    const orders = await Order.find(query)
      .populate('buyer', 'name phone email companyDetails')
      .populate('farmer', 'name phone village district state trustScore')
      .populate('product', 'name images batchNumber qualityGrade isOrganic')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single order details with full invoice breakdown
 * @route   GET /api/orders/:id
 * @access  Private
 */
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name phone email companyDetails')
      .populate('farmer', 'name phone village district state trustScore bio')
      .populate('product', 'name images batchNumber qualityGrade isOrganic description qrCodeDataUrl')
      .populate('contract', 'title advancePercentage targetDeliveryDate specifications');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Permission check
    const isParty =
      order.buyer._id.toString() === req.user.id ||
      order.farmer._id.toString() === req.user.id ||
      req.user.role === 'admin';

    if (!isParty) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Fetch rating if exists
    const rating = await Rating.findOne({ order: order._id });

    res.status(200).json({
      success: true,
      order,
      rating
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create a buy request / order (Company)
 * @route   POST /api/orders
 * @access  Private (Company)
 */
exports.createOrder = async (req, res) => {
  try {
    const {
      productId,
      quantity,
      offeredPricePerUnit,
      notes,
      deliveryAddress
    } = req.body;

    if (!productId || !quantity || !offeredPricePerUnit) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product ID, quantity, and offered price per unit'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const qty = Number(quantity);
    const price = Number(offeredPricePerUnit);
    const subtotal = qty * price;
    const commPercent = Number(process.env.PLATFORM_COMMISSION_PERCENT || 2.5);
    const commissionAmount = (subtotal * commPercent) / 100;
    const totalBuyerPayable = subtotal + commissionAmount;
    const farmerReceivable = subtotal;

    const order = await Order.create({
      buyer: req.user.id,
      farmer: product.farmer,
      product: product._id,
      orderType: 'marketplace',
      productName: product.name,
      quantity: qty,
      unit: product.unit || 'kg',
      offeredPricePerUnit: price,
      finalPricePerUnit: price,
      subtotal,
      commissionPercent: commPercent,
      commissionAmount,
      totalBuyerPayable,
      farmerReceivable,
      status: 'Requested',
      notes: notes || '',
      deliveryAddress: deliveryAddress || 'FieldRoot Central Warehouse, Pune, Maharashtra',
      negotiationHistory: [
        {
          offeredBy: req.user.id,
          senderRole: 'company',
          pricePerUnit: price,
          message: notes || `Initial buy offer for ${qty} ${product.unit} @ ₹${price}/${product.unit}`
        }
      ]
    });

    // Increment inquiry count on product
    product.inquiriesCount = (product.inquiriesCount || 0) + 1;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Buy request sent to farmer successfully!',
      order
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Submit a counter-offer on order (Farmer or Company)
 * @route   POST /api/orders/:id/counter
 * @access  Private
 */
exports.counterOffer = async (req, res) => {
  try {
    const { counterPricePerUnit, message } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!counterPricePerUnit) {
      return res.status(400).json({ success: false, message: 'Please specify counter price per unit' });
    }

    const newPrice = Number(counterPricePerUnit);
    const newSubtotal = order.quantity * newPrice;
    const commPercent = order.commissionPercent || 2.5;
    const newCommission = (newSubtotal * commPercent) / 100;

    order.counterPricePerUnit = newPrice;
    order.finalPricePerUnit = newPrice;
    order.subtotal = newSubtotal;
    order.commissionAmount = newCommission;
    order.totalBuyerPayable = newSubtotal + newCommission;
    order.farmerReceivable = newSubtotal;

    order.negotiationHistory.push({
      offeredBy: req.user.id,
      senderRole: req.user.role,
      pricePerUnit: newPrice,
      message: message || `Counter offer submitted: ₹${newPrice}/${order.unit}`
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Counter offer submitted successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update order status (Requested, Accepted, Dispatched, Delivered, Paid, Rejected)
 * @route   PATCH /api/orders/:id/status
 * @access  Private
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const prevStatus = order.status;
    order.status = status;

    if (note) {
      order.notes = order.notes ? `${order.notes} | ${note}` : note;
    }

    if (status === 'Delivered' && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    if (status === 'Paid' && !order.paidAt) {
      order.paidAt = new Date();

      // Record final settlement payment
      await Payment.create({
        order: order._id,
        payer: order.buyer,
        recipient: order.farmer,
        paymentType: 'full_settlement',
        amount: order.farmerReceivable,
        status: 'completed',
        paymentMethod: 'Direct Bank Transfer (NEFT/RTGS)',
        paidAt: new Date(),
        notes: `Direct payout for Order ${order.orderNumber}`
      });
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status changed from ${prevStatus} to ${status}`,
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Farmer dispatches the order with courier details
 * @route   POST /api/orders/:id/dispatch
 * @access  Private (Farmer)
 */
exports.dispatchOrder = async (req, res) => {
  try {
    const { courierName, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    order.status = 'Dispatched';
    order.dispatchDetails = {
      courierName: courierName || 'Direct Road Transport / Agri Logistics',
      trackingNumber: trackingNumber || 'TRK-' + Date.now().toString().slice(-6),
      dispatchDate: new Date()
    };

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order marked as Dispatched with tracking details',
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Company rates the farmer after delivery
 * @route   POST /api/orders/:id/rate
 * @access  Private (Company)
 */
exports.rateOrder = async (req, res) => {
  try {
    const {
      rating,
      qualityScore = 5,
      purityScore = 5,
      deliveryScore = 5,
      reviewTitle,
      comment
    } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.buyer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only buyer can rate this order' });
    }

    if (order.isRated) {
      return res.status(400).json({ success: false, message: 'This order has already been rated' });
    }

    // Create rating
    const ratingDoc = await Rating.create({
      order: order._id,
      reviewer: req.user.id,
      farmer: order.farmer,
      rating: Number(rating),
      qualityScore: Number(qualityScore),
      purityScore: Number(purityScore),
      deliveryScore: Number(deliveryScore),
      reviewTitle: reviewTitle || 'Organic Botanical Quality Rating',
      comment: comment || 'Verified quality and delivery fulfillment.'
    });

    order.isRated = true;
    await order.save();

    // Recalculate farmer trust score
    const allRatings = await Rating.find({ farmer: order.farmer });
    const totalScore = allRatings.reduce((sum, r) => sum + r.rating, 0);
    const newTrustScore = Number((totalScore / allRatings.length).toFixed(1));

    await User.findByIdAndUpdate(order.farmer, {
      trustScore: newTrustScore,
      ratingCount: allRatings.length
    });

    res.status(201).json({
      success: true,
      message: 'Rating submitted! Farmer trust score updated.',
      rating: ratingDoc,
      newTrustScore
    });
  } catch (error) {
    console.error('Rate Order Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
