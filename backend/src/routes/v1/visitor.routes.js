import { Router } from 'express';
import VisitorController from '../../controllers/visitor.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';
import { ROLES } from '../../utils/constants.js';

const router = Router();

// Public route for QR scanning
router.get('/verify/:token', VisitorController.verifyToken);

// All other routes require authentication
router.use(authenticate);

// Resident routes
router.post('/invite', authorize(ROLES.RESIDENT, ROLES.COMMITTEE, ROLES.SOCIETY_ADMIN), VisitorController.createInvite);

// Security routes
router.patch('/:id/status', authorize(ROLES.SECURITY, ROLES.SOCIETY_ADMIN), VisitorController.updateStatus);

export default router;
