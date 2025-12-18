
import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-[2rem] p-8 text-center border border-slate-100">
        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
          <i className="fas fa-check text-white text-3xl"></i>
        </div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">GitHub OK! 🚀</h1>
        <p className="text-slate-500 mb-8">Nếu bạn thấy trang này, nghĩa là GitHub Pages đã hoạt động chính xác.</p>
        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all"
        >
          Làm mới trang
        </button>
        <p className="mt-6 text-xs text-slate-400 font-medium uppercase tracking-widest">Version 1.0.0 - Stable</p>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
