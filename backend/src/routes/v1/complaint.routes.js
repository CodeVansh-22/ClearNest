import { Router } from 'express';
import ComplaintController from '../../controllers/complaint.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', ComplaintController.getComplaints);
router.post('/', ComplaintController.createComplaint);
router.patch('/:id', authorize('SOCIETY_ADMIN', 'COMMITTEE'), ComplaintController.updateComplaint);

export default router;
