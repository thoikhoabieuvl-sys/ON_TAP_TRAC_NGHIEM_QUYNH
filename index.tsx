
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("Hệ thống: Bắt đầu khởi tạo React...");

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Hệ thống: Render thành công!");
  } catch (error) {
    console.error("Lỗi khởi tạo React:", error);
    container.innerHTML = `
      <div style="padding: 40px; text-align: center; font-family: sans-serif;">
        <h1 style="color: #e11d48;">Sự cố khởi động</h1>
        <p style="color: #64748b;">Trình duyệt không thể chạy được ứng dụng AI.</p>
        <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: left; overflow: auto; max-width: 500px; margin-left: auto; margin-right: auto;">
          <code style="font-size: 12px; color: #ef4444;">${error.stack || error.message}</code>
        </div>
        <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer;">Tải lại trang</button>
      </div>
    `;
  }
} else {
  console.error("Hệ thống: Không tìm thấy thẻ #root để gắn ứng dụng.");
}
