import { Router } from 'express';
import UploadController from '../../controllers/upload.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import upload from '../../middleware/multer.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/image', upload.single('file'), UploadController.uploadImage);
router.post('/document', upload.single('file'), UploadController.uploadDocument);

export default router;
