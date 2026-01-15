'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Message } from '@/types/chat.types';
import { chatService } from '@/services/chat.service';

interface ChatContextType {
    messages: Message[];
    sendMessage: (message: string) => Promise<void>;
    loadHistory: () => Promise<void>;
    clearHistory: () => Promise<void>;
    loading: boolean;
    error: string | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(async (message: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await chatService.sendMessage({ message });

            // Create a message object that matches the UI format
            const newMessage: Message = {
                id: `msg_${Date.now()}`,
                userId: '', // Will be populated from history
                userMessage: message,
                aiResponse: response.message, // API returns 'message' not 'response'
                timestamp: response.timestamp,
            };

            setMessages((prev) => [...prev, newMessage]);
        } catch (error: any) {
            console.error('Failed to send message:', error);
            if (error.status === 429) {
                const retryMsg = error.retryAfter ? ` (Retry in ${error.retryAfter}s)` : '';
                setError(error.message + retryMsg);
            } else {
                setError(error.message || 'Failed to send message');
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const loadHistory = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const history = await chatService.getHistory();

            // Transform API messages to UI format
            const transformedMessages: Message[] = [];
            for (let i = 0; i < history.messages.length; i++) {
                const msg = history.messages[i];
                if (msg.role === 'user') {
                    // Find the next assistant message
                    const nextMsg = history.messages[i + 1];
                    if (nextMsg && nextMsg.role === 'assistant') {
                        transformedMessages.push({
                            id: `msg_${i}`,
                            userId: '',
                            userMessage: msg.content,
                            aiResponse: nextMsg.content,
                            timestamp: msg.timestamp,
                        });
                        i++; // Skip the assistant message in next iteration
                    }
                }
            }

            setMessages(transformedMessages);
        } catch (error: any) {
            console.error('Failed to load history:', error);
            // Don't throw, just log - it's okay if history fails to load
        } finally {
            setLoading(false);
        }
    }, []);

    const clearHistory = useCallback(async () => {
        try {
            await chatService.deleteHistory();
            setMessages([]);
            setError(null);
        } catch (error: any) {
            console.error('Failed to clear history:', error);
            throw error;
        }
    }, []);

    return (
        <ChatContext.Provider value={{ messages, sendMessage, loadHistory, clearHistory, loading, error }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
