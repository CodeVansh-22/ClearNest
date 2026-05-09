import { Router } from 'express';
import SocietyController from '../../controllers/society.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';

const router = Router();

// Public
router.post('/register', SocietyController.register);
router.get('/code/:code', SocietyController.getByCode);

// Protected
router.get('/', authenticate, authorize('SUPER_ADMIN'), SocietyController.getAll);
router.get('/:id', authenticate, SocietyController.getById);
router.patch('/:id/status', authenticate, authorize('SUPER_ADMIN'), SocietyController.updateStatus);

export default router;
