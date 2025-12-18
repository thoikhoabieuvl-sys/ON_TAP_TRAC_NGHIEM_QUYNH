
import React from 'react';
import { AppTab } from '../types';

interface DashboardProps {
  onNavigate: (tab: AppTab) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="py-10 animate-in fade-in duration-700">
      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100 mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
          Cùng AI ôn thi hiệu quả hơn 🚀
        </h1>
        <p className="text-lg text-slate-500 mb-8 max-w-2xl">
          Chào mừng bạn! Hãy chọn môn học bạn muốn ôn tập. AI của chúng tôi sẽ giúp bạn giải thích từng câu hỏi nếu bạn gặp khó khăn.
        </p>
        <button
          onClick={() => onNavigate(AppTab.QUIZ_LAB)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-100"
        >
          Bắt đầu ôn tập ngay
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-4 text-xl">
            <i className="fas fa-lightbulb"></i>
          </div>
          <h3 className="font-bold text-lg mb-2">Giải thích thông minh</h3>
          <p className="text-slate-500 text-sm">Nếu chọn sai, hãy nhấn "Hỏi AI" để biết lý do tại sao và học hỏi thêm.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4 text-xl">
            <i className="fas fa-mobile-screen"></i>
          </div>
          <h3 className="font-bold text-lg mb-2">Mọi lúc, mọi nơi</h3>
          <p className="text-slate-500 text-sm">Giao diện được tối ưu cho cả điện thoại và máy tính bảng.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
