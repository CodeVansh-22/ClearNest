import mongoose from 'mongoose';
import { PAYMENT_STATUS } from '../utils/constants.js';

const maintenanceBillSchema = new mongoose.Schema(
  {
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      required: true,
      index: true,
    },
    flatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flat',
      required: true,
    },
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    billNumber: {
      type: String,
      unique: true,
    },
    month: { type: Number, required: true },     // 1-12
    year: { type: Number, required: true },
    
    // Breakdown
    items: [{
      label: String,                              // "Maintenance", "Water", "Sinking Fund"
      amount: Number,
    }],
    baseAmount: { type: Number, required: true },
    lateFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    // Payment
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
      index: true,
    },
    dueDate: { type: Date, required: true },
    paidAt: Date,
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },

    // Receipt
    receiptUrl: String,
  },
  {
    timestamps: true,
  }
);

maintenanceBillSchema.index({ societyId: 1, month: 1, year: 1 });
maintenanceBillSchema.index({ flatId: 1, year: -1, month: -1 });

// Auto-generate bill number
maintenanceBillSchema.pre('save', function (next) {
  if (!this.billNumber) {
    const pad = (n) => String(n).padStart(2, '0');
    this.billNumber = `BILL-${this.year}${pad(this.month)}-${this._id.toString().slice(-6).toUpperCase()}`;
  }
  next();
});

const MaintenanceBill = mongoose.model('MaintenanceBill', maintenanceBillSchema);
export default MaintenanceBill;
