
import React, { useState } from 'react';
import { AppTab } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Writer from './components/Writer';
import ImageGen from './components/ImageGen';
import VoiceChat from './components/VoiceChat';
import DataViz from './components/DataViz';
import QuizLab from './components/QuizLab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD: return <Dashboard onNavigate={setActiveTab} />;
      case AppTab.QUIZ_LAB: return <QuizLab />;
      case AppTab.WRITER: return <Writer />;
      case AppTab.IMAGE_GEN: return <ImageGen />;
      case AppTab.VOICE: return <VoiceChat />;
      case AppTab.DATA_VIZ: return <DataViz />;
      default: return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto relative p-4 md:p-8">
        <div className="max-w-6xl mx-auto h-full">
          {renderContent()}
        </div>
        
        {/* Background Accents */}
        <div className="fixed -top-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      </main>
    </div>
  );
};

export default App;
