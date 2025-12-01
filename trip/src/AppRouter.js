import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 공통 컴포넌트
import Header from './components/common/Header';

// 페이지 컴포넌트
import HomePage from './pages/IntroPage';   
import HistoryPage from './pages/HistoryPage';
import RankingPage from './pages/RankingPage';
import MyTravelPage from './pages/MyTravelPage';

function AppRouter() {
  return (
    <BrowserRouter>
      {/* 모든 페이지에 공통으로 표시되는 네비게이션 */}
      
      {/* 화면별 라우팅 관리 */}
      <Routes>
        {/* 소개 (메인 화면) */}
        <Route path="/" element={<HomePage />} />
        
        {/* 히스토리 */}
        <Route path="/history" element={<HistoryPage />} />
        
        {/* 랭킹 */}
        <Route path="/ranking" element={<RankingPage />} />
        
        {/* 나의 여행지 (로그인이 필요한 경우 보호된 라우팅 처리 필요) */}
        {/* 이 경로 아래에 세부 기능 화면 라우팅을 중첩(Nested Routing)할 수 있음. */}
        <Route path="/mytravel" element={<MyTravelPage />} /> 

    
        
        {/* 404 페이지 (선택 사항) */}
        <Route path="*" element={<div>404 Not Found</div>}/>
      </Routes>

      {/* Footer 등 기타 공통 컴포넌트 */}
    </BrowserRouter>
  );
}

export default AppRouter;