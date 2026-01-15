import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { JWTPayload, AuthenticatedRequest } from '../types';
import { logger } from '../utils/logger';

export function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        res.status(401).json({
            error: 'Unauthorized',
            message: 'Access token is required',
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
        (req as AuthenticatedRequest).user = decoded;
        next();
    } catch (error) {
        logger.error('JWT verification failed', error);

        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Token has expired',
            });
            return;
        }

        res.status(403).json({
            error: 'Forbidden',
            message: 'Invalid token',
        });
    }
}
