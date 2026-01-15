import { getSupabaseClient } from '../config/supabase';
import { Message } from '../types';
import { logger } from '../utils/logger';

export class ChatService {
    private supabase = getSupabaseClient();

    /**
     * Create a new conversation
     */
    async createConversation(userId: string, title: string = 'New Chat') {
        try {
            const { data, error } = await this.supabase
                .from('conversations')
                .insert({
                    user_id: userId,
                    title
                })
                .select()
                .single();

            if (error) {
                logger.error('Failed to create conversation', error);
                throw new Error('Failed to create conversation');
            }

            return data;
        } catch (error) {
            logger.error('Create conversation error', error);
            throw error;
        }
    }

    /**
     * Get all conversations for a user
     */
    async getUserConversations(userId: string) {
        try {
            const { data, error } = await this.supabase
                .from('conversations')
                .select('*')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false });

            if (error) {
                logger.error('Failed to fetch conversations', error);
                throw new Error('Failed to fetch conversations');
            }

            return data || [];
        } catch (error) {
            logger.error('Get conversations error', error);
            throw error;
        }
    }

    /**
     * Delete a conversation
     */
    async deleteConversation(userId: string, conversationId: string) {
        try {
            const { error } = await this.supabase
                .from('conversations')
                .delete()
                .eq('id', conversationId)
                .eq('user_id', userId);

            if (error) {
                logger.error('Failed to delete conversation', error);
                throw new Error('Failed to delete conversation');
            }
        } catch (error) {
            logger.error('Delete conversation error', error);
            throw error;
        }
    }

    /**
     * Store a message in the database
     */
    async storeMessage(
        userId: string,
        role: 'user' | 'assistant',
        content: string,
        conversationId: string
    ): Promise<Message> {
        try {
            // Store message
            const { data, error } = await this.supabase
                .from('messages')
                .insert({
                    user_id: userId,
                    role,
                    content,
                    conversation_id: conversationId,
                })
                .select()
                .single();

            if (error) {
                logger.error('Failed to store message', error);
                throw new Error('Failed to save message');
            }

            // Update conversation updated_at
            await this.supabase
                .from('conversations')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', conversationId);

            return data;
        } catch (error) {
            logger.error('Store message error', error);
            throw error;
        }
    }

    /**
     * Fetch chat history for a specific conversation
     */
    async getChatHistory(
        userId: string,
        conversationId: string,
        limit: number = 50,
        offset: number = 0
    ): Promise<Message[]> {
        try {
            const { data, error } = await this.supabase
                .from('messages')
                .select('*')
                .eq('user_id', userId)
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true })
                .range(offset, offset + limit - 1);

            if (error) {
                logger.error('Failed to fetch chat history', error);
                throw new Error('Failed to retrieve chat history');
            }

            return data || [];
        } catch (error) {
            logger.error('Get chat history error', error);
            throw error;
        }
    }

    /**
     * Get recent conversation history for AI context
     */
    async getRecentHistory(
        userId: string,
        conversationId: string,
        messageCount: number = 10
    ): Promise<Array<{ role: 'user' | 'assistant'; content: string }>> {
        try {
            const { data, error } = await this.supabase
                .from('messages')
                .select('role, content')
                .eq('user_id', userId)
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: false })
                .limit(messageCount);

            if (error) {
                logger.error('Failed to fetch recent history', error);
                return [];
            }

            // Reverse to get chronological order
            return (data || []).reverse();
        } catch (error) {
            logger.error('Get recent history error', error);
            return [];
        }
    }

    /**
     * Delete all messages for a user (deprecated - prefers deleting conversations)
     */
    async deleteUserHistory(userId: string): Promise<void> {
        try {
            // Delete all conversations instead
            const { error } = await this.supabase
                .from('conversations')
                .delete()
                .eq('user_id', userId);

            if (error) {
                logger.error('Failed to delete user history', error);
                throw new Error('Failed to delete chat history');
            }
        } catch (error) {
            logger.error('Delete history error', error);
            throw error;
        }
    }
}

export const chatService = new ChatService();
