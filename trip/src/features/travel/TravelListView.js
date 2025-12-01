import React from 'react';
import { useTravelListViewModel } from './TravelViewModel';

function TravelListView() {
  // **View는 ViewModel을 사용하여 데이터와 로직을 주입받습니다.**
  const { travels, loading } = useTravelListViewModel(); 

  if (loading) {
    return <div>로딩 중...</div>;
  }
  
  return (
    <div>
      <h3>나의 저장된 여행 목록</h3>
      <ul>
        {travels.map(travel => (
          <li key={travel.id}>{travel.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default TravelListView;