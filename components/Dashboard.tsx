
import React from 'react';
import { AppTab } from '../types';

interface DashboardProps {
  onNavigate: (tab: AppTab) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6">
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center text-4xl mb-8">
        <i className="fas fa-rocket animate-bounce"></i>
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-4">Chào mừng bạn đến với Học Tập AI!</h1>
      <p className="text-lg text-slate-500 max-w-xl mb-10 leading-relaxed">
        Hệ thống giúp bạn ôn tập các kiến thức trắc nghiệm nhanh chóng với sự hỗ trợ giải bài từ trí tuệ nhân tạo.
      </p>
      <button
        onClick={() => onNavigate(AppTab.QUIZ_LAB)}
        className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-600/20 transition-all hover:scale-105"
      >
        Bắt đầu ôn tập ngay <i className="fas fa-arrow-right ml-2"></i>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-4xl">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 custom-shadow">
          <i className="fas fa-check-double text-blue-500 text-2xl mb-4"></i>
          <h3 className="font-bold text-slate-800 mb-2">Đa dạng câu hỏi</h3>
          <p className="text-sm text-slate-500">Đầy đủ các môn học từ Toán, Lý đến Lịch sử.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 custom-shadow">
          <i className="fas fa-brain text-purple-500 text-2xl mb-4"></i>
          <h3 className="font-bold text-slate-800 mb-2">Trợ lý AI</h3>
          <p className="text-sm text-slate-500">Giải thích chi tiết lý do tại sao đáp án đó là đúng.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 custom-shadow">
          <i className="fas fa-bolt text-amber-500 text-2xl mb-4"></i>
          <h3 className="font-bold text-slate-800 mb-2">Tốc độ cao</h3>
          <p className="text-sm text-slate-500">Giao diện mượt mà, dễ dàng sử dụng trên điện thoại.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
