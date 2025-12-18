
import React, { useState } from 'react';
import { AppTab } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import QuizLab from './components/QuizLab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD: return <Dashboard onNavigate={setActiveTab} />;
      case AppTab.QUIZ_LAB: return <QuizLab />;
      default: return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
