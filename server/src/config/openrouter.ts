import OpenAI from 'openai';
import { config } from './env';

let openaiClient: OpenAI | null = null;

export function getOpenRouterClient(): OpenAI {
    if (!openaiClient) {
        openaiClient = new OpenAI({
            apiKey: config.openRouterApiKey,
            baseURL: 'https://openrouter.ai/api/v1',
        });
    }
    return openaiClient;
}
