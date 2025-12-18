
import React from 'react';
import { AppTab } from '../types.ts';

interface DashboardProps {
  onNavigate: (tab: AppTab) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="py-6 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-blue-200/50 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            Ôn tập thông minh <br/>cùng trợ lý AI 🚀
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-xl opacity-90 leading-relaxed">
            Học tập không còn khô khan. AI sẽ giúp bạn giải thích từng câu hỏi, giúp bạn hiểu sâu kiến thức thay vì chỉ học vẹt.
          </p>
          <button
            onClick={() => onNavigate(AppTab.QUIZ_LAB)}
            className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-lg hover:scale-105 active:scale-95"
          >
            Bắt đầu ôn tập ngay
          </button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-blue-400/20 rounded-full blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:rotate-12 transition-transform">
            <i className="fas fa-brain"></i>
          </div>
          <h3 className="font-bold text-xl text-slate-800 mb-3 tracking-tight">Giải thích chuyên sâu</h3>
          <p className="text-slate-500 leading-relaxed">
            Khi chọn sai, AI sẽ phân tích tại sao đáp án đó chưa chính xác và gợi ý cách tư duy đúng.
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:-rotate-12 transition-transform">
            <i className="fas fa-bolt"></i>
          </div>
          <h3 className="font-bold text-xl text-slate-800 mb-3 tracking-tight">Tiết kiệm thời gian</h3>
          <p className="text-slate-500 leading-relaxed">
            Học đúng trọng tâm, tập trung vào những mảng kiến thức bạn còn yếu thông qua các câu hỏi trắc nghiệm.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
