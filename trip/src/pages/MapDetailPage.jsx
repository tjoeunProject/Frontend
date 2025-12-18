// MapDetailPage.jsx
import React from 'react';
import { Map, Marker, APIProvider } from '@vis.gl/react-google-maps';
import MapRecenter from '../components/MapRecenter';
import ItineraryListOptimized from '../components/ItineraryListOptimized';
import DirectionsPolyline from '../components/DirectionsPolyline';
import './MapPage.css';
import { useNavigate } from "react-router-dom";

// 12.17 수정
import Button from 'react-bootstrap/Button';

const CUSTOM_COLOR = "#6C5CE7";

const MapDetailPage = ({
  scheduleData,
  itineraryByDay,
  mapCenter,
  DAY_COLORS,
  API_KEY,
}) => {
  
  const navigate = useNavigate();
  const dayKeys = Object.keys(itineraryByDay).sort();

  return (
    <APIProvider apiKey={API_KEY} libraries={["places"]}>
      <div className="mappage-container">
        
        {/* ===== 왼쪽 사이드바: 일정 목록만 표시 ===== */}
        <div className="sidebar">
          <div className="sidebar-header" style={{ 
  padding: '20px', 
  borderBottom: '1px solid #d4d4d4', 
  fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif" // 👈 깔끔한 글꼴 지정
}}>
  {/* 제목 영역: 더 굵고 꽉 찬 느낌으로 */}
  <div style={{ 
    fontSize: '28px',      
    fontWeight: '800',    // 아주 두껍게
    color: '#1a1a1a', 
    letterSpacing: '-0.5px', // 자간을 좁혀서 세련되게
    marginTop : '10px',
    marginBottom: '10px'   
  }}>
    {scheduleData?.title || "여행 일정"}
  </div>

  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    marginTop : '25px', // 간격을 살짝 더 벌림
    alignItems: 'center'
  }}>
    {/* 왼쪽 영역: 항목 이름을 옅게, 데이터를 진하게 */}
    <div style={{ fontSize : '14px', lineHeight: '1.8' }}>
      <div style={{ color: '#666' }}>
        총 이동 경로 <span style={{ color: '#333', fontWeight: '600', marginLeft: '8px' }}>12.5km</span>
      </div>
      <div style={{ color: '#666' }}>
        총 이동 시간 <span style={{ color: '#333', fontWeight: '600', marginLeft: '8px'}}>2시간 30분</span>
      </div>
    </div>

    {/* 오른쪽 영역: 날짜를 살짝 흐리지만 정갈하게 */}
    <div style={{ 
      display: 'flex',
      fontSize: '14px', 
      color: '#888', 
      fontWeight: '500',
      letterSpacing: '0px',
      alignItems : 'center'
    }}>
      {scheduleData?.startDate} ~ {scheduleData?.endDate}
    </div>
  </div>
</div>

          <div className="itinerary-tab" style={{ flex: 1, overflow: 'auto' }}>
            <ItineraryListOptimized
              itineraryByDay={itineraryByDay}
              setItineraryByDay={() => {}} // 읽기 전용이라 빈 함수 전달
              removeFromItinerary={() => {}} // 삭제 불가
              DAY_COLORS={DAY_COLORS}
              isToggleOptimized={true} // 항상 최적화(보기) 모드
            />
          </div>
          <Button className="btn-optimize" style={{ backgroundColor: CUSTOM_COLOR, borderColor: CUSTOM_COLOR, fontWeight: 'bold' }}
          onClick={() => {
    // /map으로 이동하면서 현재 페이지의 데이터를 들고 가고 싶다면 state에 담아 보냅니다.
    navigate('/map', { 
      // state: { 
      //   schedule: {
      //     title: item.title,
      //     startDate: item.date,
      //     endDate: item.time,
      //     routeId: item.routeId 
      // }
      // } 
    });
  }}  >
                    수정하기
                  </Button>
        </div>

        {/* ===== 오른쪽 지도 ===== */}
        <div className="map-container">
          <Map
            defaultCenter={mapCenter} // 초기 중심값
            defaultZoom={13}
            gestureHandling="greedy"
            disableDefaultUI={false}
          >
            {/* 지도 중심 강제 이동 컴포넌트 */}
            <MapRecenter center={mapCenter} />

            {/* 일정 마커 및 경로 표시 */}
            {dayKeys.map((dayKey, dayIndex) => {
                const dayPlaces = itineraryByDay[dayKey] || [];
                if (dayPlaces.length === 0) return null;

                return (
                  <React.Fragment key={dayKey}>
                    {/* A. 마커 표시 */}
                    {dayPlaces.map((place, idx) => (
                      <Marker
                        key={`marker-${place.id}-${dayIndex}-${idx}`}
                        position={{ lat: place.lat, lng: place.lng }}
                        label={{
                          text: `${dayIndex + 1}-${idx + 1}`, 
                          color: "#fff",
                          fontSize: "11px",
                          fontWeight: "bold",
                        }}
                      />
                    ))}

                    {/* B. 경로 그리기 */}
                    {dayPlaces.map((place, idx) => {
                      if (idx === dayPlaces.length - 1) return null; 
                      return (
                        <DirectionsPolyline
                          key={`route-${dayKey}-${idx}`}
                          origin={{ lat: dayPlaces[idx].lat, lng: dayPlaces[idx].lng }}
                          destination={{ lat: dayPlaces[idx + 1].lat, lng: dayPlaces[idx + 1].lng }}
                          color={DAY_COLORS[dayIndex % DAY_COLORS.length]}
                        />
                      );
                    })}
                  </React.Fragment>
                );
              })}
          </Map>
        </div>
      </div>
    </APIProvider>
  );
};

export default MapDetailPage;