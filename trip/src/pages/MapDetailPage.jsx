// MapPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Map, Marker, APIProvider, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useNavigate } from "react-router-dom";

import MapRecenter from '../components/MapRecenter';
import HandleMapIdle from '../components/HandleMapIdle';
import SearchPlaceButton from '../components/SearchPlaceButton';

import TabButton from '../components/TabButton';
import SearchResultItem from '../components/SearchResultItem';

import ItineraryListOptimized from '../components/ItineraryListOptimized';

import DirectionsPolyline from '../components/DirectionsPolyline';


import MapClickHandler from '../components/MapClickHandler';
import './MapPage.css';

// 12/11
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';

// 12/15
import Header from './../components/common/Header';
import Modal from 'react-modal';


const MapPage = ({
  scheduleData,
  initialSearchKeyword,

  //12/11 추가 
  handleNearby,

  activeTab,
  setActiveTab,
  searchResults,
  setSearchResults,

  itineraryByDay,
  setItineraryByDay,

  handleManualSearch,
  addToItinerary,
  handleMapClick,
  handleOnDragEnd,
  handleOptimize,
  removeFromItinerary,
  isOptimized,

  mapCenter,
  showButton,
  setShowButton,
  DAY_COLORS,
  API_KEY
}) => {
  const [isToggleOptimized, setIsToggleOptimized] = useState(false);


  const isTogglehandleOptimize = () => {

    console.log(`[Toggle Optimize] 버튼 클릭 전: ${isToggleOptimized}`);

  setIsToggleOptimized(prev => !prev);  // false -> true -> false ...
};

// 🔥🔥 로그 추가: 상태가 변경된 후에 값 확인
useEffect(() => {
    console.log(`[Toggle Optimize] 상태 변경 완료: isToggleOptimized = ${isToggleOptimized}`);
}, [isToggleOptimized]);


  const FOOD_MARKER_ICON = {
    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  };


// 12/15 은섭 수정
  const navigate = useNavigate();
// 12/15 공유하기
const handleShareClick = () => {
        alert("저장이 완료되었습니다. 히스토리 페이지로 이동합니다.");
        navigate("/history"); // 경로를 '/history'로 수정
    };

  // 12/11 추가 날짜를 받기 위한 설정

  // 3️⃣ 데이터 확인용 (개발자 도구 콘솔 확인)
  useEffect(() => {
    if (scheduleData && itineraryByDay) {
      const requiredDays = scheduleData.diffDays + 1;
      // 기존 데이터 초기화 혹은 리사이징 로직 필요
      // 주의: setItineraryByDay는 부모의 state를 바꾸므로 신중해야 함

      // 예: 부모 컴포넌트가 이 로직을 처리하는 것이 가장 좋음
      // 여기서는 단순히 콘솔로 확인만 하거나, 부모에게 "날짜 바뀌었으니 초기화해줘"라고 요청하는 함수가 있으면 좋음
    }
    if (scheduleData) {
      console.log("📦 전달받은 여행 일정:", scheduleData);
      // 예: { startDate: "2025-03-12", endDate: "2025-03-15", diffDays: 3, ... }
    } else {
      // 아마 이쪽으로 빠지고 있었을 겁니다.
      console.log("데이터가 없습니다.");
    }
  }, [scheduleData]);


  // 3️⃣ 최종 사용할 스케줄 결정 (OR 연산자 || 사용)
  const schedule = scheduleData ;

  const CUSTOM_COLOR = "#6C5CE7";



  return (
    /*  <div className="test-tab">
      
      /* <Header /> */
      
    <APIProvider apiKey={API_KEY} libraries={["places"]}>
    
      <div className="mappage-container">

        <div className="sidebar">
          <div className="sidebar-tabs">
           

            <TabButton
              isActive={activeTab === "itinerary"}
              onClick={() => setActiveTab("itinerary")}
            >
              📅 나의 일정 
            </TabButton>
          </div>


          {/* 일정 탭 */}
          {activeTab === "itinerary" && (
            <div className="itinerary-tab">
              <div className="itinerary-scroll">
                  <>
                     (
                      <ItineraryListOptimized
                        itineraryByDay={itineraryByDay}
                        setItineraryByDay={setItineraryByDay}
                        removeFromItinerary={removeFromItinerary}
                        DAY_COLORS={DAY_COLORS}
                        onSelectDay={handleSelectDayForFood}
                        onSelectPlace={handleSelectPlaceForFood}
                        isToggleOptimized={isToggleOptimized}
                      />
                    ) 
                  </>
        
              </div>



              {!isToggleOptimized ? (
                /* 최적화 전 버튼 (동일한 색상 적용) */
                <Dropdown>

                  {/* 1. 메인 버튼 (꽉 차게 설정: flex: 1) */}
                  <Button
                  className="btn-optimize"
                  style={{
                    backgroundColor: CUSTOM_COLOR,
                    borderColor: CUSTOM_COLOR,
                    fontWeight: 'bold'
                  }}
                    onClick={isTogglehandleOptimize}
                  >
                    저장하기
                  </Button>

                  {/* 2. 화살표 버튼 (작게 설정: flex: 0 0 auto) */}
                </Dropdown>

              ) : (
                /* 최적화 후: Split Button (Drop Up) */
                <div>
                <Button
                  className="btn-optimize"
                  style={{
                    backgroundColor: CUSTOM_COLOR,
                    borderColor: CUSTOM_COLOR,
                    fontWeight: 'bold'
                  }}
                  onClick={isTogglehandleOptimize}
                >
                  수정하기
                </Button>

                <Button
                  className="btn-optimize"
                  style={{
                    backgroundColor: CUSTOM_COLOR,
                    borderColor: CUSTOM_COLOR,
                    fontWeight: 'bold'
                  }}
                  onClick={handleShareClick}
                  
                >
                  공유하기
                  
                </Button>
                </div>
                
              )}
            </div>
          )}
        </div>
        {/* ===== 오른쪽 지도 ===== */}
        <div className="map-container">
      
          <Map
            defaultCenter={{ lat: 37.5551, lng: 126.9707 }}
            defaultZoom={13}
            gestureHandling="greedy"
            disableDefaultUI={false}
            onClick={handleMapClick}
            mapTypeControl={false}        // 왼쪽 위 '지도/위성' 버튼 숨김
            streetViewControl={false}     // 오른쪽 아래 '페그맨' 숨김
          >
            {/* 12/10 수정  */}
            <MapClickHandler onPlaceSelect={addToItinerary} />

            {/* 🔥 Intro → MapPage 이동 시 자동 검색 */}
            {initialSearchKeyword && (
              <AutoSearcher
                keyword={initialSearchKeyword}
                onPlaceFound={handleManualSearch}
              />
            )}

            <MapRecenter center={mapCenter} />
            <HandleMapIdle onIdle={() => setShowButton(true)} />


            {/* 검색 마커 */}
            {activeTab === "search" &&
              searchResults.map((place) => (
                <Marker
                  key={place.id}
                  position={{ lat: place.lat, lng: place.lng }}
                  onClick={() => addToItinerary(place)}
                />
              ))}

            {/* 일정 마커 */}
            {activeTab === "itinerary" &&
              !isOptimized &&
              mergedBeforeOptimize.map((place, index) => (
                <Marker
                  key={place.id}
                  position={{ lat: place.lat, lng: place.lng }}
                  label={{ text: String(index + 1), color: "#fff" }}
                  onClick={() => handleSelectPlaceForFood(place)}
                />
              ))}

            {/* 일정 + 경로 (최적화 후) */}
            {activeTab === "itinerary" &&
              isOptimized &&
              DAY_KEYS.map((dayKey, dayIndex) => {
                const dayPlaces = itineraryByDay[dayKey];
                if (dayPlaces.length === 0) return null;

                return (
                  <React.Fragment key={dayKey}>
                    {dayPlaces.map((place, idx) => (
                      <Marker
                        key={place.id}
                        position={{ lat: place.lat, lng: place.lng }}
                        label={{
                          text: `${dayIndex + 1}-${idx + 1}`,
                          color: "#fff",
                          fontSize: "11px",
                          fontWeight: "bold",
                        }}
                        onClick={() => handleSelectPlaceForFood(place)}
                      />
                    ))}

                    {dayPlaces.map((place, idx) => {
                      if (idx === dayPlaces.length - 1) return null;

                      return (
                        <DirectionsPolyline
                          key={`${dayKey}-route-${idx}`}
                          origin={{ lat: dayPlaces[idx].lat, lng: dayPlaces[idx].lng }}
                          destination={{ lat: dayPlaces[idx + 1].lat, lng: dayPlaces[idx + 1].lng }}
                          color={DAY_COLORS[dayIndex]}
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

export default MapPage;
