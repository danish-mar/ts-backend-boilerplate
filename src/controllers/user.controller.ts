import { Request, Response } from 'express';
import { User } from '../models/user.model.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { NotFoundError } from '../utils/ApiError.js';
import redis from '../config/redis.js';

export const UserController = {
    getProfile: catchAsync(async (req: Request, res: Response) => {
        const userId = req.user!.id;

        // Caching example
        const cachedUser = await redis.get(`user:${userId}`);
        if (cachedUser) {
            return res.json(new ApiResponse(200, JSON.parse(cachedUser), 'Profile fetched from cache'));
        }

        const user = await User.findById(userId);
        if (!user) throw new NotFoundError('User not found');

        await redis.set(`user:${userId}`, JSON.stringify(user), 'EX', 3600); // cache for 1 hour

        res.json(new ApiResponse(200, user, 'Profile fetched successfully'));
    }),

    updateProfile: catchAsync(async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const user = await User.findByIdAndUpdate(userId, req.body, { new: true });

        if (!user) throw new NotFoundError('User not found');

        // Invalidate cache
        await redis.del(`user:${userId}`);

        res.json(new ApiResponse(200, user, 'Profile updated successfully'));
    }),
};
