'use client';

import React, { useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';

export const ChatContainer: React.FC = () => {
    const { messages, sendMessage, loadHistory, loading, error } = useChat();

    useEffect(() => {
        loadHistory();
    }, []);

    const handleSendMessage = async (message: string) => {
        await sendMessage(message);
    };

    return (
        <div className="flex flex-col h-full bg-gray-900">
            <MessageList messages={messages} />
            {error && (
                <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/20 text-red-400 text-sm text-center">
                    {error}
                </div>
            )}
            {loading && <TypingIndicator />}
            <MessageInput onSend={handleSendMessage} disabled={loading} />
        </div>
    );
};
