export interface WorkflowIntent {
    id: string;
    label: string;
    description: string;
    blueprint: string; // The strategic framework the LLM should use
}

export class IntentRegistry {
    private intents: Map<string, WorkflowIntent> = new Map();

    constructor() {
        this.registerDefaultIntents();
    }

    private registerDefaultIntents() {
        this.register({
            id: 'tell_story',
            label: 'Tell a personal story',
            description: 'Share a personal experience, failure, or lesson learned.',
            blueprint: 'Narrative Arc: Context -> Conflict/Failure -> Turning Point -> Lesson Learned -> Application for the reader.'
        });

        this.register({
            id: 'build_authority',
            label: 'Build authority',
            description: 'Share deep expertise, frameworks, or contrarian opinions.',
            blueprint: 'Expert Framework: State the common misconception -> Present the contrarian truth -> Provide 3-step framework to execute it -> Summary statement.'
        });

        this.register({
            id: 'share_lesson',
            label: 'Share a quick lesson',
            description: 'Provide a highly actionable tip or observation.',
            blueprint: 'Actionable Insight: Hook -> The core problem -> The 1-minute solution -> Concrete example -> Question for the audience.'
        });
        
        this.register({
            id: 'celebrate_win',
            label: 'Celebrate a milestone',
            description: 'Announce a new job, launch, or major achievement.',
            blueprint: 'Gratitude & Vision: The achievement -> The hard work behind it -> Thanks to supporters -> What\'s next.'
        });

        this.register({
            id: 'curate_knowledge',
            label: 'Curate knowledge',
            description: 'Share a list of tools, books, or resources.',
            blueprint: 'Curation: Hook explaining the value -> List of items with 1-sentence explanation each -> The #1 recommendation -> Ask for their favorites.'
        });

        this.register({
            id: 'start_conversation',
            label: 'Start a conversation',
            description: 'Ask a thought-provoking question to drive engagement.',
            blueprint: 'Debate: Present a trending topic -> State two opposing viewpoints -> Give a brief personal take -> Ask the audience "Where do you stand?".'
        });
    }

    register(intent: WorkflowIntent) {
        this.intents.set(intent.id, intent);
    }

    getIntent(id: string): WorkflowIntent | undefined {
        return this.intents.get(id);
    }

    getAllIntents(): WorkflowIntent[] {
        return Array.from(this.intents.values());
    }
}

export const intentRegistry = new IntentRegistry();
