const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      unique: true // One rating per order
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    qualityScore: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    purityScore: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    deliveryScore: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    reviewTitle: {
      type: String,
      default: ''
    },
    comment: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Rating', ratingSchema);
