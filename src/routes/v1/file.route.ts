import { Router } from 'express';
import { FileController } from '../../controllers/file.controller.js';
import { auth } from '../../middlewares/auth.js';

const router = Router();

router.use(auth());

router.get('/upload-url', FileController.getSignedUrl);
router.get('/download-url', FileController.getDownloadUrl);

export default router;
