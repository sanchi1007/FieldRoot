const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    authorName: {
      type: String,
      required: true
    },
    authorRole: {
      type: String,
      enum: ['farmer', 'company', 'admin'],
      default: 'farmer'
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    isExpertAnswer: {
      type: Boolean,
      default: false
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
);

const questionSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please provide question title'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Please explain your question in detail'],
      trim: true
    },
    category: {
      type: String,
      enum: ['Crops & Sowing', 'Organic Pest Solutions', 'Harvesting & Drying', 'Mandi & Pricing', 'Organic Certification', 'General'],
      default: 'General'
    },
    cropName: {
      type: String,
      default: ''
    },
    answers: [answerSchema],
    views: {
      type: Number,
      default: 0
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Question', questionSchema);
