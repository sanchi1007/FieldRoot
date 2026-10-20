const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT token
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'fieldroot_super_secure_jwt_secret_2026_herbal_organics',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      village: user.village,
      district: user.district,
      state: user.state,
      farmSize: user.farmSize,
      soilType: user.soilType,
      preferredLanguage: user.preferredLanguage,
      cropsGrown: user.cropsGrown,
      isVerified: user.isVerified,
      trustScore: user.trustScore,
      ratingCount: user.ratingCount,
      avatar: user.avatar,
      bio: user.bio,
      companyDetails: user.companyDetails
    }
  });
};

/**
 * @desc    Register a new user (farmer, company, admin)
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      password,
      role,
      village,
      district,
      state,
      farmSize,
      soilType,
      preferredLanguage,
      cropsGrown,
      companyDetails,
      bio
    } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, phone number, and password'
      });
    }

    // Check existing phone
    const existingUser = await User.findOne({ phone: phone.trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this phone number already exists'
      });
    }

    const userData = {
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : undefined,
      password,
      role: role || 'farmer',
      village: village || '',
      district: district || '',
      state: state || '',
      farmSize: farmSize ? Number(farmSize) : 0,
      soilType: soilType || 'Loamy',
      preferredLanguage: preferredLanguage || 'en',
      cropsGrown: Array.isArray(cropsGrown) ? cropsGrown : cropsGrown ? [cropsGrown] : [],
      bio: bio || ''
    };

    if (role === 'company' && companyDetails) {
      userData.companyDetails = companyDetails;
    }

    const user = await User.create(userData);
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration'
    });
  }
};

/**
 * @desc    Login user with phone & password
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phone number and password'
      });
    }

    const user = await User.findOne({ phone: phone.trim() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login'
    });
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/me
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {};
    const allowedFields = [
      'name', 'email', 'village', 'district', 'state', 'farmSize',
      'soilType', 'preferredLanguage', 'cropsGrown', 'bio', 'companyDetails'
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        fieldsToUpdate[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Quick language switch
 * @route   PUT /api/auth/update-language
 * @access  Private
 */
exports.updateLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    const validLangs = ['en', 'hi', 'mr', 'gu', 'ta', 'te', 'kn', 'bn', 'pa'];

    if (!language || !validLangs.includes(language)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid language code. Supported: en, hi, mr, gu, ta, te, kn, bn, pa'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { preferredLanguage: language },
      { new: true }
    );

    res.status(200).json({
      success: true,
      preferredLanguage: user.preferredLanguage,
      message: 'Language updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    List farmers for marketplace or company sourcing
 * @route   GET /api/auth/farmers
 * @access  Public
 */
exports.getFarmers = async (req, res) => {
  try {
    const { state, district, crop } = req.query;
    const query = { role: 'farmer' };

    if (state) query.state = new RegExp(state, 'i');
    if (district) query.district = new RegExp(district, 'i');
    if (crop) query.cropsGrown = new RegExp(crop, 'i');

    const farmers = await User.find(query)
      .select('-password')
      .sort({ trustScore: -1, ratingCount: -1 });

    res.status(200).json({
      success: true,
      count: farmers.length,
      farmers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
