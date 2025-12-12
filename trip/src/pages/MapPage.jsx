// MapPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Map, Marker, APIProvider, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Link } from 'react-router-dom';

import SearchBox from '../components/SearchBox';
import MapRecenter from '../components/MapRecenter';
import HandleMapIdle from '../components/HandleMapIdle';
import SearchPlaceButton from '../components/SearchPlaceButton';

import TabButton from '../components/TabButton';
import SearchResultItem from '../components/SearchResultItem';

import ItineraryListNormal from '../components/ItineraryListNormal';
import ItineraryListOptimized from '../components/ItineraryListOptimized';

import DirectionsPolyline from '../components/DirectionsPolyline';

import FoodSidebar from '../components/FoodSidebar';
import NearbyFoodController from '../components/NearbyFoodController';

import MapClickHandler from '../components/MapClickHandler';
import './MapPage.css';

// 12/11
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import SplitButton from 'react-bootstrap/SplitButton';


/* ============================================================
    🔥 반드시 파일 제일 위에 있어야 하는 AutoSearcher (수정본)
============================================================ */
const AutoSearcher = ({ keyword, onPlaceFound }) => {
  const map = useMap();
  const placesLib = useMapsLibrary("places");
  const hasSearched = useRef(false);

  useEffect(() => {
    if (!map || !placesLib || !keyword) return;
    if (hasSearched.current) return;

    const service = new placesLib.PlacesService(map);

    // 1) findPlaceFromQuery로 place_id만 가져오기
    service.findPlaceFromQuery(
      {
        query: keyword,
        fields: ["place_id"], // place_id만 필요함
      },
      (results, status) => {
        if (
          status !== placesLib.PlacesServiceStatus.OK ||
          !results ||
          results.length === 0
        ) {
          console.log("❌ AutoSearcher: 검색 실패:", keyword);
          return;
        }

        const placeId = results[0].place_id;

        // 2) getDetails로 모든 정보를 가져오기
        service.getDetails(
          {
            placeId,
            fields: [
              "name",
              "geometry",
              "formatted_address",
              "place_id",
              "rating",
              "user_ratings_total",
              "photos",
            ],
          },
          (detail, detailStatus) => {
            if (
              detailStatus === placesLib.PlacesServiceStatus.OK &&
              detail
            ) {
              onPlaceFound(detail);
              hasSearched.current = true;
            } else {
              console.log("❌ AutoSearcher: getDetails 실패");
            }
          }
        );
      }
    );
  }, [map, placesLib, keyword, onPlaceFound]);

  return null;
};



