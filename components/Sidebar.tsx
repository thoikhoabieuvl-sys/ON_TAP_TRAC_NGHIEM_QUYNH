
import React from 'react';
import { AppTab } from '../types';

interface SidebarProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <i className="fas fa-book-open text-white"></i>
          </div>
          <span className="font-bold text-xl tracking-tight text-emerald-900">Học Tập AI</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => onSelectTab(AppTab.DASHBOARD)}
          className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
            activeTab === AppTab.DASHBOARD 
              ? 'bg-emerald-50 text-emerald-700 font-bold' 
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <i className="fas fa-home w-5"></i>
          <span>Trang Chủ</span>
        </button>
        <button
          onClick={() => onSelectTab(AppTab.QUIZ_LAB)}
          className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
            activeTab === AppTab.QUIZ_LAB 
              ? 'bg-emerald-50 text-emerald-700 font-bold' 
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <i className="fas fa-graduation-cap w-5"></i>
          <span>Ôn Tập</span>
        </button>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-400 font-bold uppercase mb-2">Trạng thái hệ thống</p>
          <div className="flex items-center gap-2 text-xs text-emerald-600">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            AI Sẵn Sàng Trợ Giúp
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
