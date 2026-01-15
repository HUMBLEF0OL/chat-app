import { ChatHistory, SendMessageRequest, SendMessageResponse } from '@/types/chat.types';
import { authService } from './auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const chatService = {
    async sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
        const token = authService.getToken();

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_URL}/chat/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            if (response.status === 429) {
                throw {
                    status: 429,
                    message: error.message || 'Too many requests. Please try again later.',
                    retryAfter: error.retryAfter
                };
            }
            throw new Error(error.message || 'Failed to send message');
        }

        return await response.json();
    },

    async getHistory(): Promise<ChatHistory> {
        const token = authService.getToken();

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_URL}/chat/history`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch chat history');
        }

        return await response.json();
    },

    async deleteHistory(): Promise<{ message: string; deletedCount: number }> {
        const token = authService.getToken();

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_URL}/chat/history`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete chat history');
        }

        return await response.json();
    },
};
