import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    referenceId: {
      type: String, // e.g. Payment ID, Maintenance Bill ID
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'UPI', 'Net Banking', 'Cheque', 'Card'],
      default: 'Cash',
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Cancelled'],
      default: 'Completed',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
transactionSchema.index({ societyId: 1, date: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
