import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import Society from '../models/Society.js';
import Flat from '../models/Flat.js';
import ApiError from '../utils/ApiError.js';
import config from '../config/env.js';
import { sanitizeUser } from '../utils/helpers.js';

const googleClient = new OAuth2Client(config.google.clientId);

/**
 * Generate JWT access + refresh token pair.
 */
const generateTokenPair = (userId, role, societyId) => {
  const payload = { userId, role, societyId };

  const accessToken = jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiry,
  });

  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiry,
  });

  return { accessToken, refreshToken };
};

/**
 * Store refresh token in user document for multi-device support.
 */
const storeRefreshToken = async (user, refreshToken, device = 'unknown') => {
  user.cleanRefreshTokens();

  // Max 5 devices
  if (user.refreshTokens.length >= 5) {
    user.refreshTokens.shift();
  }

  user.refreshTokens.push({
    token: refreshToken,
    device,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  user.lastLoginAt = new Date();
  await user.save();
};

class AuthService {
  /**
   * Register a new user with email and password.
   */
  static async register({ fullName, email, password, role, societyCode, flatNumber, block = 'A', phone }) {
    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict('An account with this email already exists.');
    }

    // Validate society for non-super-admin
    let societyId = null;
    if (role !== 'SUPER_ADMIN') {
      if (!societyCode) {
        throw ApiError.badRequest('Society code is required for registration.');
      }

      const society = await Society.findOne({ code: societyCode.toUpperCase() });
      if (!society) {
        throw ApiError.notFound('Invalid society code.');
      }
      if (society.status === 'Suspended') {
        throw ApiError.forbidden('This society has been suspended.');
      }
      societyId = society._id;
    }

    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      role: role || 'RESIDENT',
      societyId,
      authProvider: 'local',
      isVerified: false,
    });

    // Link user to flat if provided
    if (flatNumber && societyId) {
      const flat = await Flat.findOne({ societyId, flatNumber, block });
      if (flat) {
        if (role === 'OWNER') {
          flat.ownerId = user._id;
        }
        // Always add to residents if not already there
        const isResident = flat.residents.some(r => r.userId.toString() === user._id.toString());
        if (!isResident) {
          flat.residents.push({
            userId: user._id,
            relation: role === 'TENANT' ? 'Tenant' : 'Owner',
            moveInDate: new Date(),
          });
        }
        flat.isOccupied = true;
        await flat.save();
      } else {
        throw ApiError.notFound(`Flat ${flatNumber} not found in block ${block}. Please check with your society admin.`);
      }
    }

    const tokens = generateTokenPair(user._id, user.role, user.societyId);
    await storeRefreshToken(user, tokens.refreshToken);

    return {
      user: sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * Login with email and password.
   */
  static async login({ email, password, device }) {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw ApiError.unauthorized('No account found with this email.');
    }

    if (!user.password) {
      throw ApiError.badRequest(
        `This account uses ${user.authProvider} login. Please sign in with ${user.authProvider}.`
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Incorrect password.');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account has been deactivated.');
    }

    const tokens = generateTokenPair(user._id, user.role, user.societyId);
    await storeRefreshToken(user, tokens.refreshToken, device);

    return {
      user: sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * Google OAuth login/registration.
   */
  static async googleLogin({ credential, role, societyCode, device }) {
    // Verify Google token
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: config.google.clientId,
      });
      payload = ticket.getPayload();
    } catch {
      throw ApiError.unauthorized('Invalid Google credential.');
    }

    if (!payload.email_verified) {
      throw ApiError.unauthorized('Google email is not verified.');
    }

    const { sub: googleId, email, name: fullName, picture } = payload;

    // Find existing user
    let user = await User.findOne({ email }).select('+password');

    if (!user) {
      // First-time Google login — register
      let societyId = null;
      if (role !== 'SUPER_ADMIN') {
        if (!societyCode) {
          throw ApiError.badRequest('Society code is required for first-time Google registration.');
        }
        const society = await Society.findOne({ code: societyCode.toUpperCase() });
        if (!society) {
          throw ApiError.notFound('Invalid society code.');
        }
        societyId = society._id;
      }

      user = await User.create({
        fullName,
        email,
        googleId,
        authProvider: 'google',
        role: role || 'RESIDENT',
        societyId,
        avatar: { url: picture },
        isVerified: true,
      });
    } else {
      // Link Google to existing account
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = true;
        if (picture && !user.avatar?.url) {
          user.avatar = { url: picture };
        }
        await user.save();
      }
    }

    const tokens = generateTokenPair(user._id, user.role, user.societyId);
    await storeRefreshToken(user, tokens.refreshToken, device);

    return {
      user: sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * Refresh access token using a valid refresh token.
   */
  static async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw ApiError.unauthorized('Refresh token is required.');
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token.');
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw ApiError.unauthorized('User not found.');
    }

    // Verify the refresh token exists in user's stored tokens
    const storedToken = user.refreshTokens.find((rt) => rt.token === refreshToken);
    if (!storedToken) {
      // Potential token theft — clear all sessions
      user.refreshTokens = [];
      await user.save();
      throw ApiError.unauthorized('Token reuse detected. All sessions revoked.');
    }

    // Remove old token
    user.refreshTokens = user.refreshTokens.filter((rt) => rt.token !== refreshToken);

    // Generate new pair
    const tokens = generateTokenPair(user._id, user.role, user.societyId);
    await storeRefreshToken(user, tokens.refreshToken, storedToken.device);

    return tokens;
  }

  /**
   * Get user profile.
   */
  static async getProfile(userId) {
    const user = await User.findById(userId)
      .select('-password -refreshTokens -__v')
      .populate('societyId', 'name code status');

    if (!user) {
      throw ApiError.notFound('User not found.');
    }

    return sanitizeUser(user);
  }

  /**
   * Logout — remove refresh token.
   */
  static async logout(userId, refreshToken) {
    await User.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: { token: refreshToken } },
    });
  }

  /**
   * Logout all devices.
   */
  static async logoutAll(userId) {
    await User.findByIdAndUpdate(userId, { refreshTokens: [] });
  }
}

export default AuthService;
