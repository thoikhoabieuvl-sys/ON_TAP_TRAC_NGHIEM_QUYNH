
import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '450px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '30px',
        padding: '40px',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', marginBottom: '10px' }}>
          GITHUB ĐÃ HIỆN THỊ!
        </h1>
        <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
          Cấu trúc tệp của bạn hiện đã đúng. <br/>
          Nếu bạn thấy thông báo này, chúng ta đã sẵn sàng để đưa toàn bộ tính năng trắc nghiệm quay trở lại.
        </p>
        <button 
          onClick={() => window.location.reload()}
          style={{ 
            width: '100%',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '16px',
            borderRadius: '16px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
        >
          Làm mới để kiểm tra lại
        </button>
        <div style={{ marginTop: '20px', fontSize: '10px', color: '#cbd5e1', letterSpacing: '2px' }}>
          BUILD STATUS: SUCCESSFUL
        </div>
      </div>
    </div>
  );
};

// Khởi tạo an toàn
const container = document.getElementById('root');
if (container) {
  try {
    const root = createRoot(container);
    root.render(<App />);
  } catch (err) {
    container.innerHTML = `<div style="padding: 20px; color: red;">Lỗi Render: ${err.message}</div>`;
  }
}
