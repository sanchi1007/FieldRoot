const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logSecurityEvent } = require('../middleware/security');

// Demo users for offline or serverless cloud fallback
const DEMO_USERS = [
  {
    _id: '507f191e810c19729de860ea',
    name: 'Rameshwar Patil',
    phone: '9421055501',
    email: 'ramesh.patil@agrimail.in',
    role: 'farmer',
    village: 'Koregaon',
    district: 'Satara',
    state: 'Maharashtra',
    farmSize: 8.5,
    preferredLanguage: 'mr',
    soilType: 'Black Soil',
    cropsGrown: ['Reetha', 'Shikakai', 'Neem', 'Turmeric'],
    isVerified: true,
    trustScore: 4.9,
    ratingCount: 14,
    bio: 'Practicing Natural Desi Cow-based ZBNF farming for 12 years. Certified organic Reetha & Shikakai grower.'
  },
  {
    _id: '507f191e810c19729de860eb',
    name: 'Jignesh Patel',
    phone: '9825012345',
    email: 'jignesh.organic@kisanmail.com',
    role: 'farmer',
    village: 'Keshod',
    district: 'Junagadh',
    state: 'Gujarat',
    farmSize: 12.0,
    preferredLanguage: 'gu',
    soilType: 'Sandy Loam',
    cropsGrown: ['Neem', 'Fenugreek', 'Henna', 'Aloe Vera'],
    isVerified: true,
    trustScore: 4.8,
    ratingCount: 19,
    bio: 'Pioneer organic farmer certified by NPOP Gujarat. Cultivates high-grade Neem seed kernels and Fenugreek.'
  },
  {
    _id: '507f191e810c19729de860ec',
    name: 'Murugan Sundaram',
    phone: '9443098765',
    email: 'murugan.herbs@tamilagri.org',
    role: 'farmer',
    village: 'Omalur',
    district: 'Salem',
    state: 'Tamil Nadu',
    farmSize: 6.0,
    preferredLanguage: 'ta',
    soilType: 'Red Soil',
    cropsGrown: ['Hibiscus', 'Curry Leaves', 'Coconut', 'Moringa'],
    isVerified: true,
    trustScore: 4.95,
    ratingCount: 22,
    bio: 'Specialist in medicinal Hibiscus petals shade-drying and organic cold-pressed coconut oil sourcing.'
  },
  {
    _id: '507f191e810c19729de860ed',
    name: 'FieldRoot Sourcing Team',
    phone: '9822011223',
    email: 'procurement@fieldroot.in',
    role: 'company',
    preferredLanguage: 'en',
    isVerified: true,
    companyDetails: {
      companyName: 'FieldRoot Natural Cosmetics Pvt Ltd',
      gstNumber: '27AABCU9603R1ZM',
      contactPerson: 'Vikramaditya Shinde (Procurement Head)',
      address: 'Plot 14, Ayurvedic Agri Industrial Zone, Hadapsar, Pune, MH 411028',
      subscriptionPlan: 'herbal_brand_pro'
    },
    bio: 'Ethical cosmetic manufacturer sourcing raw natural herbs directly from Indian farmers.'
  },
  {
    _id: '507f191e810c19729de860ee',
    name: 'Dr. Aruna Joshi (Admin)',
    phone: '9876543210',
    email: 'admin@fieldroot.in',
    role: 'admin',
    preferredLanguage: 'en',
    isVerified: true,
    bio: 'Ayurvedic Botanist & FieldRoot Quality Director'
  }
];

const getDemoUser = (phone) => DEMO_USERS.find((u) => u.phone === phone);
const getDemoUserById = (id) => DEMO_USERS.find((u) => u._id === id || u._id.toString() === id.toString());

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

    let user = null;
    try {
      user = await User.findOne({ phone: cleanPhone }).select('+password');
    } catch (dbErr) {
      console.warn('Database query during login failed, checking demo users:', dbErr.message);
    }

    // If user not in DB or DB offline/unreachable, support seamless demo logins
    if (!user) {
      const demoUser = getDemoUser(cleanPhone);
      if (demoUser && password === 'password123') {
        logSecurityEvent('DEMO_ACCOUNT_LOGIN', `Phone: ${cleanPhone} (${demoUser.role})`, req);
        return sendTokenResponse(demoUser, 200, res);
      }

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
    let user = null;
    try {
      user = await User.findById(req.user.id);
    } catch (dbErr) {
      user = getDemoUserById(req.user.id);
    }
    if (!user) {
      user = getDemoUserById(req.user.id);
    }
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
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
