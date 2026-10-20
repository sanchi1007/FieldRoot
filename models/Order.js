const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      default: () => 'ORD-' + Date.now().toString().slice(-6) + '-' + Math.floor(100 + Math.random() * 900)
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract'
    },
    orderType: {
      type: String,
      enum: ['marketplace', 'contract'],
      default: 'marketplace'
    },
    productName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unit: {
      type: String,
      default: 'kg'
    },
    offeredPricePerUnit: {
      type: Number,
      required: true
    },
    counterPricePerUnit: {
      type: Number,
      default: null
    },
    finalPricePerUnit: {
      type: Number,
      required: true
    },
    subtotal: {
      type: Number,
      required: true
    },
    commissionPercent: {
      type: Number,
      default: 2.5
    },
    commissionAmount: {
      type: Number,
      default: 0
    },
    totalBuyerPayable: {
      type: Number,
      required: true
    },
    farmerReceivable: {
      type: Number,
      required: true
    },
    advanceAmount: {
      type: Number,
      default: 0
    },
    advancePaid: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['Requested', 'Accepted', 'Dispatched', 'Delivered', 'Paid', 'Rejected', 'Cancelled'],
      default: 'Requested'
    },
    deliveryAddress: {
      type: String,
      default: 'FieldRoot Sourcing Warehouse, Plot 14 Herbal Park, Pune, Maharashtra 411028'
    },
    dispatchDetails: {
      courierName: { type: String, default: '' },
      trackingNumber: { type: String, default: '' },
      dispatchDate: { type: Date }
    },
    deliveredAt: {
      type: Date
    },
    paidAt: {
      type: Date
    },
    notes: {
      type: String,
      default: ''
    },
    isRated: {
      type: Boolean,
      default: false
    },
    negotiationHistory: [
      {
        offeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        senderRole: { type: String },
        pricePerUnit: { type: Number },
        message: { type: String },
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', orderSchema);
