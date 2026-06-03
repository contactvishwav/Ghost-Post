import { Loader2, Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface PostPreviewProps {
    postContent: string | null;
    isLoading: boolean;
}

export default function PostPreview({ postContent, isLoading }: PostPreviewProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!postContent) return;
        await navigator.clipboard.writeText(postContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center border border-[var(--border)] rounded-[8px] bg-[var(--void-surface)]">
                <Loader2 size={32} className="animate-spin text-[var(--violet)] mb-4" />
                <h3 className="text-lg font-geist tracking-wide text-[var(--text-1)] mb-2">Drafting your Post</h3>
                <p className="text-sm font-light text-[var(--text-3)] max-w-md">
                    Our AI is writing the body of your post, matching the platform constraints and weaving in your chosen hook...
                </p>
            </div>
        );
    }

    if (!postContent) return null;

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-xl font-geist tracking-wide text-[var(--text-1)]">4. Review your Draft</h2>
                    <p className="text-sm font-light text-[var(--text-3)]">Human-like text generated from your messy thoughts.</p>
                </div>
                <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-2 rounded-[4px] text-sm font-medium transition-all ${
                        copied 
                        ? 'bg-[var(--success)]/20 text-[var(--success)] border border-[var(--success)]/30' 
                        : 'bg-[var(--void-surface)] border border-[var(--border)] text-[var(--text-1)] hover:border-[var(--text-3)]'
                    }`}
                >
                    {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>

            <div className="bg-[var(--void-surface)] border border-[var(--border)] rounded-[8px] p-6 text-[var(--text-1)] text-lg leading-[1.8] font-light whitespace-pre-wrap shadow-lg shadow-[var(--void-base)]">
                {postContent}
            </div>
        </div>
    );
}
