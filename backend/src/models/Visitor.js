import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { VISITOR_STATUS } from '../utils/constants.js';

const visitorSchema = new mongoose.Schema(
  {
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Host user is required'],
      index: true,
    },
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      required: [true, 'Society is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Visitor name is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    visitDate: {
      type: Date,
      required: [true, 'Visit date is required'],
    },
    purpose: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(VISITOR_STATUS),
      default: VISITOR_STATUS.APPROVED,
      index: true,
    },
    token: {
      type: String,
      unique: true,
      default: () => uuidv4(),
      index: true,
    },
    checkInTime: Date,
    checkOutTime: Date,
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Index for finding visitors by society and date
visitorSchema.index({ societyId: 1, visitDate: 1 });

const Visitor = mongoose.model('Visitor', visitorSchema);
export default Visitor;
