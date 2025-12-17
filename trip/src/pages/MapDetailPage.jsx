// MapDetailPage.jsx
import React from 'react';
import { Map, Marker, APIProvider } from '@vis.gl/react-google-maps';
import MapRecenter from '../components/MapRecenter';
import ItineraryListOptimized from '../components/ItineraryListOptimized';
import DirectionsPolyline from '../components/DirectionsPolyline';
import './MapPage.css';

const MapDetailPage = ({
  scheduleData,
  itineraryByDay,
  mapCenter,
  DAY_COLORS,
  API_KEY,
}) => {
  
  const dayKeys = Object.keys(itineraryByDay).sort();

  return (
    <APIProvider apiKey={API_KEY} libraries={["places"]}>
      <div className="mappage-container">
        
        {/* ===== 왼쪽 사이드바: 일정 목록만 표시 ===== */}
        <div className="sidebar">
          <div className="sidebar-header" style={{ padding: '20px', borderBottom: '1px solid #ddd' }}>
            <h2>{scheduleData?.title || "여행 일정"}</h2>
            <p>{scheduleData?.startDate} ~ {scheduleData?.endDate}</p>
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