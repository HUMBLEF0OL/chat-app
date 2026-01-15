import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface EnvConfig {
    port: number;
    nodeEnv: string;
    jwtSecret: string;
    jwtExpiresIn: string | number;
    supabaseUrl: string;
    supabaseServiceRoleKey: string;
    openRouterApiKey: string;
}

function validateEnv(): EnvConfig {
    const requiredEnvVars = [
        'JWT_SECRET',
        'SUPABASE_URL',
        'SUPABASE_SERVICE_ROLE_KEY',
        'OPENROUTER_API_KEY',
    ];

    const missing = requiredEnvVars.filter((varName) => !process.env[varName]);

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}\n` +
            'Please check your .env file and ensure all required variables are set.'
        );
    }

    return {
        port: parseInt(process.env.PORT || '3000', 10),
        nodeEnv: process.env.NODE_ENV || 'development',
        jwtSecret: process.env.JWT_SECRET!,
        jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
        supabaseUrl: process.env.SUPABASE_URL!,
        supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        openRouterApiKey: process.env.OPENROUTER_API_KEY!,
    };
}

export const config = validateEnv();
