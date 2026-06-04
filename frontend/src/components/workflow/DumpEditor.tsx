import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';

interface DumpEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function DumpEditor({ value, onChange }: DumpEditorProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const ws = useRef<WebSocket | null>(null);
    const stream = useRef<MediaStream | null>(null);
    // Ref keeps the WebSocket onmessage callback in sync with the latest `value`
    // without requiring the socket to be recreated on every keystroke.
    const valueRef = useRef(value);
    useEffect(() => {
        valueRef.current = value;
    }, [value]);

    const startRecording = async () => {
        try {
            setIsConnecting(true);
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.current = audioStream;

            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${window.location.host}/api/voice/relay`;
            
            ws.current = new WebSocket(wsUrl);

            ws.current.onopen = () => {
                setIsConnecting(false);
                setIsRecording(true);
                
                mediaRecorder.current = new MediaRecorder(audioStream, {
                    mimeType: 'audio/webm',
                });

                mediaRecorder.current.addEventListener('dataavailable', (event) => {
                    if (event.data.size > 0 && ws.current?.readyState === WebSocket.OPEN) {
                        ws.current.send(event.data);
                    }
                });

                mediaRecorder.current.start(250); // Send audio chunks every 250ms
            };

            ws.current.onmessage = (event) => {
                const response = JSON.parse(event.data);
                if (response.channel && response.channel.alternatives[0]?.transcript) {
                    const transcript = response.channel.alternatives[0].transcript;
                    if (transcript.trim()) {
                        const current = valueRef.current;
                        onChange(current ? `${current} ${transcript}` : transcript);
                    }
                } else if (response.type === 'error') {
                    console.error('Deepgram Error:', response.message);
                    stopRecording();
                    alert(`Voice Error: ${response.message}`);
                }
            };

            ws.current.onerror = (error) => {
                console.error('WebSocket Error:', error);
                stopRecording();
            };

            ws.current.onclose = () => {
                stopRecording();
            };

        } catch (error) {
            console.error('Failed to start recording:', error);
            setIsConnecting(false);
            alert('Could not access microphone. Please check permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
            mediaRecorder.current.stop();
        }
        if (stream.current) {
            stream.current.getTracks().forEach(track => track.stop());
        }
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.close();
        }
        setIsRecording(false);
        setIsConnecting(false);
    };

    useEffect(() => {
        return () => {
            stopRecording(); // Cleanup on unmount
        };
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-geist tracking-wide text-[var(--text-1)]">Dump your messy thoughts</h2>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--text-3)] font-light">Don't worry about spelling or grammar.</span>
                    {isConnecting ? (
                        <button disabled className="flex items-center gap-2 px-3 py-1.5 bg-[var(--void-surface)] border border-[var(--border)] rounded-[4px] text-sm text-[var(--text-3)] transition-colors">
                            <Loader2 size={14} className="animate-spin" />
                            Connecting...
                        </button>
                    ) : isRecording ? (
                        <button 
                            onClick={stopRecording}
                            className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-[4px] text-sm text-red-400 hover:bg-red-500/20 transition-colors animate-pulse"
                        >
                            <Square size={14} />
                            Stop Dictating
                        </button>
                    ) : (
                        <button 
                            onClick={startRecording}
                            className="flex items-center gap-2 px-3 py-1.5 bg-[var(--void-surface)] border border-[var(--border)] rounded-[4px] text-sm text-[var(--text-2)] hover:text-[var(--text-1)] hover:border-[var(--text-3)] transition-colors"
                        >
                            <Mic size={14} className="text-[var(--plasma)]" />
                            Dictate (Deepgram)
                        </button>
                    )}
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
