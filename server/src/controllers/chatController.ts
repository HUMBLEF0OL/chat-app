import { Request, Response } from 'express';
import { chatService } from '../services/chatService';
import { aiService } from '../services/aiService';
import { AuthenticatedRequest, ChatRequest } from '../types';
import { logger } from '../utils/logger';

export class ChatController {
    /**
     * Handle sending a chat message
     */
    async sendMessage(req: Request, res: Response): Promise<void> {
        try {
            const { message } = req.body as ChatRequest;
            const user = (req as AuthenticatedRequest).user!;

            // Store user message
            await chatService.storeMessage(user.userId, 'user', message);

            // Get recent conversation history for context
            const history = await chatService.getRecentHistory(user.userId, 10);

            // Generate AI response with context
            const aiResponse = await aiService.generateResponse(message, history);

            // Store AI response
            await chatService.storeMessage(user.userId, 'assistant', aiResponse);

            res.status(200).json({
                message: aiResponse,
                role: 'assistant',
                timestamp: new Date().toISOString(),
            });
        } catch (error: any) {
            logger.error('Send message controller error', error);

            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to process message',
            });
        }
    }

    /**
     * Handle fetching chat history
     */
    async getHistory(req: Request, res: Response): Promise<void> {
        try {
            const user = (req as AuthenticatedRequest).user!;
            const limit = parseInt(req.query.limit as string) || 50;
            const offset = parseInt(req.query.offset as string) || 0;

            const messages = await chatService.getChatHistory(user.userId, limit, offset);

            res.status(200).json({
                messages: messages.map((msg) => ({
                    role: msg.role,
                    content: msg.content,
                    timestamp: msg.created_at,
                })),
                pagination: {
                    limit,
                    offset,
                    count: messages.length,
                },
            });
        } catch (error: any) {
            logger.error('Get history controller error', error);

            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to retrieve chat history',
            });
        }
    }

    /**
     * Handle deleting chat history
     */
    async deleteHistory(req: Request, res: Response): Promise<void> {
        try {
            const user = (req as AuthenticatedRequest).user!;

            await chatService.deleteUserHistory(user.userId);

            res.status(200).json({
                message: 'Chat history deleted successfully',
            });
        } catch (error: any) {
            logger.error('Delete history controller error', error);

            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to delete chat history',
            });
        }
    }
}

export const chatController = new ChatController();
