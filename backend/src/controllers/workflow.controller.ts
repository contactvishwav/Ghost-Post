import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
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

export const generateVariations = async (req: Request, res: Response) => {
    try {
        const { currentPost, preset } = req.body;
        const requestId = req.headers['x-request-id'] as string;

        if (!currentPost || !preset) {
            return res.status(400).json({ error: 'Missing currentPost or preset' });
        }

        const draftingAgent = new DraftingAgent(requestId);

        let instruction = '';
        switch (preset) {
            case 'shorter':
                instruction = 'Make this post significantly shorter, punchier, and more concise. Cut the fluff but keep the core message and the exact same hook.';
                break;
            case 'academic':
                instruction = 'Rewrite this post to be more professional, data-driven, and formal. Remove slang. Keep the core message and the exact same hook.';
                break;
            case 'emojis':
                instruction = 'Add relevant emojis to format this post better for social media reading (bullet points, emphasis). Do not change the text length much. Keep the hook.';
                break;
            case 'softer':
                instruction = 'Rewrite this to sound more empathetic, collaborative, and softer in tone. Keep the core message and the exact same hook.';
                break;
            default:
                instruction = preset; // Custom instruction
        }

        const prompt = `
You are an elite Social Media Copywriter. 
I have a draft of a post. I need you to create a variation based on these specific instructions:
INSTRUCTION: ${instruction}

ORIGINAL DRAFT:
"""
${currentPost}
"""

Return ONLY the new variation text. No preamble. No quotes around the text.
`;

        const response = await draftingAgent.generateDraft(prompt);
        
        if (!response.success) {
            return res.status(500).json({ error: 'Failed to generate variation' });
        }

        res.json({ variation: response.data });
    } catch (error: any) {
        logger.error({ error }, 'Failed to generate variation');
        res.status(500).json({ error: 'Failed to generate variation' });
    }
};

const prisma = new PrismaClient();

export const saveWorkflowSession = async (req: Request, res: Response) => {
    try {
        const { id, title, content, workflowMetadata } = req.body;
        
        // Either update existing or create new
        let post;
        if (id) {
            post = await prisma.post.update({
                where: { id },
                data: {
                    rawThoughts: workflowMetadata?.rawThoughts || '',
                    enhancedPost: content || '',
                    tone: workflowMetadata?.intentId || 'professional',
                    hookScore: 0,
                    hashtags: [],
                    workflowMetadata: workflowMetadata || {}
                }
            });
        } else {
            post = await prisma.post.create({
                data: {
                    rawThoughts: workflowMetadata?.rawThoughts || '',
                    enhancedPost: content || '',
                    tone: workflowMetadata?.intentId || 'professional',
                    hookScore: 0,
                    hashtags: [],
                    workflowMetadata: workflowMetadata || {},
                }
            });
        }

        res.json({ post });
    } catch (error: any) {
        logger.error({ error }, 'Failed to save workflow session');
        res.status(500).json({ error: 'Failed to save workflow session' });
    }
};

export const publishWorkflow = async (req: Request, res: Response) => {
    try {
        const { id, content } = req.body;
        if (!id) return res.status(400).json({ error: 'Post ID required for publishing' });

        const post = await prisma.post.update({
            where: { id },
            data: {
                enhancedPost: content,
            }
        });

        res.json({ post });
    } catch (error: any) {
        logger.error({ error }, 'Failed to publish workflow');
        res.status(500).json({ error: 'Failed to publish workflow' });
    }
};
