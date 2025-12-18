
import React, { useState, useRef, useEffect } from 'react';
import { generateThoughtfulResponse } from '../services/geminiService';

const Writer: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      const response = await generateThoughtfulResponse(userMsg, history);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "I encountered an error processing your request. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full py-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold">Deep Thought Writer</h2>
          <p className="text-slate-400 text-sm">Powered by Gemini 3 Pro Reasoning Engine</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 text-xs font-bold">
          <i className="fas fa-brain"></i> THINKING ACTIVE
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 glass rounded-3xl p-6 overflow-y-auto mb-6 space-y-6"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
            <i className="fas fa-pen-nib text-6xl mb-4"></i>
            <p className="text-xl">How can I help you write today?</p>
            <p className="text-sm max-w-sm">Try asking for a complex analysis, a creative story, or a code architectural review.</p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'bg-slate-800 text-slate-100 border border-slate-700'
            }`}>
              <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative group">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Enter your prompt here..."
          className="w-full glass bg-slate-900/50 rounded-2xl p-4 pr-16 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all duration-300 min-h-[100px]"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="absolute right-4 bottom-4 w-10 h-10 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors shadow-lg"
        >
          <i className="fas fa-paper-plane text-white"></i>
        </button>
      </div>
    </div>
  );
};

export default Writer;
