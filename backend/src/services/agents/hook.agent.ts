import axios from 'axios';
import { BaseAgent, AgentResponse } from './base.agent';
import config from '../../config';

export class HookAgent extends BaseAgent {
    constructor(requestId?: string) {
        super('HookAgent', requestId);
    }

    async refineHooks(content: string, tone: string, hookTip = 'Pattern Interrupt'): Promise<AgentResponse> {
        this.log('Refining viral hooks in parallel...');

        if (config.drafting.isMockMode) {
            return { success: true, data: '' };
        }

        return this.withRetry(async () => {
            const response = await axios.post(config.drafting.url, {
                model: config.drafting.model,
                messages: [
                    {
                        role: 'system',
                        content: config.prompts.hook(tone, hookTip, content)
                    }
                ],
                max_tokens: 500,
            }, {
                headers: {
                    'Authorization': `Bearer ${config.drafting.apiKey}`,
                    'Content-Type': 'application/json',
                    ...this.getHeliconeHeaders('hook-refinement')
                }
            });

            const hook = response.data.choices[0].message.content || '';
            return { success: true, data: hook };
        });
    }
}
