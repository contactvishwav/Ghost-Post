import { useState } from 'react';
import { Loader2, Zap, ArrowRight, Save, Sparkles } from 'lucide-react';

interface AdaptationStudioProps {
    currentContent: string;
    onUpdateContent: (newContent: string) => void;
    onSave: () => void;
    isSaving: boolean;
}

const PRESETS = [
    { id: 'shorter', label: 'Make it Punchier', icon: Zap },
    { id: 'academic', label: 'More Professional', icon: ArrowRight },
    { id: 'emojis', label: 'Add Formatting/Emojis', icon: Sparkles },
    { id: 'softer', label: 'More Empathetic', icon: ArrowRight },
];

export default function AdaptationStudio({ currentContent, onUpdateContent, onSave, isSaving }: AdaptationStudioProps) {
    const [localContent, setLocalContent] = useState(currentContent);
    const [isGenerating, setIsGenerating] = useState(false);
    const [customInstruction, setCustomInstruction] = useState('');

    const handleGenerate = async (presetId: string) => {
        if (!localContent) return;
        setIsGenerating(true);
        
        try {
            const res = await fetch('/api/workflow/variations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-request-id': crypto.randomUUID() },
                body: JSON.stringify({ currentPost: localContent, preset: presetId })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            
            setLocalContent(data.variation);
            onUpdateContent(data.variation);
        } catch (error: any) {
            alert(`Failed to generate variation: ${error.message}`);
        } finally {
            setIsGenerating(false);
            setCustomInstruction('');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-geist tracking-wide text-[var(--text-1)]">5. Adapt & Refine</h2>
                    <p className="text-sm font-light text-[var(--text-3)]">Adjust the tone or fix the formatting inline.</p>
                </div>
                <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--void-surface)] border border-[var(--border)] rounded-[4px] text-sm text-[var(--text-1)] hover:border-[var(--plasma)] transition-all disabled:opacity-50"
                >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Session
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Editor */}
                <div className="flex-1 flex flex-col min-h-[500px]">
                    <textarea
                        value={localContent}
                        onChange={(e) => {
                            setLocalContent(e.target.value);
                            onUpdateContent(e.target.value);
                        }}
                        className="flex-1 w-full p-6 bg-[var(--void-surface)] border border-[var(--border)] rounded-[8px] text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--plasma)] transition-colors resize-none font-light leading-relaxed shadow-inner"
                        placeholder="Your draft content..."
                    />
                </div>

                {/* Right: Controls */}
                <div className="w-full lg:w-80 flex flex-col gap-4">
                    <div className="p-5 border border-[var(--border)] rounded-[8px] bg-[var(--void-surface)]">
                        <h3 className="text-sm font-geist uppercase tracking-wider text-[var(--text-2)] mb-4">Quick Adjustments</h3>
                        
                        <div className="space-y-3">
                            {PRESETS.map((preset) => {
                                const Icon = preset.icon;
                                return (
                                    <button
                                        key={preset.id}
                                        onClick={() => handleGenerate(preset.id)}
                                        disabled={isGenerating}
                                        className="w-full flex items-center justify-between p-3 rounded-[6px] border border-[var(--border)] bg-[var(--void-base)] hover:border-[var(--plasma)] hover:bg-[var(--plasma-dim)] transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="text-sm text-[var(--text-1)] font-medium group-hover:text-[var(--plasma)] transition-colors">{preset.label}</span>
                                        <Icon size={14} className="text-[var(--text-3)] group-hover:text-[var(--plasma)] transition-colors" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-5 border border-[var(--border)] rounded-[8px] bg-[var(--void-surface)]">
                        <h3 className="text-sm font-geist uppercase tracking-wider text-[var(--text-2)] mb-4">Custom Instruction</h3>
                        <textarea
                            value={customInstruction}
                            onChange={(e) => setCustomInstruction(e.target.value)}
                            placeholder="e.g. Add a P.S. about my newsletter..."
                            className="w-full h-24 p-3 bg-[var(--void-base)] border border-[var(--border)] rounded-[6px] text-sm text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--plasma)] transition-colors resize-none mb-3"
                        />
                        <button
                            onClick={() => handleGenerate(customInstruction)}
                            disabled={!customInstruction.trim() || isGenerating}
                            className="w-full flex items-center justify-center gap-2 bg-[var(--plasma)] text-white px-4 py-2.5 rounded-[4px] font-geist text-xs uppercase tracking-wider hover:bg-[var(--plasma-dim)] hover:text-[var(--plasma)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                            Apply Custom
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
