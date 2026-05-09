import AuthService from '../services/auth.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  static register = asyncHandler(async (req, res) => {
    const { fullName, email, password, role, societyCode, flatNumber, phone } = req.body;
    
    const result = await AuthService.register({
      fullName, email, password, role, societyCode, flatNumber, phone,
    });

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    ApiResponse.created('Account created successfully', {
      user: result.user,
      token: result.accessToken,
    }).send(res);
  });

  /**
   * POST /api/v1/auth/login
   */
  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const device = req.headers['user-agent'] || 'unknown';

    const result = await AuthService.login({ email, password, device });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    ApiResponse.ok('Login successful', {
      user: result.user,
      token: result.accessToken,
    }).send(res);
  });

  /**
   * POST /api/v1/auth/google
   */
  static googleLogin = asyncHandler(async (req, res) => {
    const { credential, role, societyCode } = req.body;
    const device = req.headers['user-agent'] || 'unknown';

    const result = await AuthService.googleLogin({ credential, role, societyCode, device });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    ApiResponse.ok('Google login successful', {
      user: result.user,
      token: result.accessToken,
    }).send(res);
  });

  /**
   * POST /api/v1/auth/refresh
   */
  static refresh = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    const tokens = await AuthService.refreshToken(refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    ApiResponse.ok('Token refreshed', { token: tokens.accessToken }).send(res);
  });

  /**
   * GET /api/v1/auth/profile
   */
  static getProfile = asyncHandler(async (req, res) => {
    console.log('Fetching profile for:', req.user.email, 'fullName:', req.user.fullName);
    ApiResponse.ok('Profile fetched successfully', req.user).send(res);
  });

  /**
   * POST /api/v1/auth/logout
   */
  static logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    await AuthService.logout(req.userId, refreshToken);
    res.clearCookie('refreshToken');
    ApiResponse.ok('Logged out successfully').send(res);
  });

  /**
   * POST /api/v1/auth/logout-all
   */
  static logoutAll = asyncHandler(async (req, res) => {
    await AuthService.logoutAll(req.userId);
    res.clearCookie('refreshToken');
    ApiResponse.ok('Logged out from all devices').send(res);
  });
}

export default AuthController;
