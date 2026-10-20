const mongoose = require('mongoose');

const priceRecordSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      default: 'hair care'
    },
    mandiName: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    minPrice: {
      type: Number,
      required: true
    },
    maxPrice: {
      type: Number,
      required: true
    },
    modalPrice: {
      type: Number,
      required: true // Prevailing benchmark mandi price per unit
    },
    unit: {
      type: String,
      default: 'kg'
    },
    fieldrootDirectPrice: {
      type: Number,
      required: true // Direct company procurement price without middlemen
    },
    middlemanCutPercent: {
      type: Number,
      default: 28 // Middlemen cut / margin saved by direct sourcing
    },
    recordedDate: {
      type: Date,
      default: Date.now
    },
    trend: {
      type: String,
      enum: ['up', 'down', 'stable'],
      default: 'stable'
    }
  },
  {
    timestamps: true
  }
);

priceRecordSchema.index({ cropName: 1, recordedDate: -1 });

module.exports = mongoose.model('PriceRecord', priceRecordSchema);
