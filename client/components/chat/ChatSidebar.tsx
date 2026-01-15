'use client';

import React from 'react';
import { useChat } from '@/context/ChatContext';
import { Button } from '@/components/ui/Button';

export const ChatSidebar: React.FC = () => {
    const { conversations, currentConversationId, selectConversation, createConversation, deleteConversation } = useChat();

    return (
        <div className="w-64 h-full bg-gray-900 border-r border-gray-800 flex flex-col">
            <div className="p-4">
                <Button
                    onClick={() => createConversation()}
                    className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-none border-none"
                    variant="primary"
                >
                    + New Chat
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 space-y-1">
                {conversations.map((conv) => (
                    <div
                        key={conv.id}
                        className={`
                            group flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors
                            ${currentConversationId === conv.id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'}
                        `}
                        onClick={() => selectConversation(conv.id)}
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span className="flex-1 truncate text-sm">
                            {conv.title || 'New Chat'}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Delete this chat?')) deleteConversation(conv.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                ))}

                {conversations.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        No conversations yet
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-800">
                {/* User profile or other footer items can go here */}
            </div>
        </div>
    );
};
