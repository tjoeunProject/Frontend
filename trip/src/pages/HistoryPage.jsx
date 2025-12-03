import React from 'react';
import Header from '../components/common/Header';
import '../resources/css/HistoryPage.css'; 
// import { useHistoryViewModel } from '../features/history/HistoryViewModel';

function HistoryPage() {
  // const { records, loading } = useHistoryViewModel();
  
  return (
    <>
      <Header />
      {/* 중앙 정렬 컨테이너 적용 */}
      <div className="main-content-wrapper history-page"></div>
      <div className="page-centered-container" style={{ padding: '20px 0' }}> 
        <div className="history-header">
          <h1>📜 히스토리 페이지</h1>
          <p>사용자의 과거 여행 기록 또는 서비스 이용 기록을 보여줍니다.</p>
        </div>
        
        {/* 히스토리 목록이 렌더링될 영역 */}
        <div className="history-list-container">
          <p>히스토리 데이터 목록...</p>
          {/* {loading ? <p>로딩 중...</p> : <ul>{records.map(...)}</ul>} */}
        </div>
      </div>
      </>
  );
}

export default HistoryPage;