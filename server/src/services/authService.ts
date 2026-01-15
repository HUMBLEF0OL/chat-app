import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getSupabaseClient } from '../config/supabase';
import { config } from '../config/env';
import { JWTPayload, AuthResponse } from '../types';
import { logger } from '../utils/logger';

const SALT_ROUNDS = 10;

export class AuthService {
    private supabase = getSupabaseClient();

    /**
     * Register a new user
     */
    async signup(email: string, password: string): Promise<AuthResponse> {
        try {
            // Check if user already exists
            const { data: existingUser } = await this.supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .single();

            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

            // Create user
            const { data: newUser, error } = await this.supabase
                .from('users')
                .insert({
                    email,
                    password: hashedPassword,
                })
                .select('id, email')
                .single();

            if (error) {
                logger.error('Failed to create user', error);
                throw new Error('Failed to create user account');
            }

            // Generate JWT
            const token = this.generateToken({
                userId: newUser.id,
                email: newUser.email,
            });

            return {
                token,
                user: {
                    id: newUser.id,
                    email: newUser.email,
                },
            };
        } catch (error) {
            logger.error('Signup error', error);
            throw error;
        }
    }

    /**
     * Authenticate user and issue JWT
     */
    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            // Fetch user
            const { data: user, error } = await this.supabase
                .from('users')
                .select('id, email, password')
                .eq('email', email)
                .single();

            if (error || !user) {
                throw new Error('Invalid email or password');
            }

            // Compare password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }

            // Generate JWT
            const token = this.generateToken({
                userId: user.id,
                email: user.email,
            });

            return {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                },
            };
        } catch (error) {
            logger.error('Login error', error);
            throw error;
        }
    }

    /**
     * Generate JWT token
     */
    private generateToken(payload: JWTPayload): string {
        return jwt.sign(payload, config.jwtSecret, {
            expiresIn: config.jwtExpiresIn as any,
        });
    }
}

export const authService = new AuthService();
