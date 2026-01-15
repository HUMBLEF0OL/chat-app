import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { AuthRequest } from '../types';
import { logger } from '../utils/logger';

export class AuthController {
    /**
     * Handle user signup
     */
    async signup(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body as AuthRequest;

            const result = await authService.signup(email, password);

            res.status(201).json({
                message: 'User registered successfully',
                ...result,
            });
        } catch (error: any) {
            logger.error('Signup controller error', error);

            if (error.message.includes('already exists')) {
                res.status(409).json({
                    error: 'Conflict',
                    message: error.message,
                });
                return;
            }

            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to register user',
            });
        }
    }

    /**
     * Handle user login
     */
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body as AuthRequest;

            const result = await authService.login(email, password);

            res.status(200).json({
                message: 'Login successful',
                ...result,
            });
        } catch (error: any) {
            logger.error('Login controller error', error);

            if (error.message.includes('Invalid email or password')) {
                res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Invalid email or password',
                });
                return;
            }

            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to authenticate user',
            });
        }
    }
}

export const authController = new AuthController();
