import React from 'react';

// 공통 컴포넌트
import Header from './components/common/Header.jsx';

import { BrowserRouter, Routes, Route } from "react-router-dom";


// 페이지 컴포넌트
import SurveyPage from './pages/survey/SurveyFirstPage.jsx';
import SurveyPage2 from './pages/survey/SurveyTwoPage.jsx';
import SurveyPage3 from './pages/survey/SurveyThreePage.jsx';
import HomePage from './pages/IntroPage.jsx';
import MapPage from './map.jsx';

function AppRouter() {
  return (
    <BrowserRouter>
      {/* 모든 페이지에 공통으로 표시되는 네비게이션 */}
      
      {/* 화면별 라우팅 관리 */}
      <Routes>
        {/* 소개 (메인 화면) */}
        <Route path="/home" element={<HomePage />} />

        <Route path="/map" element={<MapPage />} />
        
        <Route path="/survey/SurveyFirstPage" element={<SurveyPage />} />

        <Route path="/survey/SurveyTwoPage" element={<SurveyPage2 />} />

        <Route path="/survey/SurveyThreePage" element={<SurveyPage3 />} />

        {/* 404 페이지 (선택 사항) */}
        <Route path="*" element={<div>404 Not Found</div>}/>
      </Routes>
      {/* Footer 등 기타 공통 컴포넌트 */}
    </BrowserRouter>
  );
}

export default AppRouter;