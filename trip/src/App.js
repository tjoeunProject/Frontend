// src/App.js

import React from 'react';
import './App.css'; // 필요하다면 App 전역에 적용할 CSS를 임포트합니다.
import AppRouter from './AppRouter';

function App() {
  return (
    <div className="App">
      {/* 앱의 모든 라우팅 로직(Header 포함)은 Router 컴포넌트 안에 정의되어 있습니다.
        App 컴포넌트는 Router를 감싸는 단순한 Wrapper 역할을 수행합니다.
      */}
      <AppRouter /> 
    
    </div>
  );
}

export default App;