import { getOpenRouterClient } from '../config/openrouter';
import { logger } from '../utils/logger';
import OpenAI from 'openai';

const SYSTEM_PROMPT = 'You are a helpful customer support assistant.';
// Using a free model from OpenRouter
const MODEL = 'google/gemini-2.0-flash-exp:free';

export class AIService {
    private client: OpenAI;

    constructor() {
        this.client = getOpenRouterClient();
    }

    /**
     * Generate AI response for a user message
     * @param userMessage - The user's message
     * @param conversationHistory - Optional conversation history for context
     */
    async generateResponse(
        userMessage: string,
        conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
    ): Promise<string> {
        try {
            // Build conversation context
            const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
                { role: 'system', content: SYSTEM_PROMPT },
            ];

            // Add conversation history if provided
            if (conversationHistory && conversationHistory.length > 0) {
                conversationHistory.forEach((msg) => {
                    messages.push({
                        role: msg.role,
                        content: msg.content,
                    });
                });
            }

            // Add current user message
            messages.push({
                role: 'user',
                content: userMessage,
            });

            // Call OpenRouter API
            const completion = await this.client.chat.completions.create({
                model: MODEL,
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000,
            });

            const responseText = completion.choices[0]?.message?.content;

            if (!responseText) {
                throw new Error('Empty response from AI');
            }

            return responseText;
        } catch (error: any) {
            logger.error('AI generation error', error);
            if (error.status === 429 || error.code === 429) {
                const retryAfter = error.headers?.['retry-after'];
                throw {
                    status: 429,
                    message: 'AI service is temporarily busy. Please try again later.',
                    retryAfter
                };
            }
            throw new Error('Failed to generate AI response');
        }
    }

    /**
     * Generate AI response without conversation history (stateless)
     */
    async generateSimpleResponse(userMessage: string): Promise<string> {
        try {
            const completion = await this.client.chat.completions.create({
                model: MODEL,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: userMessage },
                ],
                temperature: 0.7,
                max_tokens: 1000,
            });

            const responseText = completion.choices[0]?.message?.content;

            if (!responseText) {
                throw new Error('Empty response from AI');
            }

            return responseText;
        } catch (error) {
            logger.error('AI generation error', error);
            throw new Error('Failed to generate AI response');
        }
    }
}

export const aiService = new AIService();
