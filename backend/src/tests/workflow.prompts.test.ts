import { generateWorkflowStructurePrompt, generateWorkflowPostPrompt, generateWorkflowVariationsPrompt } from '../config/prompts/workflow.prompts';

describe('Workflow Prompt Builders (TDD)', () => {
    const mockData = {
        intent: 'Tell a personal story',
        messyIdea: 'I failed my first startup but learned about resilience.',
        targetAudience: 'Aspiring entrepreneurs',
        desiredTone: 'Vulnerable and authentic',
        avoidList: ['corporate fluff', 'generic advice']
    };

    describe('generateWorkflowStructurePrompt', () => {
        it('should include the intent and messy idea in the prompt', () => {
            const prompt = generateWorkflowStructurePrompt(mockData);
            expect(prompt).toContain(mockData.intent);
            expect(prompt).toContain(mockData.messyIdea);
        });

        it('should request exactly 3 hooks in the output format', () => {
            const prompt = generateWorkflowStructurePrompt(mockData);
            expect(prompt).toContain('Generate 3 distinct hook options');
            expect(prompt).toContain('[HOOK_1]');
            expect(prompt).toContain('[HOOK_2]');
            expect(prompt).toContain('[HOOK_3]');
        });

        it('should include specific fields for structure, message, and CTA', () => {
            const prompt = generateWorkflowStructurePrompt(mockData);
            expect(prompt).toContain('[STRUCTURE]');
            expect(prompt).toContain('[CORE_MESSAGE]');
            expect(prompt).toContain('[CTA]');
        });
    });

    describe('generateWorkflowPostPrompt', () => {
        const selectedHook = 'Failure isn\'t the end; it\'s the best teacher I ever had.';
        const selectedStructure = 'Narrative arc: Failure -> Lesson -> Resilience -> Growth';

        it('should include the selected hook and structure', () => {
            const prompt = generateWorkflowPostPrompt({
                ...mockData,
                selectedHook,
                selectedStructure
            });
            expect(prompt).toContain(selectedHook);
            expect(prompt).toContain(selectedStructure);
        });

        it('should enforce the human-like writing guidelines', () => {
            const prompt = generateWorkflowPostPrompt({ ...mockData, selectedHook, selectedStructure });
            expect(prompt).toContain('HUMAN-LIKE WRITING GUIDELINES');
            expect(prompt).toContain('AI-ISM BAN LIST');
        });
    });

    describe('generateWorkflowVariationsPrompt', () => {
        const refinedPost = 'This is a high-quality LinkedIn post about resilience.';

        it('should request 5 specific variations', () => {
            const prompt = generateWorkflowVariationsPrompt(refinedPost);
            expect(prompt).toContain('Short version');
            expect(prompt).toContain('Authoritative version');
            expect(prompt).toContain('Storytelling version');
            expect(prompt).toContain('Concise version');
            expect(prompt).toContain('Stronger hook version');
        });
    });
});