/* ============================================================
    📍 MapPage 컴포넌트
============================================================ */
const MapPage = ({
  scheduleData,
  initialSearchKeyword,

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
  /* ===============================
    🍜 근처 음식점 상태
  =============================== */
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [showFoodPanel, setShowFoodPanel] = useState(false);
  const [foodRadius, setFoodRadius] = useState(700); // 기본 700m

  const FOOD_MARKER_ICON = {
    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  };

  /* ===============================
    🍜 장소 클릭 → 음식점 패널 오픈
  =============================== */
  const handleSelectPlaceForFood = (place) => {
    setSelectedPlace(place);
    setShowFoodPanel(true);
  };

  const handleSelectDayForFood = (dayKey) => {
  const dayPlaces = itineraryByDay[dayKey];
  if (!dayPlaces || dayPlaces.length === 0) return;

  const basePlace = dayPlaces[0]; // Day 대표 장소
  setSelectedPlace(basePlace);
  setShowFoodPanel(true);
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

  // 2️⃣ 디폴트 설정 (데이터가 없으면 이 값을 씀)
  // 예: 오늘부터 시작, 기간은 2(2박3일)
  const defaultSchedule = {
    startDate: new Date().toISOString().split('T')[0], // 오늘 날짜 "2025-XX-XX"
    endDate: new Date().toISOString().split('T')[0],   // (필요 시 계산)
    diffDays: 2 // 기본값: 2박 3일 (0, 1, 2)
  };

  // 3️⃣ 최종 사용할 스케줄 결정 (OR 연산자 || 사용)
  const schedule = scheduleData || defaultSchedule;

  // 12/11 날짜가 변경되었으므로 넘어온 날짜만큼 DAY_KEYS 생성 (예: 2박3일이면 day1~day3)
  const dayCount = scheduleData ? scheduleData.diffDays + 1 : 3;
  const DAY_KEYS = Array.from({ length: dayCount }, (_, i) => `day${i + 1}`);

  const totalItineraryCount = DAY_KEYS.reduce((acc, key) => {
    return acc + (itineraryByDay[key]?.length || 0);
  }, 0);

  // 병합 로직도 동적으로 변경
  const mergedBeforeOptimize = DAY_KEYS.flatMap(key => itineraryByDay[key] || []);

  //  {/* 임의의 색상 지정 (원하는 색상 코드로 변경 가능) */}
  const CUSTOM_COLOR = "#6C5CE7";



  return (
    <APIProvider apiKey={API_KEY} libraries={["places"]}>
      <div className="mappage-container">

        {/* 🔍 검색창 */}
        <div className="searchbox-overlay">
          <SearchBox onPlaceSelect={handleManualSearch} />
        </div>

        {/* ===== 왼쪽 사이드바 ===== */}
        <div className="sidebar">
          <div className="sidebar-tabs">
            <TabButton
              isActive={activeTab === "search"}
              onClick={() => setActiveTab("search")}
            >
              🔍 장소 찾기
            </TabButton>

            <TabButton
              isActive={activeTab === "itinerary"}
              onClick={() => setActiveTab("itinerary")}
            >
              📅 나의 일정 ({totalItineraryCount})
            </TabButton>
          </div>

          {/* 검색 탭 */}
          {activeTab === "search" && (
            <div className="search-tab">
              <p className="search-tip">상단 검색창 또는 아래 버튼으로 주변을 찾아보세요.</p>

              <div className="search-buttons">
                <SearchPlaceButton
                  type="restaurant"
                  onSearchResults={setSearchResults}
                  setShowButton={setShowButton}
                  setActiveTab={setActiveTab}
                />
                <SearchPlaceButton
                  type="tourist_attraction"
                  onSearchResults={setSearchResults}
                  setShowButton={setShowButton}
                  setActiveTab={setActiveTab}
                />
              </div>

              <div className="search-results-box">
                {searchResults.length === 0 ? (
                  <p className="search-empty">검색 결과가 여기에 표시됩니다.</p>
                ) : (
                  <ul className="search-results-list">
                    {searchResults.map((place) => (
                      <SearchResultItem key={place.id} place={place} onAdd={addToItinerary} />
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* 일정 탭 */}
          {activeTab === "itinerary" && (
            <div className="itinerary-tab">
              <div className="itinerary-scroll">

                {totalItineraryCount === 0 ? (
                  <p className="itinerary-empty">장소를 추가하세요!</p>
                ) : (
                  <>
                    {!isOptimized ? (
                      <ItineraryListNormal
                        list={mergedBeforeOptimize}
                        handleOnDragEnd={handleOnDragEnd}
                        removeFromItinerary={removeFromItinerary}
                        onSelectPlace={handleSelectPlaceForFood}
                      />
                    ) : (
                      <ItineraryListOptimized
                        itineraryByDay={itineraryByDay}
                        setItineraryByDay={setItineraryByDay}
                        removeFromItinerary={removeFromItinerary}
                        DAY_COLORS={DAY_COLORS}
                        onSelectDay={handleSelectDayForFood}
                        onSelectPlace={handleSelectPlaceForFood}
                      />
                    )}
                  </>
                )}
              </div>



              {!isOptimized ? (
                /* 최적화 전 버튼 (동일한 색상 적용) */
                <Button
                  className="btn-optimize"
                  style={{
                    backgroundColor: CUSTOM_COLOR,
                    borderColor: CUSTOM_COLOR,
                    fontWeight: 'bold'
                  }}
                  onClick={handleOptimize}
                >
                  🚀 {dayCount}일 코스로 최적화하기
                </Button>
              ) : (
                /* 최적화 후: Split Button (Drop Up) */
                <Dropdown as={ButtonGroup} drop="up" className="btn-optimize">

                  {/* 1. 메인 버튼 (꽉 차게 설정: flex: 1) */}
                  <Button
                    as={Link}
                    to="/"
                  >
                    💾 저장하기
                  </Button>

                  {/* 2. 화살표 버튼 (작게 설정: flex: 0 0 auto) */}
                  <Dropdown.Toggle
                    split
                    id="dropdown-split-basic"
                  />

                  {/* 3. 메뉴 아이템 */}
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setActiveTab("itinerary")}>
                      🔄 다시 편집하기
                    </Dropdown.Item>
                  </Dropdown.Menu>

                </Dropdown>
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

            {showFoodPanel && (
              <FoodSidebar
              basePlace={selectedPlace}
              restaurants={nearbyRestaurants}
              radius={foodRadius}
              onRadiusChange={setFoodRadius}
              onClose={() => setShowFoodPanel(false)}
              onSelectRestaurant={(r) => {
              console.log("선택한 음식점:", r);
            }}
            />
            )}


            {showFoodPanel && selectedPlace && (
              <NearbyFoodController
                selectedPlace={selectedPlace}
                radius={foodRadius}
                onResults={setNearbyRestaurants}
              />
            )}

            <MapRecenter center={mapCenter} />
            <HandleMapIdle onIdle={() => setShowButton(true)} />

            {showButton && activeTab === "search" && (
              <div
                className="reSearch-btn-box"
                style={{
                  backgroundColor: '#ffffff',
                  padding: '8px 8px',
                  borderRadius: '6px',
                  display: 'inline-block'
                }}
              >
                <span style={{ fontSize: '12px', color: '#000000ff' }}>
                  Tip. 원하는 장소에 핀트를 찍어서 나의 일정에도 추가할 수 있습니다.
                </span>
              </div>
            )}

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

            {/* 🍜 근처 음식점 마커 */}
            {showFoodPanel &&
              nearbyRestaurants.map((r) => (
                <Marker
                  key={r.id}
                  position={{ lat: r.lat, lng: r.lng }}
                  icon={FOOD_MARKER_ICON}
                />
              ))}

          </Map>
        </div>

      </div>
    </APIProvider>
  );
};

export default MapPage;
