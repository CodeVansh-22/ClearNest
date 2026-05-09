import { Router } from 'express';
import LedgerController from '../../controllers/ledger.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';

const router = Router();

// All ledger routes require authentication
router.use(authenticate);

router.get('/', LedgerController.getTransactions);
router.get('/analytics', LedgerController.getAnalytics);

// Only admins can add transactions
router.post('/', authorize('SOCIETY_ADMIN', 'COMMITTEE'), LedgerController.addTransaction);

export default router;
