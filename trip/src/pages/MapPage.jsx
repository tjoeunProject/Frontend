// MapPage.jsx
// 토스트 박스 넣을 예정
import React from 'react';
import { Map, Marker, APIProvider , useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import { BrowserRouter, Route, Routes, Link} from 'react-router-dom';

import SearchBox from '../components/SearchBox';
import MapRecenter from '../components/MapRecenter';
import HandleMapIdle from '../components/HandleMapIdle';
import SearchPlaceButton from '../components/SearchPlaceButton';

import TabButton from '../components/TabButton';
import SearchResultItem from '../components/SearchResultItem';

import ItineraryListNormal from '../components/ItineraryListNormal';
import ItineraryListOptimized from '../components/ItineraryListOptimized';

import DirectionsPolyline from '../components/DirectionsPolyline';
import { useState, useEffect, useRef } from 'react';

import './MapPage.css';
// const { toasts, register } = useToast();
const MapPage = ({
  initialSearchKeyword, 
  // ★ 아까 map.jsx에서 받은 검색어, 


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
  /** Day 순서 고정 */
  const DAY_KEYS = ['day1', 'day2', 'day3'];

  /** 전체 일정 개수 */
  const totalItineraryCount =
    (itineraryByDay?.day1?.length || 0) +
    (itineraryByDay?.day2?.length || 0) +
    (itineraryByDay?.day3?.length || 0);

  /** 최적화 전 단일 배열 */
  const mergedBeforeOptimize = [
    ...(itineraryByDay?.day1 || []),
    ...(itineraryByDay?.day2 || []),
    ...(itineraryByDay?.day3 || []),
  ];





  return (
    <APIProvider apiKey={API_KEY}>
      <div className="mappage-container">

        {/* ===== 왼쪽 사이드바 ===== */}
        <div className="sidebar">
          <div className="sidebar-tabs">
            <TabButton isActive={activeTab === 'search'} onClick={() => 
              setActiveTab('search')
              
              }>
              🔍 장소 찾기
            </TabButton>

            <TabButton isActive={activeTab === 'itinerary'} onClick={() => setActiveTab('itinerary')}>
              📅 나의 일정 ({totalItineraryCount})
            </TabButton>
          </div>

          {/* 검색 탭 */}
          {activeTab === 'search' && (
            <div className="search-tab">
              <p className="search-tip">상단 검색창을 이용하거나 아래 버튼으로 주변을 찾아보세요.</p>

              <div className="search-buttons">
                <SearchPlaceButton type="restaurant" onSearchResults={setSearchResults} setShowButton={setShowButton} setActiveTab={setActiveTab}/>
                <SearchPlaceButton type="tourist_attraction" onSearchResults={setSearchResults} setShowButton={setShowButton} setActiveTab={setActiveTab}/>
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
          {activeTab === 'itinerary' && (
            <div className="itinerary-tab">
              <div className="itinerary-scroll">

                {totalItineraryCount === 0 ? (
                  <p className="itinerary-empty">장소를 추가하세요!</p>
                ) : (
                  <>
                    {!isOptimized && (
                      <ItineraryListNormal
                        list={mergedBeforeOptimize}
                        handleOnDragEnd={handleOnDragEnd}
                        removeFromItinerary={removeFromItinerary}
                      />
                    )}

                    {isOptimized && (
                      <ItineraryListOptimized
                        itineraryByDay={itineraryByDay}
                        setItineraryByDay={setItineraryByDay}
                        removeFromItinerary={removeFromItinerary}
                        DAY_COLORS={DAY_COLORS}
                      />
                    )}
                  </>
                )}

              </div>

              {!isOptimized ? (
                <button className="btn-optimize" onClick={handleOptimize}>
                  🚀 3일 코스로 최적화하기
                </button>
              ) : (
                <div>
                <button className="btn-edit" onClick={() => setActiveTab('itinerary')}>
                  🔄 다시 편집하기
                </button>
                <Link to="/home" className="btn-optimize">
                  저장하기
                </Link>
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
          >
            {/* ★ 여기에 방금 만든 자동 검색기를 끼워넣으세요! */}
            {initialSearchKeyword && (
              <AutoSearcher 
                keyword={initialSearchKeyword} 
                onPlaceFound={handleManualSearch} 
              />
            )}


            <SearchBox onPlaceSelect={handleManualSearch} />
            <MapRecenter center={mapCenter} />
            <HandleMapIdle onIdle={() => setShowButton(true)} />

            {showButton && activeTab === 'search' && (
              <div className="reSearch-btn-box">
                <button className="reSearch-btn" onClick={() => alert('왼쪽 사이드바에서 주변 맛집을 눌러보세요!')}>
                  📍 여기에서 다시 검색
                </button>
              </div>
            )}

            {/* 🔍 검색 마커 */}
            {activeTab === 'search' &&
              searchResults.map((place) => (
                <Marker
                  key={place.id}
                  position={{ lat: place.lat, lng: place.lng }}
                  onClick={() => addToItinerary(place)}
                  title="일정에 추가"
                />
              ))}

            {/* 📅 최적화 전 마커 */}
            {activeTab === 'itinerary' && !isOptimized &&
              mergedBeforeOptimize.map((place, index) => (
                <Marker
                  key={place.id}
                  position={{ lat: place.lat, lng: place.lng }}
                  label={{ text: String(index + 1), color: '#fff', fontWeight: 'bold' }}
                  zIndex={100}
                />
              ))}

            {/* 📅 최적화 후: 마커 + 실제 경로(DirectionsPolyline) */}
            {activeTab === 'itinerary' && isOptimized &&
              DAY_KEYS.map((dayKey, dayIndex) => {
                const dayPlaces = itineraryByDay[dayKey] || [];

                if (dayPlaces.length === 0) return null;

                return (
                  <React.Fragment key={dayKey}>

                    {/* Day 마커 */}
                    {dayPlaces.map((place, idx) => (
                      <Marker
                        key={place.id}
                        position={{ lat: place.lat, lng: place.lng }}
                        label={{
                          text: `${dayIndex + 1}-${idx + 1}`,
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: 'bold',
                        }}
                        zIndex={100}
                      />
                    ))}

                    {/* Day 실제 Directions 경로 */}
                    {dayPlaces.map((place, idx) => {
                      if (idx === dayPlaces.length - 1) return null;

                      const originPlace = dayPlaces[idx];
                      const destPlace = dayPlaces[idx + 1];

                      const origin = { lat: originPlace.lat, lng: originPlace.lng };
                      const destination = { lat: destPlace.lat, lng: destPlace.lng };

                      return (
                        <DirectionsPolyline
                          key={`${dayKey}-route-${idx}`}
                          origin={origin}
                          destination={destination}
                          color={DAY_COLORS[dayIndex]}
                        />
                      );
                    })}

                  </React.Fragment>
                );
              })
            }

          </Map>
        </div>
      </div>
    </APIProvider>
  );
};


const AutoSearcher = ({ keyword, onPlaceFound }) => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');

  // ★ "검색 했음" 표시를 위한 변수 (useRef 사용)
  // 화면이 새로 그려져도 이 값은 True로 유지됩니다.
  const hasSearched = useRef(false);

  useEffect(() => {
    // 지도나 라이브러리가 없거나, 검색어가 없으면 중단
    if (!map || !placesLib || !keyword) return;

    // ★ 핵심: 이미 검색을 한 적이 있다면(True라면) 아무것도 하지 말고 끝내라!
    if (hasSearched.current) return;
    
    // 구글 텍스트 검색 실행 (예: "해운대" -> 해운대 좌표 찾기)
    const service = new placesLib.PlacesService(map);
    const request = {
      query: keyword,
      fields: ['name', 'geometry', 'place_id', 'rating', 'user_ratings_total']
    };

    service.findPlaceFromQuery(request, (results, status) => {
      if (status === placesLib.PlacesServiceStatus.OK && results && results.length > 0) {
        // 찾았으면 부모(App)에 있는 handleManualSearch 함수를 실행시킴!
        onPlaceFound(results[0]); 

        // ★ 검색 성공 후 "나 이제 검색했음!" 하고 체크 표시
        hasSearched.current = true;
      }
    });
  }, [map, placesLib, keyword, onPlaceFound]);

  return null; // 화면에는 아무것도 안 그림
};


export default MapPage;
