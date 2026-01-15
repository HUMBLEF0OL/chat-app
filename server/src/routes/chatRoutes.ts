import { Router, Request, Response } from 'express';
import { chatController } from '../controllers/chatController';
import { authenticateToken } from '../middleware/auth';
import { chatMessageValidation, validate } from '../middleware/validator';
import { chatRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// All chat routes require authentication
router.use(authenticateToken);

// Conversation routes
router.post('/conversations', (req: Request, res: Response) => chatController.createConversation(req, res));
router.get('/conversations', (req: Request, res: Response) => chatController.getConversations(req, res));
router.delete('/conversations/:id', (req: Request, res: Response) => chatController.deleteConversation(req, res));

/**
 * POST /chat/send
 * Send a message and get AI response
 */
router.post(
    '/send',
    chatRateLimiter,
    chatMessageValidation,
    validate,
    (req: Request, res: Response) => chatController.sendMessage(req, res)
);

/**
 * GET /chat/history
 * Get chat history for authenticated user
 */
router.get(
    '/history',
    (req: Request, res: Response) => chatController.getHistory(req, res)
);

/**
 * DELETE /chat/history
 * Delete all chat history for authenticated user
 */
router.delete(
    '/history',
    (req: Request, res: Response) => chatController.deleteHistory(req, res)
);

export default router;
