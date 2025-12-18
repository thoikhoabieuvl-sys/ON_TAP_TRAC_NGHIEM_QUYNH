
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

/**
 * Điểm khởi đầu của ứng dụng
 */
const startApp = () => {
  const container = document.getElementById('root');
  if (!container) return;

  const root = createRoot(container);
  
  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Critical Render Error:", error);
    container.innerHTML = `
      <div style="padding: 40px; text-align: center; font-family: sans-serif;">
        <h2 style="color: #ef4444;">Đã xảy ra lỗi khởi động ứng dụng</h2>
        <p style="color: #64748b;">Vui lòng kiểm tra console hoặc làm mới trang.</p>
        <button onclick="location.reload()" style="background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">
          Tải lại trang
        </button>
      </div>
    `;
  }
};

// Đảm bảo DOM đã sẵn sàng
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
