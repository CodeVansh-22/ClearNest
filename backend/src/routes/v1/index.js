import { Router } from 'express';
import authRoutes from './auth.routes.js';
import societyRoutes from './society.routes.js';
import ledgerRoutes from './ledger.routes.js';
import complaintRoutes from './complaint.routes.js';
import voteRoutes from './vote.routes.js';
import vendorRoutes from './vendor.routes.js';
import uploadRoutes from './upload.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/societies', societyRoutes);
router.use('/ledger', ledgerRoutes);
router.use('/complaints', complaintRoutes);
router.use('/votes', voteRoutes);
router.use('/vendors', vendorRoutes);
router.use('/upload', uploadRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'ClearNest API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

export default router;
