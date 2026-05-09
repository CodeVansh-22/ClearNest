import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema(
  {
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      required: true,
      index: true,
    },
    vendorName: {
      type: String,
      required: [true, 'Vendor name is required'],
    },
    serviceType: {
      type: String, // e.g. "Security", "Cleaning"
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    proposal: String,
    attachment: String, // URL to proposal document
    status: {
      type: String,
      enum: ['Pending', 'Shortlisted', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Bid = mongoose.model('Bid', bidSchema);
export default Bid;
