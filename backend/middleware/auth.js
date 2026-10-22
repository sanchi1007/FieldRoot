const jwt = require('jsonwebtoken');
const User = require('../models/User');

const DEMO_USERS = [
  {
    _id: '507f191e810c19729de860ea',
    id: '507f191e810c19729de860ea',
    name: 'Rameshwar Patil',
    phone: '9421055501',
    role: 'farmer'
  },
  {
    _id: '507f191e810c19729de860eb',
    id: '507f191e810c19729de860eb',
    name: 'Jignesh Patel',
    phone: '9825012345',
    role: 'farmer'
  },
  {
    _id: '507f191e810c19729de860ec',
    id: '507f191e810c19729de860ec',
    name: 'Murugan Sundaram',
    phone: '9443098765',
    role: 'farmer'
  },
  {
    _id: '507f191e810c19729de860ed',
    id: '507f191e810c19729de860ed',
    name: 'FieldRoot Sourcing Team',
    phone: '9822011223',
    role: 'company'
  },
  {
    _id: '507f191e810c19729de860ee',
    id: '507f191e810c19729de860ee',
    name: 'System Admin',
    phone: '9876543210',
    role: 'admin'
  }
];

/**
 * Protect routes - verify JWT token
 */
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please login.'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fieldroot_super_secure_jwt_secret_2026_herbal_organics'
    );

    let user = null;
    try {
      user = await User.findById(decoded.id);
    } catch (e) {
      // MongoDB initializing, cold start, or offline
    }

    if (!user) {
      const match = DEMO_USERS.find(
        (u) => u._id === decoded.id || u.id === decoded.id || u.phone === decoded.phone
      );
      if (match) {
        user = {
          ...match,
          _id: match._id,
          id: match._id,
          toString: () => match._id
        };
      } else if (decoded.id && decoded.role) {
        user = {
          _id: decoded.id,
          id: decoded.id,
          name: decoded.name || 'FieldRoot User',
          phone: decoded.phone || '',
          role: decoded.role,
          toString: () => decoded.id
        };
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please login again.'
    });
  }
};

/**
 * Grant access to specific roles
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'none'}' is not authorized to access this route.`
      });
    }
    next();
  };
};
