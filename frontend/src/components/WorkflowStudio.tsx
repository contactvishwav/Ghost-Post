import React, { useState } from 'react';
import { Layers, Lightbulb, PenTool, GitMerge, FileCheck, Send, Sparkles } from 'lucide-react';
import PlatformSelector from './workflow/PlatformSelector';
import IntentGrid from './workflow/IntentGrid';
import DumpEditor from './workflow/DumpEditor';
import { logger } from '../utils/logger';

// Types
export type Platform = 'linkedin' | 'instagram' | 'tiktok';

export interface WorkflowState {
    step: number;
    platform: Platform;
    intentId: string | null;
    rawThoughts: string;
    // We will expand this as we build out the other steps
}

const steps = [
    { id: 1, label: 'Intent', icon: Lightbulb },
    { id: 2, label: 'Dump', icon: PenTool },
    { id: 3, label: 'Choose', icon: GitMerge },
    { id: 4, label: 'Polish', icon: Sparkles },
    { id: 5, label: 'Adapt', icon: Layers },
    { id: 6, label: 'Publish', icon: FileCheck },
];

export default function WorkflowStudio() {
    const [state, setState] = useState<WorkflowState>({
        step: 1,
        platform: 'linkedin',
        intentId: null,
        rawThoughts: '',
    });

    const updateState = (updates: Partial<WorkflowState>) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    const handleNext = () => {
        logger.info(`Advancing from step ${state.step} to ${state.step + 1}`);
        updateState({ step: state.step + 1 });
    };

    const handleBack = () => {
        if (state.step > 1) {
            updateState({ step: state.step - 1 });
        }
    };

    const renderStepContent = () => {
        switch (state.step) {
            case 1:
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <PlatformSelector 
                            selected={state.platform} 
                            onSelect={(platform) => updateState({ platform })} 
                        />
                        <IntentGrid 
                            selectedId={state.intentId} 
                            onSelect={(intentId) => updateState({ intentId })} 
                        />
                        <div className="flex justify-end pt-6">
                            <button
                                onClick={handleNext}
                                disabled={!state.intentId}
                                className="flex items-center gap-2 bg-[var(--violet)] text-white px-6 py-2.5 rounded-[4px] font-geist text-sm uppercase tracking-wider hover:bg-[var(--violet-dim)] hover:text-[var(--violet)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next Step <Send size={14} />
                            </button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <DumpEditor 
                            value={state.rawThoughts} 
                            onChange={(rawThoughts) => updateState({ rawThoughts })} 
                        />
                        <div className="flex justify-between pt-6">
                            <button
                                onClick={handleBack}
                                className="text-[var(--text-2)] hover:text-[var(--text-1)] px-4 py-2 text-sm font-light transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!state.rawThoughts.trim()}
                                className="flex items-center gap-2 bg-[var(--plasma)] text-white px-6 py-2.5 rounded-[4px] font-geist text-sm uppercase tracking-wider hover:bg-[var(--plasma-dim)] hover:text-[var(--plasma)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Generate Hooks <Sparkles size={14} />
                            </button>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center py-20 text-[var(--text-3)]">
                        <Sparkles size={48} className="mb-4 text-[var(--violet)]/50" />
                        <h3 className="text-xl font-geist tracking-wide text-[var(--text-1)] mb-2">Step {state.step} Under Construction</h3>
                        <p className="text-sm font-light">We are building this part of the engine room.</p>
                        <button onClick={handleBack} className="mt-8 text-[var(--plasma)] hover:underline">Go Back</button>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-5xl mx-auto w-full min-h-[calc(100vh-4rem)] flex flex-col pt-8 pb-24 px-6 relative">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-3xl font-geist tracking-wide text-[var(--text-1)] flex items-center gap-3">
                    <Layers className="text-[var(--violet)]" />
                    Content Workflow
                </h1>
                <p className="text-[var(--text-2)] mt-2 font-light text-lg">
                    Transform messy ideas into highly-converting multi-platform posts.
                </p>
            </div>

            {/* Stepper */}
            <div className="w-full mb-12">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-[var(--border)] -z-10" />
                    <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-[var(--violet)] -z-10 transition-all duration-500 ease-in-out" 
                        style={{ width: \`\${((state.step - 1) / (steps.length - 1)) * 100}%\` }}
                    />
                    
                    {steps.map((s) => {
                        const Icon = s.icon;
                        const isActive = state.step === s.id;
                        const isCompleted = state.step > s.id;
                        
                        return (
                            <div key={s.id} className="flex flex-col items-center gap-3 bg-[var(--void)] px-4">
                                <div className={\`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 \${
                                    isActive ? 'bg-[var(--violet-dim)] border-[var(--violet)] text-[var(--violet)] shadow-[0_0_15px_rgba(var(--violet-rgb),0.3)]' :
                                    isCompleted ? 'bg-[var(--violet)] border-[var(--violet)] text-white' :
                                    'bg-[var(--void-surface)] border-[var(--border)] text-[var(--text-3)]'
                                }\`}>
                                    <Icon size={16} />
                                </div>
                                <span className={\`text-xs font-geist uppercase tracking-wider \${
                                    isActive ? 'text-[var(--text-1)]' :
                                    isCompleted ? 'text-[var(--violet)]' :
                                    'text-[var(--text-3)]'
                                }\`}>
                                    {s.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
                {renderStepContent()}
            </div>
        </div>
    );
}
