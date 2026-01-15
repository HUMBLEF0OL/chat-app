'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <ProtectedRoute>
            <div className="h-screen flex bg-gray-900 text-white">
                {/* Sidebar */}
                <ChatSidebar />

                {/* Main Content */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    {/* Header */}
                    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between shrink-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h1 className="text-xl font-bold text-white">AI Chat</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400">{user?.email}</span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition-all duration-200 flex items-center gap-2 text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </header>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-hidden relative">
                        <ChatContainer />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
