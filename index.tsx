
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const container = document.getElementById('root');
if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Lỗi khởi chạy ứng dụng:", error);
    container.innerHTML = `
      <div style="padding: 40px; text-align: center; font-family: sans-serif;">
        <h1 style="color: #e11d48;">Hệ thống gặp sự cố</h1>
        <p style="color: #64748b;">Vui lòng nhấn F12 để xem chi tiết lỗi trong Console.</p>
        <code style="background: #f1f5f9; padding: 10px; display: block; margin-top: 20px;">${error.message}</code>
      </div>
    `;
  }
}
