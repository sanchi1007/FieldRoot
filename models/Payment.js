const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    paymentType: {
      type: String,
      enum: ['advance_20', 'final_settlement', 'platform_commission', 'full_settlement'],
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['Direct Bank Transfer (NEFT/RTGS)', 'UPI', 'Escrow Escrow System', 'Cash on Pickup'],
      default: 'Direct Bank Transfer (NEFT/RTGS)'
    },
    transactionRef: {
      type: String,
      default: () => 'TXN-' + Math.floor(100000000 + Math.random() * 900000000)
    },
    paidAt: {
      type: Date
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Payment', paymentSchema);
