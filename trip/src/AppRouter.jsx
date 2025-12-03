import { BrowserRouter, Routes, Route } from "react-router-dom";

// 페이지 컴포넌트
import SurveyPage from './pages/survey/SurveyFirstPage.jsx';
import SurveyPage2 from './pages/survey/SurveyTwoPage.jsx';
import SurveyPage3 from './pages/survey/SurveyThreePage.jsx';
import HomePage from './pages/Intro/IntroPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import RankingPage from './pages/RankingPage.jsx';
import MyTravelPage from './pages/MyTravelPage.jsx';
import LoginPage from './pages/Login/Login.jsx';
import SignupPage from './pages/SignUp/SignupPage.jsx';
import MapPage from './map.jsx';

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
    </BrowserRouter>
  );
}

export default AppRouter;