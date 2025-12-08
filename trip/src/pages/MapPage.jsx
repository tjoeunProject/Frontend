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

import './MapPage.css';



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

  const DAY_KEYS = ["day1", "day2", "day3"];

  const totalItineraryCount =
    (itineraryByDay.day1.length || 0) +
    (itineraryByDay.day2.length || 0) +
    (itineraryByDay.day3.length || 0);

  const mergedBeforeOptimize = [
    ...itineraryByDay.day1,
    ...itineraryByDay.day2,
    ...itineraryByDay.day3
  ];

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
s
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
                      />
                    ) : (
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
                  <button className="btn-edit" onClick={() => setActiveTab("itinerary")}>
                    🔄 다시 편집하기
                  </button>
                  <Link to="/" className="btn-optimize">
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

            {/* 🔥 Intro → MapPage 이동 시 자동 검색 */}
            {initialSearchKeyword && (
              <AutoSearcher
                keyword={initialSearchKeyword}
                onPlaceFound={handleManualSearch}
              />
            )}

            <MapRecenter center={mapCenter} />
            <HandleMapIdle onIdle={() => setShowButton(true)} />

            {showButton && activeTab === "search" && (
              <div className="reSearch-btn-box">
                <button className="reSearch-btn">📍 여기에서 다시 검색</button>
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
