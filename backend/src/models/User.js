import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES } from '../utils/constants.js';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 8,
      select: false, // Never returned in queries by default
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.RESIDENT,
      index: true,
    },
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      index: true,
    },
    flatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flat',
    },
    avatar: {
      url: String,
      publicId: String,
    },

    // Auth providers
    authProvider: {
      type: String,
      enum: ['local', 'google', 'phone'],
      default: 'local',
    },
    googleId: String,
    firebaseUid: String,

    // Token management
    refreshTokens: [{
      token: String,
      device: String,
      createdAt: { type: Date, default: Date.now },
      expiresAt: Date,
    }],

    // Status
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,

    // Emergency
    emergencyContacts: [{
      name: String,
      phone: String,
      relation: String,
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for multi-tenant queries
userSchema.index({ societyId: 1, role: 1 });
userSchema.index({ email: 1, societyId: 1 });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method: compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method: clean refresh tokens (remove expired)
userSchema.methods.cleanRefreshTokens = function () {
  this.refreshTokens = this.refreshTokens.filter(
    (rt) => rt.expiresAt > new Date()
  );
};

const User = mongoose.model('User', userSchema);
export default User;
