'use client';

import React, { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled = false }) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSend(message.trim());
            setMessage('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [message]);

    const charCount = message.length;
    const maxChars = 5000;

    return (
        <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-xl p-4">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                <div className="relative">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message... (Shift+Enter for new line)"
                        disabled={disabled}
                        className="
              w-full px-4 py-3 pr-24
              bg-gray-800/50 border border-gray-700 rounded-xl
              text-white placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              resize-none overflow-hidden
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
            "
                        rows={1}
                        style={{ maxHeight: '200px' }}
                    />
                    <div className="absolute right-2 bottom-2 flex items-center gap-2">
                        <span className={`text-xs ${charCount > maxChars ? 'text-red-400' : 'text-gray-500'}`}>
                            {charCount}/{maxChars}
                        </span>
                        <button
                            type="submit"
                            disabled={disabled || !message.trim() || charCount > maxChars}
                            className="
                p-2 rounded-lg
                bg-blue-600
                hover:from-blue-700 hover:to-purple-700
                text-white
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
                shadow-lg shadow-blue-500/30
              "
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
