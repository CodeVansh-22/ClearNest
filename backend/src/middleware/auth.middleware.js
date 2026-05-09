import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import config from '../config/env.js';

/**
 * JWT Authentication Middleware
 * Extracts token from Authorization header or cookies,
 * verifies it, and attaches user to request.
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Extract token from header or cookie
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw ApiError.unauthorized('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret);
    
    const user = await User.findById(decoded.userId)
      .select('-password -refreshTokens -__v')
      .lean();

    if (!user) {
      throw ApiError.unauthorized('User associated with this token no longer exists.');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account has been deactivated.');
    }

    // Attach user and decoded claims to request
    req.user = user;
    req.userId = user._id.toString();
    req.userRole = user.role;
    req.societyId = user.societyId?.toString();

    next();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Token expired. Please refresh your session.');
    }
    throw ApiError.unauthorized('Invalid token.');
  }
});

/**
 * Optional auth - doesn't fail if no token, but populates user if present.
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwt.accessSecret);
      req.user = await User.findById(decoded.userId).select('-password -refreshTokens').lean();
      req.userId = req.user?._id?.toString();
      req.userRole = req.user?.role;
      req.societyId = req.user?.societyId?.toString();
    } catch {
      // Silently ignore invalid tokens in optional auth
    }
  }
  
  next();
});
