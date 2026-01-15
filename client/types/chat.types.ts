export interface Conversation {
    id: string;
    userId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
}

export interface ApiMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export interface Message {
    id: string;
    userId: string;
    userMessage: string;
    aiResponse: string;
    timestamp: string;
}

export interface ChatHistory {
    messages: ApiMessage[];
    pagination: {
        limit: number;
        offset: number;
        count: number;
    };
}

export interface SendMessageRequest {
    message: string;
    conversationId?: string;
}

export interface SendMessageResponse {
    message: string;
    role: 'assistant';
    timestamp: string;
    conversationId: string;
}

export interface ChatError {
    error: string;
    message: string;
    details?: Array<{
        field: string;
        message: string;
    }>;
}
