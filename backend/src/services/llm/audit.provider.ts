import { GoogleGenerativeAI } from '@google/generative-ai';
import { LLMProvider, PromptPayload, LLMOptions } from './provider.interface';
import config from '../../config';
import logger from '../../utils/logger';

export class AuditProvider implements LLMProvider {
    private genAI: GoogleGenerativeAI | null = null;

    constructor() {
        if (!config.validation.isMockMode && config.validation.apiKey) {
            this.genAI = new GoogleGenerativeAI(config.validation.apiKey);
        }
    }

    getName(): string {
        return 'Audit';
    }

    async generateText(payload: PromptPayload[], _options?: LLMOptions): Promise<string> {
        if (config.validation.isMockMode || !this.genAI) {
            logger.info('MOCKING Validation response (Gemini)...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            return JSON.stringify({
                isValid: true,
                qualityScore: 10,
                confidenceScore: 95,
                hallucinations: [],
                suggestions: ['Keep up the good work!']
            });
        }

        try {
            const model = this.genAI.getGenerativeModel({ model: config.validation.model });

            // Combine all payload messages into a single prompt string.
            // The ValidationAgent always passes a single user message, so this is safe.
            const prompt = payload.map(p => p.content).join('\n\n');

            const result = await model.generateContent(prompt);
            const content = result.response.text();

            if (!content) throw new Error('No content returned from Gemini Validation provider');

            return content;
        } catch (error: any) {
            logger.error({ error: error.message }, 'Failed to generate text with Gemini Audit provider');
            throw error;
        }
    }
}
