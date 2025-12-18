
import React, { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { encode, decode, decodeAudioData } from '../services/geminiService';

const VoiceChat: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState('Idle');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
    setIsActive(false);
    setStatus('Disconnected');
  }, []);

  const startSession = async () => {
    setIsConnecting(true);
    setStatus('Connecting...');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      }
      if (!outputAudioContextRef.current) {
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
            
            setIsConnecting(false);
            setIsActive(true);
            setStatus('Listening...');
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              setStatus('Speaking...');
              const ctx = outputAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setStatus('Listening...');
              });
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
            
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Live Error:', e);
            stopSession();
          },
          onclose: () => {
            stopSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          systemInstruction: 'You are Aether, a smooth and intelligent AI creative companion. Respond naturally and helpfully via voice.'
        }
      });
      
      sessionRef.current = await sessionPromise;
      
    } catch (err) {
      console.error(err);
      setStatus('Failed to connect');
      setIsConnecting(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="max-w-md w-full text-center space-y-12">
        <header>
          <h2 className="text-3xl font-bold mb-2">Live Assistant</h2>
          <p className="text-slate-400">Experience seamless voice conversation with near-zero latency.</p>
        </header>

        <div className="relative flex items-center justify-center">
          {/* Visualizer Placeholder */}
          <div className="absolute w-64 h-64 border-2 border-indigo-500/20 rounded-full"></div>
          <div className={`absolute w-48 h-48 border-2 border-indigo-500/40 rounded-full transition-transform duration-1000 ${isActive ? 'animate-ping' : ''}`}></div>
          
          <button
            onClick={isActive ? stopSession : startSession}
            disabled={isConnecting}
            className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center text-4xl shadow-2xl transition-all duration-500 ${
              isActive 
                ? 'bg-red-500 hover:bg-red-400 scale-110' 
                : 'bg-indigo-600 hover:bg-indigo-500'
            } ${isConnecting ? 'opacity-50 cursor-wait' : ''}`}
          >
            <i className={`fas ${isActive ? 'fa-stop' : 'fa-microphone'}`}></i>
          </button>
        </div>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full border border-slate-700">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></div>
            <span className="text-sm font-medium text-slate-300">{status}</span>
          </div>
          <p className="text-xs text-slate-500">Make sure your microphone is connected and your sound is on.</p>
        </div>

        <div className="glass p-6 rounded-2xl text-left border border-slate-800">
          <h4 className="text-sm font-bold text-indigo-400 mb-2">PRO TIPS</h4>
          <ul className="text-xs text-slate-400 space-y-2">
            <li>• Talk naturally, just like with a human friend.</li>
            <li>• You can interrupt Aether by speaking.</li>
            <li>• Use headphones for the best echo-free experience.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;
