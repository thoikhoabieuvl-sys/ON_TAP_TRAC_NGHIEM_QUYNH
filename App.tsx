
import React, { useState } from 'react';
import { AppTab } from './types.ts';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import QuizLab from './components/QuizLab.tsx';
import Writer from './components/Writer.tsx';
import ImageGen from './components/ImageGen.tsx';
import DataViz from './components/DataViz.tsx';
import VoiceChat from './components/VoiceChat.tsx';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD: return <Dashboard onNavigate={setActiveTab} />;
      case AppTab.QUIZ_LAB: return <QuizLab />;
      case AppTab.WRITER: return <Writer />;
      case AppTab.IMAGE_GEN: return <ImageGen />;
      case AppTab.DATA_VIZ: return <DataViz />;
      case AppTab.VOICE: return <VoiceChat />;
      default: return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8fafc]">
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
