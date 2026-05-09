import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    // What this payment is for
    purpose: {
      type: String,
      enum: ['Maintenance', 'Facility Booking', 'Subscription', 'Fine', 'Other'],
      required: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'referenceModel',
    },
    referenceModel: {
      type: String,
      enum: ['MaintenanceBill', 'FacilityBooking', 'Subscription'],
    },

    // Amount
    amount: { type: Number, required: true },
    platformCommission: { type: Number, default: 0 },
    societyCredit: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },

    // Razorpay
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    // Status
    status: {
      type: String,
      enum: ['Created', 'Authorized', 'Captured', 'Failed', 'Refunded'],
      default: 'Created',
    },

    // Receipt
    receiptUrl: String,
    invoiceNumber: String,

    // Metadata
    method: String,         // "card", "upi", "netbanking"
    gateway: { type: String, default: 'razorpay' },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ razorpayOrderId: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
