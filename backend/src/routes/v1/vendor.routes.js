import { Router } from 'express';
import VendorController from '../../controllers/vendor.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/bids', VendorController.submitBid);
router.get('/bids', VendorController.getBids);

export default router;
