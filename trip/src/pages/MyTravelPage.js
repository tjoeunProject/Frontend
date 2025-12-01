import React from 'react';
import Header from '../components/common/Header';
import { Routes, Route } from 'react-router-dom';

// 하위 View 컴포넌트 (예시)
// import TravelListView from '../features/travel/TravelListView';
// import TravelDetailView from '../features/travel/TravelDetailView';

function MyTravelPage() {
  // 이 페이지는 일반적으로 로그인 여부를 체크하는 로직(ViewModel)을 가집니다.
  
  return (
    <div style={{ padding: '20px' }}>
      <Header />
      <h1>✈️ 나의 여행지 페이지</h1>
      <p>회원님의 저장된 여행 계획, 관심 목록 등을 관리합니다.</p>
      
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
      <p style={{ marginTop: '20px', color: 'gray' }}>
        (위 Routes에 의해 실제 내용이 렌더링됩니다.)
      </p>
    </div>
  );
}

export default MyTravelPage;