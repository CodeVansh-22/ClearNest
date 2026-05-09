import { Router } from 'express';
import VoteController from '../../controllers/vote.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', VoteController.getActivePolls);
router.get('/results/:id', VoteController.getResults);
router.post('/cast', VoteController.castVote);

// Only admins can create polls
router.post('/create', authorize('SOCIETY_ADMIN', 'COMMITTEE'), VoteController.createPoll);

export default router;
