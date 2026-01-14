import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';
import { UnauthorizedError, ForbiddenError } from '../utils/ApiError.js';
import { JWTPayload, Role } from '../interfaces/auth.interface.js';
import { catchAsync } from '../utils/catchAsync.js';

export const auth = (...requiredRoles: Role[]) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedError('Please authenticate');
        }

        const token = authHeader.split(' ')[1];
        try {
            const payload = jwt.verify(token, config.JWT_ACCESS_SECRET) as JWTPayload;

            req.user = {
                id: payload.sub,
                role: payload.role,
            };

            if (requiredRoles.length && !requiredRoles.includes(payload.role)) {
                throw new ForbiddenError('Forbidden');
            }

            next();
        } catch (error) {
            throw new UnauthorizedError('Invalid or expired token');
        }
    });
