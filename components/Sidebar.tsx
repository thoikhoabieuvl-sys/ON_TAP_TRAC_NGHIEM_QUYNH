
import React from 'react';
import { AppTab } from '../types.ts';

interface SidebarProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const menuItems = [
    { id: AppTab.DASHBOARD, label: 'Trang chủ', icon: 'fa-home' },
    { id: AppTab.QUIZ_LAB, label: 'Ôn tập trắc nghiệm', icon: 'fa-tasks' },
    { id: AppTab.WRITER, label: 'Soạn thảo thông minh', icon: 'fa-pen-fancy' },
    { id: AppTab.IMAGE_GEN, label: 'Sáng tạo hình ảnh', icon: 'fa-wand-sparkles' },
    { id: AppTab.DATA_VIZ, label: 'Phân tích dữ liệu', icon: 'fa-chart-pie' },
    { id: AppTab.VOICE, label: 'Giao tiếp giọng nói', icon: 'fa-microphone' },
  ];

  return (
    <aside className="w-full md:w-72 bg-white border-b md:border-r border-slate-200 flex flex-col shrink-0 z-20">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <i className="fas fa-brain text-white text-lg"></i>
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-800 leading-none">AI TUTOR</h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">Smart Learning</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-100' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
            }`}
          >
            <i className={`fas ${item.icon} w-5 text-center ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`}></i>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center gap-2 text-[11px] text-green-600 font-bold mb-1">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            AI ONLINE
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">Gemini 3.0 Engine đang hoạt động tối ưu.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
