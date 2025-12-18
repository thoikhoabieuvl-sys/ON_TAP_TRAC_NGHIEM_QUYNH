
import React from 'react';
import { AppTab } from '../types';

interface SidebarProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const menuItems = [
    { id: AppTab.DASHBOARD, label: 'Bảng Điều Khiển', icon: 'fa-house' },
    { id: AppTab.QUIZ_LAB, label: 'Phòng Ôn Tập', icon: 'fa-graduation-cap' },
    { id: AppTab.WRITER, label: 'Trợ Lý Sáng Tác', icon: 'fa-pen-nib' },
    { id: AppTab.IMAGE_GEN, label: 'Tạo Hình Ảnh', icon: 'fa-wand-magic-sparkles' },
    { id: AppTab.VOICE, label: 'Trợ Lý Giọng Nói', icon: 'fa-microphone' },
    { id: AppTab.DATA_VIZ, label: 'Phân Tích Dữ Liệu', icon: 'fa-chart-pie' },
  ];

  return (
    <aside className="w-20 md:w-64 h-full glass border-r border-slate-800 flex flex-col transition-all z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <i className="fas fa-bolt text-white"></i>
        </div>
        <span className="font-bold text-xl hidden md:block tracking-tight">Aether AI</span>
      </div>

      <nav className="flex-1 mt-6 px-3 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <i className={`fas ${item.icon} w-6 text-center text-lg`}></i>
            <span className="font-medium hidden md:block">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <div className="hidden md:block p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Trạng thái AI</p>
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Gemini 3 Pro Sẵn Sàng
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
