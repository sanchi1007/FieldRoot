const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please provide contract title'],
      trim: true
    },
    cropName: {
      type: String,
      required: [true, 'Please specify crop name'],
      trim: true
    },
    category: {
      type: String,
      enum: ['hair care', 'skin care', 'health and wellness', 'oils', 'flowers', 'herbs', 'other'],
      default: 'hair care'
    },
    requiredQuantity: {
      type: Number,
      required: [true, 'Please specify required quantity']
    },
    unit: {
      type: String,
      default: 'kg'
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Please specify guaranteed price per unit']
    },
    totalContractValue: {
      type: Number,
      default: 0
    },
    advancePercentage: {
      type: Number,
      default: 20 // 20% default advance
    },
    advanceAmount: {
      type: Number,
      default: 0
    },
    advancePaid: {
      type: Boolean,
      default: false
    },
    targetDeliveryDate: {
      type: Date,
      required: [true, 'Please specify target delivery date']
    },
    specifications: {
      type: String,
      default: 'Grade A organic standard. Zero synthetic pesticides or chemicals. Proper shade drying.'
    },
    status: {
      type: String,
      enum: ['open', 'accepted', 'in_progress', 'completed', 'cancelled'],
      default: 'open'
    },
    acceptedFarmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    acceptedDate: {
      type: Date
    },
    timeline: [
      {
        stage: {
          type: String,
          enum: ['Contract Signed', '20% Advance Disbursed', 'Sowing / Cultivation', 'Harvest & QC', 'Final Delivery & Settlement']
        },
        expectedDate: Date,
        completedDate: Date,
        completed: {
          type: Boolean,
          default: false
        },
        notes: String
      }
    ]
  },
  {
    timestamps: true
  }
);

contractSchema.pre('save', function (next) {
  this.totalContractValue = this.requiredQuantity * this.pricePerUnit;
  this.advanceAmount = (this.totalContractValue * (this.advancePercentage || 20)) / 100;
  next();
});

module.exports = mongoose.model('Contract', contractSchema);
