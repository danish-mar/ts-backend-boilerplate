import { Request, Response } from 'express';
import { z } from 'zod';
import { User } from '../models/user.model.js';
import { AuthService } from '../services/auth.service.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { UnauthorizedError, BadRequestError } from '../utils/ApiError.js';

export const registerSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(8),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    }),
});

export const AuthController = {
    register: catchAsync(async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new BadRequestError('User already exists');
        }

        const user = await User.create({ email, password });
        const tokens = AuthService.generateTokens(user.id, user.role as any);
        await AuthService.storeRefreshToken(user.id, tokens.refreshToken);

        res.status(201).json(new ApiResponse(201, { user, ...tokens }, 'User registered successfully'));
    }),

    /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, password]
   *             properties:
   *               email: { type: string }
   *               password: { type: string }
   *     responses:
   *       200:
   *         description: OK
   */
    login: catchAsync(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const user: any = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            throw new UnauthorizedError('Invalid email or password');
        }

        const tokens = AuthService.generateTokens(user.id, user.role);
        await AuthService.storeRefreshToken(user.id, tokens.refreshToken);

        res.json(new ApiResponse(200, { user, ...tokens }, 'Login successful'));
    }),

    refresh: catchAsync(async (req: Request, res: Response) => {
        const { refreshToken } = req.body;
        if (!refreshToken) throw new BadRequestError('Refresh token required');

        const payload = await AuthService.verifyRefreshToken(refreshToken);
        const user = await User.findById(payload.sub);

        if (!user) throw new UnauthorizedError('User not found');

        const tokens = AuthService.generateTokens(user.id, user.role as any);
        await AuthService.storeRefreshToken(user.id, tokens.refreshToken);

        res.json(new ApiResponse(200, tokens, 'Token refreshed successfully'));
    }),

    logout: catchAsync(async (req: Request, res: Response) => {
        if (req.user) {
            await AuthService.revokeRefreshToken(req.user.id);
        }
        res.json(new ApiResponse(200, null, 'Logged out successfully'));
    }),
};
