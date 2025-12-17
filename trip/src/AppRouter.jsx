import { BrowserRouter, Routes, Route } from "react-router-dom";

// 페이지 컴포넌트
import SurveyPage from './pages/survey/SurveyFirstPage.jsx';
import SurveyPage2 from './pages/survey/SurveyTwoPage.jsx';
import SurveyPage3 from './pages/survey/SurveyThreePage.jsx';
import SurveyPage4 from './pages/survey/SurveyFourPage.jsx';
import HomePage from './pages/Intro/IntroPage.jsx';
import HistoryPage from './pages/History/HistoryPage.jsx';
import RankingPage from './pages/Ranking/RankingPage.jsx';
import MyTravelPage from './pages/MyTravelPage.jsx';
import LoginPage from './pages/Login/LoginPage.jsx';
import SignupPage from './pages/SignUp/SignupPage.jsx';
import MapPage from './map.jsx';
import MapDetailPage from './mapdetail.jsx';
//
import TestConnection from './TestConnection.jsx';
import TestPage from './pages/Route/Test-api.jsx';

import PrivateRoute from './pages/Login/PrivateRoute.jsx';
import DashboardPage from './pages/Login/DashboardPage.jsx';


function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/ranking" element={<RankingPage />} />
      <Route path="/mytravel" element={<MyTravelPage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/map/:routeId" element={<MapPage />} />

      <Route path="/survey/SurveyFirstPage" element={<SurveyPage />} />
      <Route path="/survey/SurveyTwoPage" element={<SurveyPage2 />} />
      <Route path="/survey/SurveyThreePage" element={<SurveyPage3 />} />
      <Route path="/survey/SurveyFourPage" element={<SurveyPage4 />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/mapdetail/:id" element={<MapDetailPage />} />

      <Route path="/test-spring" element={<TestConnection />} />
      <Route path="/test-page" element={<TestPage/>} />

      {/* 인증 필요 페이지 */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default AppRouter;