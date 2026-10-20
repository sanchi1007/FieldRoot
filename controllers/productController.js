const Product = require('../models/Product');
const User = require('../models/User');
const QRCode = require('qrcode');
const { HERBAL_INGREDIENTS, CATEGORIES } = require('../config/constants');

/**
 * @desc    Get master list of 30+ herbal cosmetic ingredients
 * @route   GET /api/products/ingredients-list
 * @access  Public
 */
exports.getIngredientsList = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      categories: CATEGORIES,
      ingredients: HERBAL_INGREDIENTS
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all products for marketplace (with rich filters)
 * @route   GET /api/products
 * @access  Public
 */
exports.getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      state,
      district,
      minPrice,
      maxPrice,
      isOrganic,
      qualityGrade,
      status = 'available',
      sort = '-createdAt'
    } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (isOrganic !== undefined && isOrganic !== '') {
      query.isOrganic = isOrganic === 'true';
    }

    if (qualityGrade) {
      query.qualityGrade = new RegExp(qualityGrade, 'i');
    }

    if (minPrice || maxPrice) {
      query.pricePerUnit = {};
      if (minPrice) query.pricePerUnit.$gte = Number(minPrice);
      if (maxPrice) query.pricePerUnit.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { botanicalName: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    let products = await Product.find(query)
      .populate('farmer', 'name phone village district state farmSize trustScore ratingCount isVerified')
      .sort(sort);

    // Apply location filter on populated farmer fields if provided
    if (state || district) {
      products = products.filter((prod) => {
        if (!prod.farmer) return false;
        const matchesState = state
          ? prod.farmer.state && prod.farmer.state.toLowerCase().includes(state.toLowerCase())
          : true;
        const matchesDistrict = district
          ? prod.farmer.district && prod.farmer.district.toLowerCase().includes(district.toLowerCase())
          : true;
        return matchesState && matchesDistrict;
      });
    }

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get logged in farmer's products
 * @route   GET /api/products/my
 * @access  Private (Farmer)
 */
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user.id }).sort('-createdAt');

    // Calculate farmer inventory analytics
    const totalListings = products.length;
    const activeListings = products.filter((p) => p.status === 'available').length;
    const totalViews = products.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalInquiries = products.reduce((acc, curr) => acc + (curr.inquiriesCount || 0), 0);

    res.status(200).json({
      success: true,
      analytics: {
        totalListings,
        activeListings,
        totalViews,
        totalInquiries
      },
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single product details & increment views
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'farmer',
      'name phone email village district state farmSize trustScore ratingCount isVerified bio'
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Increment view count
    product.views = (product.views || 0) + 1;
    await product.save();

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create a new product listing (Farmer)
 * @route   POST /api/products
 * @access  Private (Farmer)
 */
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      botanicalName,
      category,
      quantity,
      unit,
      pricePerUnit,
      harvestDate,
      availabilityPeriod,
      isOrganic,
      organicDetails,
      description,
      qualityGrade
    } = req.body;

    if (!name || !quantity || !pricePerUnit) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product name, quantity, and price per unit'
      });
    }

    // Process uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`);
    } else {
      // Find matching default ingredient image if available
      const matched = HERBAL_INGREDIENTS.find(
        (i) => i.name.toLowerCase() === name.toLowerCase()
      );
      if (matched && matched.defaultImage) {
        images = [matched.defaultImage];
      } else {
        images = ['/images/placeholder_herb.jpg'];
      }
    }

    const batchNumber = 'BATCH-' + Math.floor(100000 + Math.random() * 900000);
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const traceUrl = `${baseUrl}/traceability.html?batch=${batchNumber}`;
    const qrCodeDataUrl = await QRCode.toDataURL(traceUrl);

    const product = await Product.create({
      farmer: req.user.id,
      name: name.trim(),
      botanicalName: botanicalName ? botanicalName.trim() : '',
      category: category || 'herbs',
      quantity: Number(quantity),
      unit: unit || 'kg',
      pricePerUnit: Number(pricePerUnit),
      harvestDate: harvestDate ? new Date(harvestDate) : new Date(),
      availabilityPeriod: availabilityPeriod || 'Immediate',
      isOrganic: isOrganic === 'true' || isOrganic === true,
      organicDetails: organicDetails || 'Naturally grown without synthetic chemicals',
      description: description ? description.trim() : '',
      qualityGrade: qualityGrade || 'Grade A (Export / Prime)',
      images,
      batchNumber,
      qrCodeDataUrl,
      status: 'available'
    });

    res.status(201).json({
      success: true,
      message: 'Product listed successfully!',
      product
    });
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update a product listing
 * @route   PUT /api/products/:id
 * @access  Private (Farmer owner or Admin)
 */
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Make sure user is product owner or admin
    if (product.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    const updateData = { ...req.body };

    // If new photos were uploaded, append them
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((f) => `/uploads/${f.filename}`);
      updateData.images = [...(product.images || []), ...newImages];
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Toggle product status (available, sold_out)
 * @route   PATCH /api/products/:id/status
 * @access  Private (Farmer owner or Admin)
 */
exports.toggleProductStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    product.status = status || (product.status === 'available' ? 'sold_out' : 'available');
    await product.save();

    res.status(200).json({
      success: true,
      status: product.status,
      message: `Product marked as ${product.status}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private (Farmer owner or Admin)
 */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product listing deleted'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
