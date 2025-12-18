
import React from 'react';
import { AppTab } from '../types';

interface DashboardProps {
  onNavigate: (tab: AppTab) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const cards = [
    {
      tab: AppTab.WRITER,
      title: "Deep Thought Writer",
      desc: "Experience reasoning-enhanced content creation powered by Gemini 3 Pro.",
      icon: "fa-feather",
      color: "from-blue-500 to-indigo-600"
    },
    {
      tab: AppTab.IMAGE_GEN,
      title: "Visual Synthesis",
      desc: "Transform concepts into breathtaking high-fidelity imagery instantly.",
      icon: "fa-palette",
      color: "from-purple-500 to-pink-600"
    },
    {
      tab: AppTab.VOICE,
      title: "Real-time Interaction",
      desc: "Natural voice conversations with ultra-low latency audio processing.",
      icon: "fa-comment-nodes",
      color: "from-orange-500 to-red-600"
    },
    {
      tab: AppTab.DATA_VIZ,
      title: "Data Intelligence",
      desc: "Turn raw data or unstructured text into interactive visual charts.",
      icon: "fa-chart-column",
      color: "from-emerald-500 to-teal-600"
    }
  ];

  return (
    <div className="py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Welcome to the Future of Creative AI
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl">
          Harness the power of Google's most capable models to write, design, and analyze with unprecedented precision.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <button
            key={card.tab}
            onClick={() => onNavigate(card.tab)}
            className="group relative overflow-hidden p-8 rounded-3xl glass text-left hover:scale-[1.02] transition-all duration-300"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`}></div>
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl mb-6 shadow-xl`}>
              <i className={`fas ${card.icon} text-white`}></i>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-indigo-300 transition-colors">{card.title}</h3>
            <p className="text-slate-400 mb-6">{card.desc}</p>
            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-400">
              Launch Module <i className="fas fa-arrow-right ml-1 group-hover:translate-x-1 transition-transform"></i>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
