// MapPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Map, Marker, APIProvider, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

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

// 12/16
import useRouteLogic from './../pages/Route/useRouteLogic';

/* ============================================================
    🔥 AutoSearcher (검색어 자동 이동)
============================================================ */
const AutoSearcher = ({ keyword, onPlaceFound }) => {
  const map = useMap();
  const placesLib = useMapsLibrary("places");
  const hasSearched = useRef(false);

  useEffect(() => {
    if (!map || !placesLib || !keyword) return;
    if (hasSearched.current) return;

    const service = new placesLib.PlacesService(map);

    service.findPlaceFromQuery(
      {
        query: keyword,
        fields: ["place_id"],
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
  handleNearby,
  activeTab,
  setActiveTab,
  searchResults,
  setSearchResults,
  nearbyGoogleRestaurants,
  setNearbyGoogleRestaurants,
  recommendedRestaurants,
  itineraryByDay,
  setItineraryByDay,
  handleManualSearch,
  addToItinerary,
  handleMapClick,
  // handleOnDragEnd, // 기존 props 대신 내부에서 정의하거나 수정하여 사용
  handleOptimize,
  removeFromItinerary,
  isOptimized,
  mapCenter,
  showButton,
  setShowButton,
  DAY_COLORS,
  API_KEY,
}) => {
  // 사이드바 열림/닫힘 상태 관리 (기본값: true/열림)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 토글 핸들러
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const location = useLocation();

  /* ===============================
    🍜 근처 음식점 상태
  =============================== */
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showFoodPanel, setShowFoodPanel] = useState(false);
  const [foodRadius, setFoodRadius] = useState(700);

  // 🔥 어떤 Day의 어떤 index 아래에 넣을지 저장
  const [foodInsertTarget, setFoodInsertTarget] = useState(null);

  const FOOD_MARKER_ICON = {
    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  };

  // ✅ "나의 일정 옆" 추천 패널 표시 여부
  const [showNearbyResult, setShowNearbyResult] = useState(false);

  /* ===============================
    ✅ 음식점 사진 URL 만들기
  =============================== */
  const getPhotoUrlFromPlace = (place, maxWidth = 500) => {
    if (!place?.photos || place.photos.length === 0) return null;
    const photo = place.photos[0];

    // 1) getUrl 함수가 있으면 그대로 사용
    if (typeof photo.getUrl === "function") {
      try {
        return photo.getUrl({ maxWidth, maxHeight: maxWidth });
      } catch (e) {
        return null;
      }
    }
    // 2) nearbySearch 결과 (photo_reference)
    if (photo.photo_reference && API_KEY) {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photo.photo_reference}&key=${API_KEY}`;
    }
    return null;
  };

  /* ===============================
    🍜 장소 클릭 → 음식점 패널 오픈
    근러 음식점을 열면, 주변 추천 맛집은 닫는다.
  =============================== */
  const handleSelectPlaceForFood = (place, dayKey = null, index = null) => {
    setSelectedPlace(place);
    setFoodInsertTarget(
      dayKey !== null && index !== null ? { dayKey, index } : null
    );
    setShowFoodPanel(true);
    setShowNearbyResult(false); // 상호 배타적 동작
  };

  const handleSelectDayForFood = (dayKey) => {
    const dayPlaces = itineraryByDay[dayKey];
    if (!dayPlaces || dayPlaces.length === 0) return;

    const basePlace = dayPlaces[0];
    setSelectedPlace(basePlace);
    setFoodInsertTarget(null);
    setShowFoodPanel(true);
    setShowNearbyResult(false); // 상호 배타적 동작
  };

  // place가 itineraryByDay의 어디에 있는지 찾기
  const findPlacePosition = (place) => {
    if (!place?.id || !itineraryByDay) return null;
    for (const [dayKey, places] of Object.entries(itineraryByDay)) {
      const idx = (places || []).findIndex((p) => p.id === place.id);
      if (idx !== -1) return { dayKey, index: idx };
    }
    return null;
  };

  /* ============================================================
     드래그 앤 드롭 핸들러 (Day 순서 변경 + 장소 이동)
  ============================================================ */
  const handleOnDragEnd = (result) => {
    const { source, destination, type } = result;

    // 드롭 대상이 없으면 리턴
    if (!destination) return;

    // 제자리 드래그면 무시
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    // ✅ 1. Day(일차) 자체를 드래그해서 순서 변경 (type === 'DAY')
    if (type === 'DAY') {
      // (1) day1, day2... 키를 숫자 순서대로 정렬
      const dayKeys = Object.keys(itineraryByDay).sort((a, b) => {
        const numA = parseInt(a.replace('day', ''), 10);
        const numB = parseInt(b.replace('day', ''), 10);
        return numA - numB;
      });

      // (2) 현재 각 Day에 들어있는 "내용물(배열)"을 추출
      const dayValues = dayKeys.map(key => itineraryByDay[key]);

      // (3) 내용물 배열 순서 변경 (Day 1의 내용을 Day 2 자리로 등등)
      const [movedContent] = dayValues.splice(source.index, 1);
      dayValues.splice(destination.index, 0, movedContent);

      // (4) 변경된 순서대로 다시 객체 생성 (키는 day1, day2... 고정)
      const newItinerary = {};
      dayKeys.forEach((key, index) => {
        newItinerary[key] = dayValues[index];
      });

      setItineraryByDay(newItinerary);
      return;
    }

    // ✅ 2. 장소(Place) 드래그 로직 (기존 유지)
    const { droppableId: sourceId } = source;
    const { droppableId: destId } = destination;

    // (A) 최적화 전: ItineraryListNormal (단일 리스트)
    if (sourceId === "normal-list" && destId === "normal-list") {
      const items = Array.from(itineraryByDay.day1 || []); 
      const [moved] = items.splice(source.index, 1);
      items.splice(destination.index, 0, moved);
      setItineraryByDay({ ...itineraryByDay, day1: items });
      return;
    }

    // (B) 최적화 후: Day 간 이동 또는 Day 내 이동
    const sourceDay = sourceId;
    const destDay = destId;

    if (!itineraryByDay[sourceDay] || !itineraryByDay[destDay]) return;

    const sourceItems = Array.from(itineraryByDay[sourceDay]);
    const destItems = (sourceDay === destDay) 
      ? sourceItems 
      : Array.from(itineraryByDay[destDay]);

    const [moved] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, moved);

    setItineraryByDay({
      ...itineraryByDay,
      [sourceDay]: sourceItems,
      [destDay]: destItems
    });
  };

  // 일정 데이터 로깅
  useEffect(() => {
    if (scheduleData) {
      console.log("📦 전달받은 여행 일정:", scheduleData);
    } else {
      console.log("데이터가 없습니다.");
    }
  }, [scheduleData]);

  // 랭킹 페이지 넘어온 장소 처리
  useEffect(() => {
    // location.state에 placeToAdd가 있는지 확인
    if(location.state && location.state.placeToAdd) {
      const receivedPlace = location.state.placeToAdd;
      console.log("랭킹 페이지에서 장소 도착 : receivedPlace");

      // 탭을 '장소 찾기'로 변경
      if (setActiveTab) setActiveTab("search");

      if (setSearchResults) setSearchResults([receivedPlace]);

      // 2. 중요: 이미 추가했으므로 상태를 비워줌 (새로고침 시 중복 추가 방지)
      // history.replaceState를 사용하여 현재 페이지의 state를 초기화
      window.history.replaceState({}, document.title);
    }
  }, [location, setActiveTab, setSearchResults]); 

  const defaultSchedule = {
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    diffDays: 2
  };
  const schedule = scheduleData || defaultSchedule;
  const dayCount = scheduleData ? scheduleData.diffDays + 1 : 3;
  const DAY_KEYS = Array.from({ length: dayCount }, (_, i) => `day${i + 1}`);
  const totalItineraryCount = DAY_KEYS.reduce((acc, key) => {
    return acc + (itineraryByDay[key]?.length || 0);
  }, 0);
  const mergedBeforeOptimize = DAY_KEYS.flatMap(key => itineraryByDay[key] || []);
  const CUSTOM_COLOR = "#6C5CE7";
  const [showSaveMenu, setShowSaveMenu] = useState(false);

  // 12/16 저장 로직
  const { handleCreateRoute } = useRouteLogic();
  const onSaveClick = () => {
    const tripTitle = prompt("여행 제목을 입력해주세요!", "나의 멋진 여행");
    if (!tripTitle) return;
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 2); 
    const sDate = scheduleData?.startDate || today.toISOString().split('T')[0];
    const eDate = scheduleData?.endDate || futureDate.toISOString().split('T')[0];
    const dayCount = scheduleData ? scheduleData.diffDays + 1 : 3; 
    const formattedSchedule = [];
    for (let i = 1; i <= dayCount; i++) {
      const dayKey = `day${i}`;
      formattedSchedule.push(itineraryByDay[dayKey] || []);
    }
    handleCreateRoute({
      title: tripTitle,
      startDate: sDate,
      endDate: eDate,
      schedule: formattedSchedule
    });
  };

  return (
    <APIProvider apiKey={API_KEY} libraries={["places"]}>
      <div className="mappage-container">
        {/* 🔍 검색창 */}
        <div className="searchbox-overlay" style={{ 
          left: isSidebarOpen ? 'calc(50% + 200px)' : '50%',
          transition: 'left 0.3s ease'
        }}>
          <SearchBox onPlaceSelect={handleManualSearch} />
        </div>

        {/* 사이드바 + 패널 컨테이너 */}
        <div className={`sidebar-container ${isSidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar">
            <div className="sidebar-tabs">
              <TabButton isActive={activeTab === "search"} onClick={() => setActiveTab("search")}>
                🔍 장소 찾기
              </TabButton>
              <TabButton isActive={activeTab === "itinerary"} onClick={() => setActiveTab("itinerary")}>
                📅 나의 일정 ({totalItineraryCount})
              </TabButton>
            </div>

            {/* 검색 탭 */}
            {activeTab === "search" && (
              <div className="search-tab">
                <p className="search-tip">상단 검색창 또는 아래 버튼으로 주변을 찾아보세요.</p>
                <div className="search-buttons">
                  <SearchPlaceButton type="restaurant" onSearchResults={setSearchResults} setShowButton={setShowButton} setActiveTab={setActiveTab} />
                  <SearchPlaceButton type="tourist_attraction" onSearchResults={setSearchResults} setShowButton={setShowButton} setActiveTab={setActiveTab} />
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
                          // 🔥 [핵심] MapPage의 드래그 핸들러를 전달
                          onDragEnd={handleOnDragEnd} 
                        />
                      )}
                    </>
                  )}
                </div>

                {!isOptimized ? (
                  <Button className="btn-optimize" style={{ backgroundColor: CUSTOM_COLOR, borderColor: CUSTOM_COLOR, fontWeight: 'bold' }} onClick={handleOptimize}>
                    🚀 {dayCount}일 코스로 최적화하기
                  </Button>
                ) : (
                  <div className="save-dropdown-wrapper">
                    <button className="btn-save-main" onClick={onSaveClick}>💾 저장하기</button>
                    <button className="btn-save-toggle" onClick={() => setShowSaveMenu((prev) => !prev)}>▼</button>
                    {showSaveMenu && (
                      <div className="save-dropdown-menu">
                        <div className="save-dropdown-item" onClick={() => {
                            handleNearby();
                            setShowNearbyResult(true);
                            setShowFoodPanel(false);
                            setShowSaveMenu(false);
                          }}>
                          🍽️ 주변 맛집 찾기
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 패널들 */}
          {showNearbyResult && (
            <div className="nearby-panel">
              <div className="nearby-tabs">
                <button className="nearby-tab-btn active">🍽️ 주변 추천 맛집</button>
                <button className="nearby-close-btn" onClick={() => setShowNearbyResult(false)}>✕</button>
              </div>
              <div className="nearby-tab">
                <div className="nearby-scroll">
                  {recommendedRestaurants.length === 0 ? (
                    <p className="nearby-empty">추천 결과가 없습니다.</p>
                  ) : (
                    recommendedRestaurants.map((restaurant) => (
                      <SearchResultItem key={restaurant.id || restaurant.placeId} place={restaurant} onAdd={addToItinerary} />
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {showFoodPanel && (
              <FoodSidebar
                basePlace={selectedPlace}
                restaurants={nearbyGoogleRestaurants}
                radius={foodRadius}
                onRadiusChange={setFoodRadius}
                onClose={() => setShowFoodPanel(false)}
                onAddRestaurant={(restaurant) => {
                  if (!foodInsertTarget) {
                    alert("추가할 위치를 정하려면 일정에서 관광지를 먼저 클릭해주세요!");
                    return;
                  }
                  const { dayKey, index } = foodInsertTarget;
                  const photoUrl = getPhotoUrlFromPlace(restaurant);
                  const newItem = {
                    id: restaurant.id || Date.now().toString(),
                    placeId: restaurant.placeId,
                    name: restaurant.name,
                    rating: restaurant.rating,
                    reviews: restaurant.reviews,
                    lat: restaurant.lat,
                    lng: restaurant.lng,
                    vicinity: restaurant.vicinity,
                    formatted_address: restaurant.vicinity,
                    photoUrl: photoUrl,
                    photos: photoUrl ? [{ getUrl: () => photoUrl }] : [],
                    type: "restaurant",
                  };
                  const exists = Object.values(itineraryByDay).some((dayList) =>
                    (dayList || []).some((p) => p.id === newItem.id)
                  );
                  if (exists) {
                    alert("이미 일정에 추가된 음식점입니다.");
                    return;
                  }
                  const updatedDay = [...(itineraryByDay[dayKey] || [])];
                  updatedDay.splice(index + 1, 0, newItem);
                  setItineraryByDay({
                    ...itineraryByDay,
                    [dayKey]: updatedDay,
                  });
                }}
              />
            )}
        </div>

        <button className="sidebar-toggle-btn" onClick={toggleSidebar} title={isSidebarOpen ? "지도 넓게 보기" : "사이드바 열기"}>
          {isSidebarOpen ? '◀' : '▶'}
        </button>

        <div className="map-container">
          <Map
            defaultCenter={{ lat: 37.5551, lng: 126.9707 }}
            defaultZoom={13}
            gestureHandling="greedy"
            disableDefaultUI={false}
            onClick={handleMapClick}
            mapTypeControl={false}
            streetViewControl={false}
          >
            <MapClickHandler onPlaceSelect={addToItinerary} />
            {initialSearchKeyword && (
              <AutoSearcher keyword={initialSearchKeyword} onPlaceFound={handleManualSearch} />
            )}
            {showFoodPanel && selectedPlace && !showNearbyResult && (
              <NearbyFoodController selectedPlace={selectedPlace} radius={foodRadius} onResults={setNearbyGoogleRestaurants} API_KEY={API_KEY} />
            )}
            <MapRecenter center={mapCenter} />
            <HandleMapIdle onIdle={() => setShowButton(true)} />
            
            {showButton && activeTab === "search" && (
              <div className="reSearch-btn-box" style={{ backgroundColor: '#ffffff', padding: '8px 8px', borderRadius: '6px', display: 'inline-block' }}>
                <span style={{ fontSize: '12px', color: '#000000ff' }}>Tip. 원하는 장소에 핀트를 찍어서 나의 일정에도 추가할 수 있습니다.</span>
              </div>
            )}

            {/* 마커 렌더링 */}
            {activeTab === "search" && searchResults.map((place) => (
                <Marker key={place.id} position={{ lat: place.lat, lng: place.lng }} onClick={() => addToItinerary(place)} />
            ))}

            {activeTab === "itinerary" && !isOptimized && mergedBeforeOptimize.map((place, index) => (
                <Marker key={place.id} position={{ lat: place.lat, lng: place.lng }} label={{ text: String(index + 1), color: "#fff" }} onClick={() => handleSelectPlaceForFood(place)} />
            ))}

            {activeTab === "itinerary" && isOptimized && DAY_KEYS.map((dayKey, dayIndex) => {
                const dayPlaces = itineraryByDay[dayKey];
                if (!dayPlaces || dayPlaces.length === 0) return null;
                return (
                  <React.Fragment key={dayKey}>
                    {dayPlaces.map((place, idx) => (
                      <Marker key={place.id} position={{ lat: place.lat, lng: place.lng }} label={{ text: `${dayIndex + 1}-${idx + 1}`, color: "#fff", fontSize: "11px", fontWeight: "bold" }} onClick={() => {
                          const pos = findPlacePosition(place);
                          if (pos) handleSelectPlaceForFood(place, pos.dayKey, pos.index);
                          else handleSelectPlaceForFood(place);
                        }} />
                    ))}
                    {dayPlaces.map((place, idx) => {
                      if (idx === dayPlaces.length - 1) return null;
                      return <DirectionsPolyline key={`${dayKey}-route-${idx}`} origin={{ lat: dayPlaces[idx].lat, lng: dayPlaces[idx].lng }} destination={{ lat: dayPlaces[idx + 1].lat, lng: dayPlaces[idx + 1].lng }} color={DAY_COLORS[dayIndex]} />;
                    })}
                  </React.Fragment>
                );
              })}

            {showFoodPanel && nearbyGoogleRestaurants.map((r) => (
                <Marker key={r.id || r.place_id} position={{ lat: r.lat, lng: r.lng }} icon={FOOD_MARKER_ICON} />
            ))}
          </Map>
        </div>
      </div>
    </APIProvider>
  );
};
export default MapPage;