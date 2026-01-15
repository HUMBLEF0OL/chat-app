import rateLimit from 'express-rate-limit';

// Rate limiter for chat endpoints - 20 requests per minute
export const chatRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // 20 requests per window
    message: {
        error: 'Too Many Requests',
        message: 'You have exceeded the rate limit. Please try again later.',
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Use user ID from JWT for rate limiting
    keyGenerator: (req) => {
        const user = (req as any).user;
        return user?.userId || req.ip || 'anonymous';
    },
});

// General API rate limiter - 100 requests per minute
export const generalRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: {
        error: 'Too Many Requests',
        message: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
