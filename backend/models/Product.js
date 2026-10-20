const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true
    },
    botanicalName: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      enum: ['hair care', 'skin care', 'health and wellness', 'oils', 'flowers', 'herbs', 'other'],
      required: true,
      default: 'herbs'
    },
    quantity: {
      type: Number,
      required: [true, 'Please specify quantity'],
      min: [1, 'Quantity must be at least 1']
    },
    unit: {
      type: String,
      enum: ['kg', 'litre', 'quintal', 'grams'],
      default: 'kg'
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Please specify price per unit'],
      min: [1, 'Price must be positive']
    },
    harvestDate: {
      type: Date,
      default: Date.now
    },
    availabilityPeriod: {
      type: String,
      default: 'Immediate'
    },
    isOrganic: {
      type: Boolean,
      default: true
    },
    organicDetails: {
      type: String,
      default: 'Traditional cow-dung compost and Jeevamrutha treated (Pesticide Free)'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    images: [{
      type: String
    }],
    qualityGrade: {
      type: String,
      enum: ['Grade A (Export / Prime)', 'Grade B (Standard Commercial)', 'Grade C (Industrial)'],
      default: 'Grade A (Export / Prime)'
    },
    status: {
      type: String,
      enum: ['available', 'sold_out', 'reserved', 'inactive'],
      default: 'available'
    },
    batchNumber: {
      type: String,
      unique: true,
      default: () => 'BATCH-' + Math.floor(100000 + Math.random() * 900000)
    },
    views: {
      type: Number,
      default: 0
    },
    inquiriesCount: {
      type: Number,
      default: 0
    },
    qrCodeDataUrl: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Index for search & filter
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Product', productSchema);
