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
  /* ===============================
    🍜 근처 음식점 상태
  =============================== */
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [showFoodPanel, setShowFoodPanel] = useState(false);
  const [foodRadius, setFoodRadius] = useState(700);

  // 🔥 어떤 Day의 어떤 index 아래에 넣을지 저장
  const [foodInsertTarget, setFoodInsertTarget] = useState(null);
  // { dayKey: "day2", index: 0 }

  const FOOD_MARKER_ICON = {
    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  };

  // ✅ (추가) "나의 일정 옆" 추천 패널 표시 여부
  const [showNearbyResult, setShowNearbyResult] = useState(false);

  /* ===============================
    ✅ (핵심) 음식점 사진 URL 만들기
  =============================== */
  const getPhotoUrlFromPlace = (place, maxWidth = 500) => {
    if (!place?.photos || place.photos.length === 0) return null;

    const photo = place.photos[0];

    // 1) getUrl 함수가 있으면 그대로 사용 (관광지/상세정보)
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
  =============================== */
  const handleSelectPlaceForFood = (place, dayKey = null, index = null) => {
    setSelectedPlace(place);
    setFoodInsertTarget(
      dayKey !== null && index !== null ? { dayKey, index } : null
    );
    setShowFoodPanel(true);
  };

  const handleSelectDayForFood = (dayKey) => {
    const dayPlaces = itineraryByDay[dayKey];
    if (!dayPlaces || dayPlaces.length === 0) return;

    const basePlace = dayPlaces[0];
    setSelectedPlace(basePlace);

    // Day 클릭은 기준만 바뀌는거라 삽입 타겟은 비움
    setFoodInsertTarget(null);

    setShowFoodPanel(true);
  };

  // 🔥 (추가) place가 itineraryByDay의 어디에 있는지 찾아서 dayKey/index 반환
  const findPlacePosition = (place) => {
    if (!place?.id || !itineraryByDay) return null;

    for (const [dayKey, places] of Object.entries(itineraryByDay)) {
      const idx = (places || []).findIndex((p) => p.id === place.id);
      if (idx !== -1) return { dayKey, index: idx };
    }
    return null;
  };

  // 12/11 추가 날짜를 받기 위한 설정
  useEffect(() => {
    if (scheduleData) {
      console.log("📦 전달받은 여행 일정:", scheduleData);
    } else {
      console.log("데이터가 없습니다.");
    }
  }, [scheduleData]);

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

  return (
    <APIProvider apiKey={API_KEY} libraries={["places"]}>
      <div className="mappage-container">

        {/* 🔍 검색창 */}
        <div className="searchbox-overlay">
          <SearchBox onPlaceSelect={handleManualSearch} />
        </div>

        {/* ✅ 사이드바 + (나의 일정 옆) 추천 패널 컨테이너 */}
        <div className="sidebar-container">

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
                  <div className="save-dropdown-wrapper">
                <Link to="/" className="btn-save-main">
                  💾 저장하기
                </Link>

                <button
                  className="btn-save-toggle"
                  onClick={() => setShowSaveMenu((prev) => !prev)}
                >
                  ▼
                </button>

                {showSaveMenu && (
                  <div className="save-dropdown-menu">
                    <div
                      className="save-dropdown-item"
                      onClick={() => {
                        handleNearby();
                        setShowNearbyResult(true);
                        setShowSaveMenu(false);
                      }}
                    >
                      🍽️ 주변 맛집 찾기
                    </div>
                  </div>
                )}
              </div>
                )}
              </div>
            )}
          </div>

          {/* ✅ '나의 일정 옆' 추천 패널 (탭 전환 없이 옆에 뜸) */}
          {showNearbyResult && (
            <div className="nearby-panel">

              {/* 🔥 탭 헤더 (sidebar-tabs랑 동일한 역할) */}
              <div className="nearby-tabs">
                <button className="nearby-tab-btn active">
                  🍽️ 주변 추천 맛집
                </button>

                <button
                  className="nearby-close-btn"
                  onClick={() => setShowNearbyResult(false)}
                >
                  ✕
                </button>
              </div>

              {/* 🔥 컨텐츠 영역 */}
              <div className="nearby-tab">
                <div className="nearby-scroll">
                  {nearbyRestaurants.length === 0 ? (
                    <p className="nearby-empty">추천 결과가 없습니다.</p>
                  ) : (
                    nearbyRestaurants.map((restaurant) => (
                  <SearchResultItem
                    key={restaurant.id || restaurant.placeId}
                    place={restaurant}
                    onAdd={addToItinerary}
                  />
                ))
              )}
            </div>
          </div>

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
            mapTypeControl={false}
            streetViewControl={false}
          >
            <MapClickHandler onPlaceSelect={addToItinerary} />

            {initialSearchKeyword && (
              <AutoSearcher
                keyword={initialSearchKeyword}
                onPlaceFound={handleManualSearch}
              />
            )}

            {/* 🔥 음식점 패널 */}
            {showFoodPanel && (
              <FoodSidebar
                basePlace={selectedPlace}
                restaurants={nearbyRestaurants}
                radius={foodRadius}
                onRadiusChange={setFoodRadius}
                onClose={() => setShowFoodPanel(false)}
                onAddRestaurant={(restaurant) => {
                  if (!foodInsertTarget) {
                    alert("추가할 위치를 정하려면 일정에서 관광지를 먼저 클릭해주세요!");
                    return;
                  }

                  const { dayKey, index } = foodInsertTarget;

                  // ⭐ 사진 URL 생성
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

                    // ⭐ 반드시 photoUrl 저장해야 함
                    photoUrl: photoUrl,

                    type: "restaurant",
                  };

                  // 중복 방지
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

            {/* 일정 마커 (최적화 전) */}
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
                if (!dayPlaces || dayPlaces.length === 0) return null;

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
                        onClick={() => {
                          const pos = findPlacePosition(place);
                          if (pos) handleSelectPlaceForFood(place, pos.dayKey, pos.index);
                          else handleSelectPlaceForFood(place);
                        }}
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
                  key={r.id || r.place_id}
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
