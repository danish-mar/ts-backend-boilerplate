import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import redis from '../config/redis.js';
import { JWTPayload, Role } from '../interfaces/auth.interface.js';

export class AuthService {
    static generateTokens(userId: string, role: Role) {
        const accessToken = jwt.sign({ sub: userId, role }, config.JWT_ACCESS_SECRET, {
            expiresIn: `${config.JWT_ACCESS_EXPIRATION_MINUTES}m`,
        });

        const refreshToken = jwt.sign({ sub: userId, role }, config.JWT_REFRESH_SECRET, {
            expiresIn: `${config.JWT_REFRESH_EXPIRATION_DAYS}d`,
        });

        return { accessToken, refreshToken };
    }

    static async storeRefreshToken(userId: string, token: string) {
        const expiresAt = config.JWT_REFRESH_EXPIRATION_DAYS * 24 * 60 * 60;
        await redis.set(`refresh_token:${userId}`, token, 'EX', expiresAt);
    }

    static async verifyRefreshToken(token: string): Promise<JWTPayload> {
        const payload = jwt.verify(token, config.JWT_REFRESH_SECRET) as JWTPayload;
        const storedToken = await redis.get(`refresh_token:${payload.sub}`);

        if (storedToken !== token) {
            throw new Error('Invalid refresh token');
        }

        return payload;
    }

    static async revokeRefreshToken(userId: string) {
        await redis.del(`refresh_token:${userId}`);
    }
}
