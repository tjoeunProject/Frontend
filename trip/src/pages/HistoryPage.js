import React from 'react';
import Header from '../components/common/Header';
// import { useHistoryViewModel } from '../features/history/HistoryViewModel';

function HistoryPage() {
  // const { records, loading } = useHistoryViewModel();
  
  return (
    <div style={{ padding: '20px' }}>
        <Header />
      <h1>📜 히스토리 페이지</h1>
      <p>사용자의 과거 여행 기록 또는 서비스 이용 기록을 보여줍니다.</p>
      
      {/* 히스토리 목록이 렌더링될 영역 */}
      <div style={{ border: '1px solid #ccc', padding: '15px', marginTop: '20px' }}>
        <p>히스토리 데이터 목록...</p>
        {/* {loading ? <p>로딩 중...</p> : <ul>{records.map(...)}</ul>} */}
      </div>
      
    </div>
    
  );
}

export default HistoryPage;