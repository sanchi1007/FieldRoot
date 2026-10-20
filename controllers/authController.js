const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logSecurityEvent } = require('../middleware/security');

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
 * @desc    Register a new user (farmer, company, admin with secret)
 * @route   POST /api/auth/register
 * @access  Public (Admin requires administrative secret)
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
      bio,
      adminSecret
    } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, mobile number, and password'
      });
    }

    // Input sanitization and phone validation
    const cleanPhone = phone.trim().replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit Indian mobile number'
      });
    }

    // Password minimum length check
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Role privilege escalation protection
    let assignedRole = role || 'farmer';
    if (assignedRole === 'admin') {
      const expectedSecret = process.env.ADMIN_REGISTRATION_SECRET || 'fieldroot_admin_secret_key_2026';
      const providedSecret = adminSecret || req.headers['x-admin-secret'];

      if (!providedSecret || providedSecret !== expectedSecret) {
        logSecurityEvent('UNAUTHORIZED_ADMIN_REGISTRATION_ATTEMPT', `Blocked admin attempt on phone: ${cleanPhone}`, req);
        return res.status(403).json({
          success: false,
          message: 'Access denied: Admin registration requires a valid administrative verification secret.'
        });
      }
    } else if (!['farmer', 'company'].includes(assignedRole)) {
      assignedRole = 'farmer';
    }

    // Check existing phone
    const existingUser = await User.findOne({ phone: cleanPhone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this phone number already exists'
      });
    }

    const userData = {
      name: name.trim(),
      phone: cleanPhone,
      email: email ? email.trim() : undefined,
      password,
      role: assignedRole,
      village: village ? village.trim() : '',
      district: district ? district.trim() : '',
      state: state ? state.trim() : '',
      farmSize: farmSize ? Math.max(0, Number(farmSize)) : 0,
      soilType: soilType || 'Loamy',
      preferredLanguage: preferredLanguage || 'en',
      cropsGrown: Array.isArray(cropsGrown) ? cropsGrown : cropsGrown ? [cropsGrown] : [],
      bio: bio ? bio.trim() : ''
    };

    if (assignedRole === 'company' && companyDetails) {
      userData.companyDetails = companyDetails;
    }

    const user = await User.create(userData);
    logSecurityEvent('USER_REGISTERED', `Role: ${user.role}, Phone: ${user.phone}`, req);
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
 * @desc    Login user with phone & password (constant-time comparison)
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

    const cleanPhone = phone.trim().replace(/\D/g, '').slice(-10);
    const user = await User.findOne({ phone: cleanPhone }).select('+password');

    if (!user) {
      logSecurityEvent('FAILED_LOGIN_UNKNOWN_PHONE', `Attempted Phone: ${cleanPhone}`, req);
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logSecurityEvent('FAILED_LOGIN_PASSWORD_MISMATCH', `Account Phone: ${cleanPhone}`, req);
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }

    logSecurityEvent('SUCCESSFUL_LOGIN', `Account: ${cleanPhone} (${user.role})`, req);
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
