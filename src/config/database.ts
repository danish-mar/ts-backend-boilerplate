import mongoose from 'mongoose';
import { config } from './index.js';
import logger from '../utils/logger.js';

export const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(config.MONGODB_URL, {
            maxPoolSize: config.MONGODB_POOL_SIZE,
        });
        logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error(`❌ MongoDB Connection Error: ${error}`);
        process.exit(1);
    }

    mongoose.connection.on('error', (err) => {
        logger.error(`MongoDB persistent error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });
};

export const closeDB = async (): Promise<void> => {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed.');
};
