const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      unique: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['farmer', 'company', 'admin'],
      default: 'farmer'
    },
    // Farmer-specific fields
    village: {
      type: String,
      trim: true,
      default: ''
    },
    district: {
      type: String,
      trim: true,
      default: ''
    },
    state: {
      type: String,
      trim: true,
      default: ''
    },
    farmSize: {
      type: Number,
      default: 0 // In acres
    },
    preferredLanguage: {
      type: String,
      enum: ['en', 'hi', 'mr', 'gu', 'ta', 'te', 'kn', 'bn', 'pa'],
      default: 'en'
    },
    soilType: {
      type: String,
      default: 'Loamy'
    },
    cropsGrown: [{
      type: String
    }],
    isVerified: {
      type: Boolean,
      default: false
    },
    trustScore: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5
    },
    ratingCount: {
      type: Number,
      default: 0
    },
    avatar: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    // Company-specific fields
    companyDetails: {
      companyName: { type: String, default: 'FieldRoot Herbal Cosmetics' },
      gstNumber: { type: String, default: '' },
      contactPerson: { type: String, default: '' },
      address: { type: String, default: '' },
      subscriptionPlan: {
        type: String,
        enum: ['standard', 'herbal_brand_pro', 'enterprise'],
        default: 'herbal_brand_pro'
      },
      subscriptionActiveUntil: {
        type: Date,
        default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
