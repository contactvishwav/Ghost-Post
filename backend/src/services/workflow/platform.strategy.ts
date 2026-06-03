export interface IPlatformStrategy {
    platformName: string;
    getHookGuidelines(): string;
    getPostGuidelines(): string;
    getFormattingRules(): string;
    getVariationPrompt(variationType: string, postContent: string): string;
}

export class LinkedInStrategy implements IPlatformStrategy {
    platformName = 'LinkedIn';

    getHookGuidelines(): string {
        return `
- The hook MUST be exactly 1-3 sentences.
- Use a "Pattern Interrupt" or a strong, counter-intuitive statement.
- Do NOT use clickbait or generic questions.
- End the hook in a way that naturally encourages the reader to click "See More".
`;
    }

    getPostGuidelines(): string {
        return `
- The tone should be professional, yet conversational and authentic.
- Keep paragraphs short (1-3 sentences max).
- Use spacing effectively to create a rhythmic reading experience.
- The core message should provide actionable value or a clear lesson.
- End with a subtle, non-salesy Call to Action (CTA) or a thought-provoking question for the comments.
`;
    }

    getFormattingRules(): string {
        return `
- DO NOT use bold or italic text formatting.
- Avoid excessive emojis; use them sparingly to break up text (max 3 per post).
- Include 3-5 relevant hashtags at the very bottom.
`;
    }

    getVariationPrompt(variationType: string, postContent: string): string {
        switch (variationType.toLowerCase()) {
            case 'short':
                return `Rewrite this post to be punchy and under 150 words. Focus only on the core lesson.\n\n${postContent}`;
            case 'storytelling':
                return `Rewrite this post by framing it around a personal anecdote or a specific moment in time. Enhance the narrative flow.\n\n${postContent}`;
            case 'authoritative':
                return `Rewrite this post to sound like an industry expert sharing definitive insights. Use strong, declarative sentences. Remove filler words.\n\n${postContent}`;
            case 'concise':
                return `Trim all fluff from this post. Make every word count. Use bullet points if necessary to make it highly scannable.\n\n${postContent}`;
            case 'stronger_hook':
                return `Keep the main body of this post, but completely rewrite the first 3 lines (the hook) to be much more provocative and scroll-stopping.\n\n${postContent}`;
            default:
                return `Rewrite this post targeting the '${variationType}' style.\n\n${postContent}`;
        }
    }
}
