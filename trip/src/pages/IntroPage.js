import React from 'react';
import Header from '../components/common/Header';

function IntroPage() {
  return (
    <div style={{ padding: '20px' }}>
        <Header />
      <h1>🌍 소개 페이지</h1>
      <p>여행 서비스의 비전과 주요 기능을 소개합니다.</p>
      {/* 여기에 소개 페이지의 실제 UI와 MVVM View 로직이 들어갑니다. */}
    </div>
  );
}

export default IntroPage;