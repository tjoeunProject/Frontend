import React from 'react';
import Header from '../components/common/Header';

// import { useRankingViewModel } from '../features/ranking/RankingViewModel';

function RankingPage() {
  // const { topTravels, loading } = useRankingViewModel();
  
  return (
    <div style={{ padding: '20px' }}>
        <Header />
      <h1>🏆 랭킹 페이지</h1>
      <p>Top10 관광지</p>

      {/* 랭킹 목록이 렌더링될 영역 */}
      <div style={{ border: '1px solid #ccc', padding: '15px', marginTop: '20px' }}>
        <p>실시간 랭킹 차트/목록...</p>
      </div>
    </div>
  );
}

export default RankingPage;