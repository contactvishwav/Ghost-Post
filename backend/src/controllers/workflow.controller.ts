import { Request, Response } from 'express';
import { SecurityAgent } from '../services/agents/security.agent';
import { DraftingAgent } from '../services/agents/drafting.agent';
import { intentRegistry } from '../services/workflow/intent.registry';
import { LinkedInStrategy } from '../services/workflow/platform.strategy';
import logger from '../utils/logger';

export const generateHooks = async (req: Request, res: Response) => {
    try {
        const { platform, intentId, rawThoughts } = req.body;
        const requestId = req.headers['x-request-id'] as string;

        if (!rawThoughts) {
            return res.status(400).json({ error: 'Missing rawThoughts' });
        }

        // Security check
        const securityAgent = new SecurityAgent(requestId);
        const securityResult = await securityAgent.validateInbound(rawThoughts);
        if (!securityResult.success) {
            return res.status(400).json({ error: securityResult.error || 'Security check failed' });
        }
        
        const sanitizedInput = securityResult.data;

        // Retrieve strategy & intent
        const strategy = platform === 'linkedin' ? new LinkedInStrategy() : new LinkedInStrategy();
        const intent = intentRegistry.getIntent(intentId) || intentRegistry.getIntent('share_lesson')!;

        // Generate 3 parallel hooks with different variations
        const draftingAgent = new DraftingAgent(requestId);

        const hookTypes = [
            { id: 'contrarian', description: 'Challenge a common assumption or best practice.' },
            { id: 'story', description: 'Start with a specific moment in time ("I remember when...").' },
            { id: 'value', description: 'Promise immediate, concrete value ("Here is how to...").' }
        ];

        const hookPromises = hookTypes.map(async (hookType) => {
            const prompt = `
Generate a single, highly engaging hook for a ${platform} post.
Goal: ${intent.label}
Intent Blueprint: ${intent.blueprint}
Platform Guidelines: ${strategy.getHookGuidelines()}

Specific Hook Strategy for this variation:
${hookType.description}

Raw Input from Creator:
"""
${sanitizedInput}
"""

Return ONLY the hook text (1-3 sentences). No quotes, no preamble.
`;
            const response = await draftingAgent.generateDraft(prompt);
            return {
                id: hookType.id,
                label: hookType.id.charAt(0).toUpperCase() + hookType.id.slice(1),
                text: response.data || '',
                type: hookType.id
            };
        });

        const hooks = await Promise.all(hookPromises);

        res.json({ hooks, sanitizedInput });
    } catch (error: any) {
        logger.error({ error }, 'Failed to generate hooks');
        res.status(500).json({ error: 'Failed to generate hooks' });
    }
};

export const generatePost = async (req: Request, res: Response) => {
    try {
        const { platform, intentId, sanitizedInput, selectedHook } = req.body;
        const requestId = req.headers['x-request-id'] as string;

        if (!sanitizedInput || !selectedHook) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const strategy = platform === 'linkedin' ? new LinkedInStrategy() : new LinkedInStrategy();
        const intent = intentRegistry.getIntent(intentId) || intentRegistry.getIntent('share_lesson')!;

        const draftingAgent = new DraftingAgent(requestId);

        const prompt = `
Generate a complete, polished ${platform} post based on the creator's messy thoughts.

Goal: ${intent.label}
Intent Blueprint (Structure): ${intent.blueprint}

Platform Guidelines:
${strategy.getPostGuidelines()}

Formatting Rules:
${strategy.getFormattingRules()}

YOU MUST START THE POST WITH THIS EXACT HOOK:
"""
${selectedHook}
"""

Raw Input from Creator:
"""
${sanitizedInput}
"""

Write the rest of the post following the hook. Return ONLY the post text. No preamble.
`;
        
        const response = await draftingAgent.generateDraft(prompt);
        
        if (!response.success) {
            return res.status(500).json({ error: 'Failed to draft post' });
        }

        res.json({ post: response.data, hook: selectedHook });
    } catch (error: any) {
        logger.error({ error }, 'Failed to generate post');
        res.status(500).json({ error: 'Failed to generate post' });
    }
};
