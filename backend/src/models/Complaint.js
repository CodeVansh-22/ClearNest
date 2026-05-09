import mongoose from 'mongoose';
import { COMPLAINT_STATUS } from '../utils/constants.js';

const complaintSchema = new mongoose.Schema(
  {
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      required: true,
      index: true,
    },
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    flatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flat',
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 2000,
    },
    category: {
      type: String,
      enum: ['Plumbing', 'Electrical', 'Cleanliness', 'Noise', 'Security', 'Parking', 'Common Area', 'Other'],
      default: 'Other',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: Object.values(COMPLAINT_STATUS),
      default: COMPLAINT_STATUS.OPEN,
      index: true,
    },
    attachments: [{
      url: String,
      publicId: String,
      type: { type: String, enum: ['image', 'document'] },
    }],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolution: {
      note: String,
      resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      resolvedAt: Date,
    },
    timeline: [{
      status: String,
      note: String,
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      updatedAt: { type: Date, default: Date.now },
    }],
    rating: {
      score: { type: Number, min: 1, max: 5 },
      comment: String,
    },
  },
  {
    timestamps: true,
  }
);

complaintSchema.index({ societyId: 1, status: 1 });
complaintSchema.index({ raisedBy: 1, createdAt: -1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
