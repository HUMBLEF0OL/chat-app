export interface User {
    id: string;
    email: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    email: string;
    password: string;
}

export interface AuthError {
    error: string;
    message: string;
    details?: Array<{
        field: string;
        message: string;
    }>;
}
