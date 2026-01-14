import { Router } from 'express';
import { AuthController, registerSchema, loginSchema } from '../../controllers/auth.controller.js';
import { validate } from '../../middlewares/validate.js';
import { auth } from '../../middlewares/auth.js';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', auth(), AuthController.logout);

export default router;
