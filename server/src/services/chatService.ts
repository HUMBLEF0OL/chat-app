import { getSupabaseClient } from '../config/supabase';
import { Message } from '../types';
import { logger } from '../utils/logger';

export class ChatService {
    private supabase = getSupabaseClient();

    /**
     * Store a message in the database
     */
    async storeMessage(
        userId: string,
        role: 'user' | 'assistant',
        content: string
    ): Promise<Message> {
        try {
            const { data, error } = await this.supabase
                .from('messages')
                .insert({
                    user_id: userId,
                    role,
                    content,
                })
                .select()
                .single();

            if (error) {
                logger.error('Failed to store message', error);
                throw new Error('Failed to save message');
            }

            return data;
        } catch (error) {
            logger.error('Store message error', error);
            throw error;
        }
    }

    /**
     * Fetch chat history for a user
     */
    async getChatHistory(
        userId: string,
        limit: number = 50,
        offset: number = 0
    ): Promise<Message[]> {
        try {
            const { data, error } = await this.supabase
                .from('messages')
                .select('*')
                .eq('user_id', userId)
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
        messageCount: number = 10
    ): Promise<Array<{ role: 'user' | 'assistant'; content: string }>> {
        try {
            const { data, error } = await this.supabase
                .from('messages')
                .select('role, content')
                .eq('user_id', userId)
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
     * Delete all messages for a user
     */
    async deleteUserHistory(userId: string): Promise<void> {
        try {
            const { error } = await this.supabase
                .from('messages')
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
