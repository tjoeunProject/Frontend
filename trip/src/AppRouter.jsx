import React from 'react';

// 공통 컴포넌트
import Header from './components/common/Header.jsx';

import { BrowserRouter, Routes, Route } from "react-router-dom";


// 페이지 컴포넌트
import SurveyPage from './pages/survey/SurveyFirstPage.jsx';
import SurveyPage2 from './pages/survey/SurveyTwoPage.jsx';
import SurveyPage3 from './pages/survey/SurveyThreePage.jsx';
import HomePage from './pages/IntroPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import RankingPage from './pages/RankingPage.jsx';
import MyTravelPage from './pages/MyTravelPage.jsx';
import LoginPage from './pages/Login.jsx';
import SignupPage from './pages/SignupPage.jsx';
import MapPage from './map.jsx';

import { AuthProvider } from './member_ex/AuthContext.jsx';
import TestLoginPage from './member_ex/LoginPage.jsx';
import DashboardPage from './member_ex/DashboardPage.jsx';
import PrivateRoute from './member_ex/PrivateRoute.jsx';

function AppRouter() {
  return (
    <BrowserRouter>
      {/* 모든 페이지에 공통으로 표시되는 네비게이션 */}
      
      {/* 화면별 라우팅 관리 */}
      <Routes>
        {/* 소개 (메인 화면) */}
        <Route path="/" element={<HomePage />} />

        <Route path="/history" element={<HistoryPage/>}/>

        <Route path="/ranking" element={<RankingPage/>}/>

        <Route path="/mytravel" element={<MyTravelPage/>}/>

        <Route path="/map" element={<MapPage />} />
        
        <Route path="/survey/SurveyFirstPage" element={<SurveyPage />} />

        <Route path="/survey/SurveyTwoPage" element={<SurveyPage2 />} />

        <Route path="/survey/SurveyThreePage" element={<SurveyPage3 />} />

        <Route path="/login" element={<LoginPage />}/>

        <Route path="/signup" element={<SignupPage />}/>

        {/* 404 페이지 (선택 사항) */}
        <Route path="*" element={<div>404 Not Found</div>}/>
      </Routes>
      {/* Footer 등 기타 공통 컴포넌트 */}

      <AuthProvider> {/* 2. 그 안에서 인증 관리자가 동작합니다 */}
        
        <Routes>
          <Route path="/login1" element={<TestLoginPage />} />
          
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<DashboardPage />} />
          </Route>
        </Routes>

      </AuthProvider>
    </BrowserRouter>

    
  );
}

export default AppRouter;