import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation rules for signup
export const signupValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
];

// Validation rules for login
export const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

// Validation rules for chat message
export const chatMessageValidation = [
    body('message')
        .isString()
        .withMessage('Message must be a string')
        .trim()
        .isLength({ min: 1, max: 5000 })
        .withMessage('Message must be between 1 and 5000 characters'),
];

// Middleware to check validation results
export function validate(req: Request, res: Response, next: NextFunction): void {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({
            error: 'Validation Error',
            message: 'Invalid input data',
            details: errors.array().map(err => ({
                field: err.type === 'field' ? err.path : 'unknown',
                message: err.msg,
            })),
        });
        return;
    }

    next();
}
