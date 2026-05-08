import { Router } from 'express';
import AuthController from '../../controllers/auth.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/google', AuthController.googleLogin);
router.post('/refresh', AuthController.refresh);

// Protected routes
router.get('/profile', authenticate, AuthController.getProfile);
router.post('/logout', authenticate, AuthController.logout);
router.post('/logout-all', authenticate, AuthController.logoutAll);

export default router;
