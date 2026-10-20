const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: [
        'composting',
        'pest_control',
        'drying_and_storage',
        'ayurvedic_standards',
        'quality_grades',
        'soil_health'
      ],
      required: true
    },
    summary: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    steps: [
      {
        stepNumber: Number,
        title: String,
        description: String,
        proTip: String
      }
    ],
    imageUrl: {
      type: String,
      default: ''
    },
    author: {
      type: String,
      default: 'FieldRoot Ayurvedic Agri R&D Team'
    },
    tags: [{
      type: String
    }],
    views: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Tip', tipSchema);
