import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config/index.js';
import { connectDB } from './config/database.js';
import routes from './routes/v1/index.js';
import { errorHandler } from './middlewares/error.js';
import { rateLimiter } from './middlewares/rateLimiter.js';
import logger from './utils/logger.js';
import { NotFoundError } from './utils/ApiError.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(rateLimiter);

// Express Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node Backend Boilerplate API',
            version: '1.0.0',
            description: 'Production-ready Node.js Express TypeScript API docs',
        },
        servers: [{ url: `/api/${config.API_VERSION}` }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/v1/*.js', './src/controllers/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API Routes
app.use(`/api/${config.API_VERSION}`, routes);

// 404 Handler
app.use((req, res, next) => {
    next(new NotFoundError('API Route not found'));
});

// Global Error Handler
app.use(errorHandler);

// Database Connection & Server Start
const startServer = async () => {
    await connectDB();
    app.listen(config.PORT, () => {
        logger.info(`🚀 Server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
        logger.info(`📖 Documentation available at http://localhost:${config.PORT}/api-docs`);
    });
};

startServer();

// Graceful Shutdown
const gracefulShutdown = async (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    // Here you can close DB connections, clear intervals, etc.
    process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app; // For testing
