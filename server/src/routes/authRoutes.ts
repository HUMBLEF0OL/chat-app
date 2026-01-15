import { Router, Request, Response } from 'express';
import { authController } from '../controllers/authController';
import { signupValidation, loginValidation, validate } from '../middleware/validator';

const router = Router();

/**
 * POST /auth/signup
 * Register a new user
 */
router.post(
    '/signup',
    signupValidation,
    validate,
    (req: Request, res: Response) => authController.signup(req, res)
);

/**
 * POST /auth/login
 * Authenticate user and get JWT token
 */
router.post(
    '/login',
    loginValidation,
    validate,
    (req: Request, res: Response) => authController.login(req, res)
);

export default router;
