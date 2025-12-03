import React from 'react';
import Header from '../components/common/Header';
// 경로 오류 수정
import '../resources/css/RankingPage.css'; 

// import { useRankingViewModel } from '../features/ranking/RankingViewModel';

function RankingPage() {
  // const { topTravels, loading } = useRankingViewModel();
  
  return (
      <div>
        <Header />
        {/* 중앙 정렬 컨테이너 적용 */}
        <div className="main-content-wrapper ranking-page">
        <div className="page-centered-container" style={{ padding: '20px 0' }}> 
            <div className="ranking-header">
                <h1>🏆 랭킹 페이지</h1>
                <p>Top10 관광지</p>
            </div>

            {/* 랭킹 목록이 렌더링될 영역 */}
            <div className="ranking-list-container">
                <p>실시간 랭킹 차트/목록...</p>
            </div>
        </div>
    </div>
    </div>
    
  );
}

export default RankingPage;