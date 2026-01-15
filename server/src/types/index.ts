import { Request } from 'express';

export interface User {
    id: string;
    email: string;
    password: string;
    created_at: string;
}

export interface Message {
    id: string;
    user_id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
}

export interface AuthRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
    };
}

export interface ChatRequest {
    message: string;
}

export interface ChatResponse {
    message: string;
    role: 'assistant';
    timestamp: string;
}

export interface ChatHistoryResponse {
    messages: Array<{
        role: 'user' | 'assistant';
        content: string;
        timestamp: string;
    }>;
}

export interface JWTPayload {
    userId: string;
    email: string;
}

export interface AuthenticatedRequest extends Request {
    user?: JWTPayload;
}

export interface ErrorResponse {
    error: string;
    message: string;
    statusCode: number;
}
