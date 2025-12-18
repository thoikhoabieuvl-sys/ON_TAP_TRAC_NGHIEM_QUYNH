
import React from 'react';
import { AppTab } from '../types.ts';

interface SidebarProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  return (
    <aside className="w-full md:w-64 bg-white border-b md:border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <i className="fas fa-graduation-cap text-white text-xl"></i>
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">ÔN THI AI</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => onSelectTab(AppTab.DASHBOARD)}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
            activeTab === AppTab.DASHBOARD 
              ? 'bg-blue-50 text-blue-700 font-bold shadow-sm' 
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <i className="fas fa-home w-5"></i>
          <span>Trang chủ</span>
        </button>
        <button
          onClick={() => onSelectTab(AppTab.QUIZ_LAB)}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
            activeTab === AppTab.QUIZ_LAB 
              ? 'bg-blue-50 text-blue-700 font-bold shadow-sm' 
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <i className="fas fa-tasks w-5"></i>
          <span>Làm trắc nghiệm</span>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-100 hidden md:block">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Trạng thái</div>
          <div className="flex items-center gap-2 text-xs text-green-600 font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Hệ thống AI sẵn sàng
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
