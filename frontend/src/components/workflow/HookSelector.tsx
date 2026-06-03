import { Sparkles, Loader2, Check } from 'lucide-react';

export interface HookVariant {
    id: string;
    label: string;
    text: string;
    type: string;
}

interface HookSelectorProps {
    hooks: HookVariant[];
    selectedHookId: string | null;
    onSelect: (hookId: string) => void;
    isLoading: boolean;
}

export default function HookSelector({ hooks, selectedHookId, onSelect, isLoading }: HookSelectorProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center border border-[var(--border)] rounded-[8px] bg-[var(--void-surface)]">
                <Loader2 size={32} className="animate-spin text-[var(--plasma)] mb-4" />
                <h3 className="text-lg font-geist tracking-wide text-[var(--text-1)] mb-2">Generating Strategic Hooks</h3>
                <p className="text-sm font-light text-[var(--text-3)] max-w-md">
                    Our drafting agents are analyzing your intent and generating 3 variations based on top-performing frameworks...
                </p>
            </div>
        );
    }

    if (!hooks || hooks.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-geist tracking-wide text-[var(--text-1)]">3. Choose your Entry Point</h2>
                    <p className="text-sm font-light text-[var(--text-3)] mt-1">Select the hook that best stops the scroll.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--plasma-dim)] border border-[var(--plasma)]/30 rounded-full text-xs text-[var(--plasma)] font-geist">
                    <Sparkles size={14} />
                    AI Generated
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {hooks.map((hook) => {
                    const isSelected = selectedHookId === hook.id;
                    return (
                        <button
                            key={hook.id}
                            onClick={() => onSelect(hook.id)}
                            className={`relative text-left p-6 rounded-[8px] border transition-all duration-300 group ${
                                isSelected 
                                ? 'border-[var(--plasma)] bg-[var(--plasma-dim)] shadow-[0_0_20px_rgba(var(--plasma-rgb),0.1)]' 
                                : 'border-[var(--border)] bg-[var(--void-surface)] hover:border-[var(--plasma)]/50 hover:bg-[var(--void-surface-2)]'
                            }`}
                        >
                            <div className="flex justify-between items-start gap-4 mb-3">
                                <span className={`text-xs font-geist uppercase tracking-wider px-2 py-1 rounded ${
                                    isSelected ? 'bg-[var(--plasma)] text-[var(--void-base)]' : 'bg-[var(--void-base)] text-[var(--text-2)] border border-[var(--border)] group-hover:border-[var(--plasma)]/30'
                                }`}>
                                    {hook.label}
                                </span>
                                {isSelected && (
                                    <div className="w-5 h-5 rounded-full bg-[var(--plasma)] text-white flex items-center justify-center shrink-0">
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                )}
                            </div>
                            
                            <p className={`text-lg leading-relaxed ${isSelected ? 'text-[var(--text-1)] font-medium' : 'text-[var(--text-2)] font-light'}`}>
                                "{hook.text}"
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
