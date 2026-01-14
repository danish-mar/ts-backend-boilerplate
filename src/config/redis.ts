import { Redis } from 'ioredis';
import { config } from './index.js';
import logger from '../utils/logger.js';

const redis = new Redis({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD,
    retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});

redis.on('connect', () => logger.info('✅ Redis connected'));
redis.on('error', (err: Error) => logger.error('❌ Redis error:', err));

export default redis;
