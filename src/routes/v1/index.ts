import { Router } from 'express';
import authRoute from './auth.route.js';
import userRoute from './user.route.js';
import fileRoute from './file.route.js';

const router = Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/files', fileRoute);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;
