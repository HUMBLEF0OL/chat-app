import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { generalRateLimiter } from './middleware/rateLimiter';
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';

const app: Application = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply general rate limiter to all routes
app.use(generalRateLimiter);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    logger.info(`Environment: ${config.nodeEnv}`);
    logger.info(`Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    process.exit(0);
});

export default app;
