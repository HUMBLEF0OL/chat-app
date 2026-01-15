import { AuthResponse, LoginRequest, SignupRequest } from '@/types/auth.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const authService = {
    async signup(data: SignupRequest): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Signup failed');
        }

        const result: AuthResponse = await response.json();

        // Store token in localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
        }

        return result;
    },

    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        const result: AuthResponse = await response.json();

        // Store token in localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
        }

        return result;
    },

    logout(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        }
    },

    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('auth_token');
        }
        return null;
    },

    getUser(): any | null {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        }
        return null;
    },
};
