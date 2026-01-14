import { Router } from 'express';
import { UserController } from '../../controllers/user.controller.js';
import { auth } from '../../middlewares/auth.js';

const router = Router();

router.use(auth());

router.get('/profile', UserController.getProfile);
router.patch('/profile', UserController.updateProfile);

export default router;
