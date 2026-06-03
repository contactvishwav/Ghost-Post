import React from 'react';
import { BookOpen, Award, Zap, Trophy, List, MessageCircle } from 'lucide-react';

interface IntentGridProps {
    selectedId: string | null;
    onSelect: (intentId: string) => void;
}

const intents = [
    { id: 'tell_story', label: 'Tell a personal story', icon: BookOpen, desc: 'Share a personal experience, failure, or lesson learned.' },
    { id: 'build_authority', label: 'Build authority', icon: Award, desc: 'Share deep expertise, frameworks, or contrarian opinions.' },
    { id: 'share_lesson', label: 'Share a quick lesson', icon: Zap, desc: 'Provide a highly actionable tip or observation.' },
    { id: 'celebrate_win', label: 'Celebrate a milestone', icon: Trophy, desc: 'Announce a new job, launch, or major achievement.' },
    { id: 'curate_knowledge', label: 'Curate knowledge', icon: List, desc: 'Share a list of tools, books, or resources.' },
    { id: 'start_conversation', label: 'Start a conversation', icon: MessageCircle, desc: 'Ask a thought-provoking question to drive engagement.' },
];

export default function IntentGrid({ selectedId, onSelect }: IntentGridProps) {
    return (
        <div>
            <h2 className="text-xl font-geist tracking-wide text-[var(--text-1)] mb-6">2. What's the goal of this post?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {intents.map((intent) => {
                    const Icon = intent.icon;
                    const isSelected = selectedId === intent.id;
                    return (
                        <button
                            key={intent.id}
                            onClick={() => onSelect(intent.id)}
                            className={\`flex flex-col items-start p-5 rounded-[6px] border text-left transition-all duration-300 \${
                                isSelected ? 'border-[var(--plasma)] bg-[var(--plasma-dim)] shadow-[0_0_15px_rgba(var(--plasma-rgb),0.1)]' :
                                'border-[var(--border)] bg-[var(--void-surface)] hover:border-[var(--text-3)] hover:bg-[var(--void-surface-2)]'
                            }\`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <Icon size={18} className={isSelected ? 'text-[var(--plasma)]' : 'text-[var(--text-2)]'} />
                                <span className={\`font-medium \${isSelected ? 'text-[var(--plasma)]' : 'text-[var(--text-1)]'}\`}>
                                    {intent.label}
                                </span>
                            </div>
                            <p className="text-sm font-light text-[var(--text-2)] leading-relaxed">
                                {intent.desc}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
