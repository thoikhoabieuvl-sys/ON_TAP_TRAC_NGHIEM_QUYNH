
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Rendering Error:", error);
    container.innerHTML = `<div style="padding: 20px; text-align: center;">
      <h2>Đã xảy ra lỗi khi tải ứng dụng</h2>
      <p>Vui lòng làm mới trang (F5) hoặc kiểm tra bảng điều khiển console.</p>
    </div>`;
  }
}
