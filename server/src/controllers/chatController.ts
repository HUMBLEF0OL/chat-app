import { Request, Response } from 'express';
import { chatService } from '../services/chatService';
import { aiService } from '../services/aiService';
import { AuthenticatedRequest, ChatRequest } from '../types';
import { logger } from '../utils/logger';

export class ChatController {
    /**
     * Create a new conversation
     */
    async createConversation(req: Request, res: Response): Promise<void> {
        try {
            const user = (req as AuthenticatedRequest).user!;
            const { title } = req.body;

            const conversation = await chatService.createConversation(user.userId, title);

            res.status(201).json(conversation);
        } catch (error) {
            logger.error('Create conversation controller error', error);
            res.status(500).json({ error: 'Failed to create conversation' });
        }
    }

    /**
     * Get all conversations for user
     */
    async getConversations(req: Request, res: Response): Promise<void> {
        try {
            const user = (req as AuthenticatedRequest).user!;
            const conversations = await chatService.getUserConversations(user.userId);

            res.status(200).json(conversations);
        } catch (error) {
            logger.error('Get conversations controller error', error);
            res.status(500).json({ error: 'Failed to fetch conversations' });
        }
    }

    /**
     * Delete a conversation
     */
    async deleteConversation(req: Request, res: Response): Promise<void> {
        try {
            const user = (req as AuthenticatedRequest).user!;
            const { id } = req.params;

            await chatService.deleteConversation(user.userId, id);

            res.status(200).json({ message: 'Conversation deleted' });
        } catch (error) {
            logger.error('Delete conversation controller error', error);
            res.status(500).json({ error: 'Failed to delete conversation' });
        }
    }

    /**
     * Handle sending a chat message
     */
    async sendMessage(req: Request, res: Response): Promise<void> {
        try {
            const { message, conversationId } = req.body as ChatRequest & { conversationId?: string };
            const user = (req as AuthenticatedRequest).user!;
            let targetConversationId = conversationId;

            // If no conversationId, create one
            if (!targetConversationId) {
                const newConv = await chatService.createConversation(user.userId, message.substring(0, 30) + '...');
                targetConversationId = newConv.id;
            }

            // Store user message
            await chatService.storeMessage(user.userId, 'user', message, targetConversationId!);

            // Get recent conversation history for context
            const history = await chatService.getRecentHistory(user.userId, targetConversationId!, 10);

            // Generate AI response with context
            const aiResponse = await aiService.generateResponse(message, history);

            // Store AI response
            await chatService.storeMessage(user.userId, 'assistant', aiResponse, targetConversationId!);

            res.status(200).json({
                message: aiResponse,
                role: 'assistant',
                timestamp: new Date().toISOString(),
                conversationId: targetConversationId // Return conversation ID so client can update
            });
        } catch (error: any) {
            logger.error('Send message controller error', error);

            if (error.status === 429) {
                res.status(429).json({
                    error: 'Too Many Requests',
                    message: error.message,
                    retryAfter: error.retryAfter
                });
                return;
            }

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
            const conversationId = req.query.conversationId as string;

            if (!conversationId) {
                res.status(400).json({ error: 'Conversation ID is required' });
                return;
            }

            const limit = parseInt(req.query.limit as string) || 50;
            const offset = parseInt(req.query.offset as string) || 0;

            const messages = await chatService.getChatHistory(user.userId, conversationId, limit, offset);

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
     * Handle deleting chat history (clears all)
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
