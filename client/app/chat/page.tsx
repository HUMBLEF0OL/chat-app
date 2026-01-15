'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
    const { user, logout } = useAuth();
    const { clearHistory } = useChat();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const handleDeleteChat = async () => {
        if (confirm('Are you sure you want to delete all chat history?')) {
            try {
                await clearHistory();
            } catch (error) {
                alert('Failed to delete chat history');
            }
        }
    };

    const handleNewChat = async () => {
        if (confirm('Start a new chat? This will clear the current conversation.')) {
            try {
                await clearHistory();
            } catch (error) {
                alert('Failed to start new chat');
            }
        }
    };

    return (
        <ProtectedRoute>
            <div className="h-screen flex flex-col">
                {/* Header */}
                <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 px-6 py-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">AI Chat</h1>
                                <p className="text-sm text-gray-400">{user?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleNewChat}
                                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 flex items-center gap-2"
                                title="New Chat"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Chat
                            </button>
                            <button
                                onClick={handleDeleteChat}
                                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all duration-200 flex items-center gap-2"
                                title="Delete Chat History"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition-all duration-200 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                {/* Chat Container */}
                <div className="flex-1 overflow-hidden">
                    <ChatContainer />
                </div>
            </div>
        </ProtectedRoute>
    );
}
