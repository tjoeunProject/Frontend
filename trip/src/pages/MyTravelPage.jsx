import Header from '../components/common/Header';
import { Routes, Route } from 'react-router-dom';
// 경로 오류 수정
import '../resources/css/MyTravelPage.css'; 

// 하위 View 컴포넌트 (예시)
// import TravelListView from '../features/travel/TravelListView';
// import TravelDetailView from '../features/travel/TravelDetailView';

function MyTravelPage() {
  // 이 페이지는 일반적으로 로그인 여부를 체크하는 로직(ViewModel)을 가집니다.
  
  return (
    <>
      <Header />
      {/* 중앙 정렬 컨테이너 적용 */}
      <div className="main-content-wrapper mytravel-page">
        <div className="page-centered-container" style={{ padding: '20px 0' }}> 
        <div className="mytravel-header">
            <h1>✈️ 나의 여행지 페이지</h1>
            <p>회원님의 저장된 여행 계획, 관심 목록 등을 관리합니다.</p>
        </div>
        
        <div className="mytravel-content-area">
          {/* Nested Route (중첩 라우팅) 영역 
            /mytravel 경로로 오면 TravelListView가 기본으로 렌더링되고,
            /mytravel/123 으로 오면 TravelDetailView가 렌더링됩니다.
          */}
          <Routes>
            {/* /mytravel (기본) */}
            {/*<Route index element={<TravelListView />} /> */}
            
            {/* /mytravel/:id (상세 보기) */}
            {/*Route path=":id" element={<TravelDetailView />} */}
          </Routes>
          
          {/* 실제 하위 View 컴포넌트의 내용은 이 아래에 렌더링됩니다. */}
          <p className="mytravel-placeholder">
            (위 Routes에 의해 실제 내용이 렌더링됩니다.)
          </p>
        </div>
      </div>
      </div>
      </>
  );
}

export default MyTravelPage;