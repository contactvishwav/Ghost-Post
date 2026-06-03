import { Mic } from 'lucide-react';

interface DumpEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function DumpEditor({ value, onChange }: DumpEditorProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-geist tracking-wide text-[var(--text-1)]">Dump your messy thoughts</h2>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--text-3)] font-light">Don't worry about spelling or grammar.</span>
                    <button 
                        className="flex items-center gap-2 px-3 py-1.5 bg-[var(--void-surface)] border border-[var(--border)] rounded-[4px] text-sm text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--text-3)] transition-colors"
                        title="Voice dictation coming soon"
                    >
                        <Mic size={14} className="text-[var(--plasma)]" />
                        Dictate (Soon)
                    </button>
                </div>
            </div>
            
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="I was thinking about how failure is actually... well, last week I completely messed up a presentation but then..."
                className="w-full min-h-[300px] p-6 bg-[var(--void-surface)] border border-[var(--border)] rounded-[8px] text-[var(--text-1)] text-lg leading-relaxed focus:outline-none focus:border-[var(--plasma)] focus:ring-1 focus:ring-[var(--plasma)] resize-y placeholder:text-[var(--text-3)] font-light transition-all"
            />
            
            <div className="flex justify-end">
                <span className="text-xs text-[var(--text-3)] font-geist">
                    {value.length} characters • {value.split(/\s+/).filter(Boolean).length} words
                </span>
            </div>
        </div>
    );
}
