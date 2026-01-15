import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    logger.error('Error occurred', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    // Default error
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
    }

    if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'Unauthorized';
    }

    // Don't leak error details in production
    const response: any = {
        error: err.name || 'Error',
        message: message,
    };

    // Include stack trace only in development
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
}

// 404 handler
export function notFoundHandler(req: Request, res: Response): void {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`,
    });
}
