/**
 * AI Model configurations (Role-based, provider-agnostic).
 * Fallbacks mirror the values in .env.example so the app works
 * out of the box when an env var is accidentally omitted.
 */
export const MODELS = {
    SECURITY: {
        DEFAULT: process.env.SECURITY_MODEL || 'gpt-4o-mini',
        GUARD:   process.env.GUARD_MODEL    || 'gpt-4o-mini',
    },
    DRAFTING: {
        DEFAULT: process.env.DRAFTING_MODEL || 'sonar',
    },
    VALIDATION: {
        DEFAULT: process.env.VALIDATION_MODEL || 'gemini-2.5-flash',
    },
    REFINEMENT: {
        DEFAULT: process.env.REFINEMENT_MODEL || 'gpt-4o',
    },
};
