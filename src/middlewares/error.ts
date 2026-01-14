import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';
import logger from '../utils/logger.js';
import { config } from '../config/index.js';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let { statusCode, message } = err;

    if (err instanceof ZodError) {
        statusCode = 400;
        message = 'Validation Error';
        return res.status(statusCode).json({
            success: false,
            message,
            errors: err.errors.map((e) => ({
                path: e.path.join('.'),
                message: e.message,
            })),
        });
    }

    if (!(err instanceof ApiError)) {
        statusCode = 500;
        message = config.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;
    }

    res.locals.errorMessage = err.message;

    const response = {
        success: false,
        message,
        ...(config.NODE_ENV === 'development' && { stack: err.stack }),
    };

    if (config.NODE_ENV === 'development') {
        logger.error(err);
    }

    res.status(statusCode).send(response);
};
