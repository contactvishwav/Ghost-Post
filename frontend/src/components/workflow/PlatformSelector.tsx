import React from 'react';
import { Linkedin, Instagram, Video } from 'lucide-react';
import { Platform } from '../WorkflowStudio';

interface PlatformSelectorProps {
    selected: Platform;
    onSelect: (platform: Platform) => void;
}

const platforms = [
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-500', desc: 'Professional networking & authority building' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500', desc: 'Visual storytelling & carousels', disabled: true },
    { id: 'tiktok', name: 'TikTok', icon: Video, color: 'text-cyan-500', desc: 'Short-form video scripts', disabled: true },
];

export default function PlatformSelector({ selected, onSelect }: PlatformSelectorProps) {
    return (
        <div>
            <h2 className="text-xl font-geist tracking-wide text-[var(--text-1)] mb-6">1. Where are you publishing?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {platforms.map((p) => {
                    const Icon = p.icon;
                    const isSelected = selected === p.id;
                    return (
                        <button
                            key={p.id}
                            disabled={p.disabled}
                            onClick={() => onSelect(p.id as Platform)}
                            className={\`relative overflow-hidden flex flex-col items-start p-6 rounded-[8px] border text-left transition-all duration-300 \${
                                p.disabled ? 'opacity-40 cursor-not-allowed border-[var(--border)] bg-[var(--void-surface)]' :
                                isSelected ? 'border-[var(--violet)] bg-[var(--violet-dim)] shadow-[0_0_20px_rgba(var(--violet-rgb),0.1)]' :
                                'border-[var(--border)] bg-[var(--void-surface)] hover:border-[var(--text-3)] hover:bg-[var(--void-surface-2)]'
                            }\`}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={\`p-2 rounded-full \${isSelected ? 'bg-[var(--violet)] text-white' : 'bg-[var(--void)] text-[var(--text-2)]'}\`}>
                                    <Icon size={20} />
                                </div>
                                <span className={\`font-medium text-lg \${isSelected ? 'text-[var(--violet)]' : 'text-[var(--text-1)]'}\`}>
                                    {p.name}
                                </span>
                            </div>
                            <p className="text-sm font-light text-[var(--text-2)]">
                                {p.desc}
                            </p>
                            {p.disabled && (
                                <span className="absolute top-4 right-4 text-[10px] uppercase font-geist tracking-wider bg-[var(--void)] px-2 py-1 rounded text-[var(--text-3)] border border-[var(--border)]">
                                    Coming Soon
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
