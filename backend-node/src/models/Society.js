import mongoose from 'mongoose';
import { SOCIETY_STATUS } from '../utils/constants.js';

const societySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Society name is required'],
      trim: true,
      maxlength: 200,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    // Location
    address: {
      line1: { type: String, required: true },
      line2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },

    // Structure
    totalFlats: { type: Number, required: true },
    totalBlocks: { type: Number, default: 1 },
    totalFloors: { type: Number, default: 1 },
    amenities: [String], // "Swimming Pool", "Gym", etc.

    // Admin
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    committeeMembers: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      designation: String, // "Secretary", "Treasurer"
      joinedAt: { type: Date, default: Date.now },
    }],

    // SaaS
    status: {
      type: String,
      enum: Object.values(SOCIETY_STATUS),
      default: SOCIETY_STATUS.TRIAL,
    },
    subscriptionPlan: {
      type: String,
      enum: ['Free', 'Starter', 'Pro', 'Enterprise'],
      default: 'Free',
    },
    subscriptionExpiry: Date,

    // Financials
    wallet: {
      balance: { type: Number, default: 0 },
      totalIncome: { type: Number, default: 0 },
      totalExpense: { type: Number, default: 0 },
    },

    // Config
    maintenanceConfig: {
      defaultAmount: { type: Number, default: 0 },
      dueDateDay: { type: Number, default: 5 },   // Day of month
      lateFeePercent: { type: Number, default: 2 },
      gracePeriodDays: { type: Number, default: 7 },
    },

    // Branding
    logo: {
      url: String,
      publicId: String,
    },
    coverImage: {
      url: String,
      publicId: String,
    },

    // Contact
    contactEmail: String,
    contactPhone: String,
    website: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: get all flats
societySchema.virtual('flats', {
  ref: 'Flat',
  localField: '_id',
  foreignField: 'societyId',
});

// Virtual: resident count
societySchema.virtual('residentCount', {
  ref: 'User',
  localField: '_id',
  foreignField: 'societyId',
  count: true,
});

const Society = mongoose.model('Society', societySchema);
export default Society;
