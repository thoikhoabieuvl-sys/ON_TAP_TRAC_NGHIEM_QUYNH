
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';

const ImageGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<{ url: string, prompt: string }[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    
    setLoading(true);
    try {
      const url = await generateImage(prompt);
      setImages(prev => [{ url, prompt }, ...prev]);
    } catch (error) {
      console.error(error);
      alert("Failed to generate image. Please try a different prompt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4 animate-in fade-in duration-500 h-full flex flex-col">
      <header className="mb-8">
        <h2 className="text-3xl font-bold">Image Forge</h2>
        <p className="text-slate-400">Bring your imagination to life with high-fidelity visual synthesis.</p>
      </header>

      <div className="glass rounded-3xl p-6 mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A majestic nebula forming the shape of a phoenix, 8k, cinematic lighting..."
          className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
        />
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || loading}
          className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/20"
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Forging...
            </>
          ) : (
            <>
              <i className="fas fa-wand-sparkles"></i>
              Generate
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        {images.length === 0 && !loading && (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-600">
            <i className="fas fa-images text-5xl mb-4"></i>
            <p>Your generated masterpieces will appear here</p>
          </div>
        )}

        {loading && images.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-square glass rounded-3xl animate-pulse flex items-center justify-center">
              <div className="text-center text-purple-400">
                <i className="fas fa-sparkles text-4xl mb-2"></i>
                <p className="text-sm font-medium">Visualizing...</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, i) => (
            <div key={i} className="group relative glass rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-all duration-300">
              <img src={img.url} alt={img.prompt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                <p className="text-sm text-slate-200 line-clamp-2 italic mb-3">"{img.prompt}"</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.open(img.url, '_blank')}
                    className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 py-2 rounded-lg text-xs font-bold transition-all"
                  >
                    View Original
                  </button>
                  <a 
                    href={img.url} 
                    download={`aether-ai-${i}.png`}
                    className="w-10 h-10 bg-purple-500 flex items-center justify-center rounded-lg hover:bg-purple-400 transition-colors"
                  >
                    <i className="fas fa-download text-white"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGen;
