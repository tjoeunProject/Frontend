import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // App.js 컴포넌트를 임포트합니다.
import './index.css'; // 전체 페이지에 적용될 기본 스타일 임포트

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 최종적으로 App 컴포넌트를 렌더링 */}
    <App /> 
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

