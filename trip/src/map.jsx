// App.jsx (수정 완료 버전)

import React, { useState } from 'react';
import axios from 'axios';
import MapPage from './pages/MapPage.jsx';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // 1. useLocation 추가 12-2

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const App = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchResults, setSearchResults] = useState([]);

  // 12-02 이정민 수정  - 검색어 기반 검색
  // 2. 받아온 데이터 꾸러미(location) 풀기
  const location = useLocation();
  const searchKeyword = location.state?.searchKeyword; // "부산" 같은 글자가 여기 들어옴

  // 12/11 수정 - 기존것들 다 3일로 고정되어 받는중 날짜를 받을때 그 날짜대로 하게끔 수정작업 
  // 🔥 [핵심 수정 1] 넘어온 일정 데이터(schedule) 꺼내기
  const scheduleData = location.state?.schedule; 

  // 🔥 [핵심 수정 2] 동적으로 초기 State 생성 함수
  // scheduleData가 있으면 그 기간만큼, 없으면 기본 3일치 생성
  const initializeItinerary = () => {
    const days = scheduleData ? scheduleData.diffDays + 1 : 3; // 기본값 3
    const initialState = {};
    for (let i = 1; i <= days; i++) {
      initialState[`day${i}`] = [];
    }
    return initialState;
  };

  // State 초기값으로 함수(initializeItinerary)를 넣어주면 최초 1회 실행됨
  const [itineraryByDay, setItineraryByDay] = useState(initializeItinerary);

  /* 혹시 페이지 이동 없이 날짜만 바뀌는 경우를 대비해 useEffect 추가 (선택 사항)
     만약 App 컴포넌트가 아예 새로 마운트된다면 위의 useState 초기화로 충분합니다.
  */
  useEffect(() => {
     if (scheduleData) {
        console.log("📅 App.jsx: 일정 데이터 수신", scheduleData);
        // 필요하다면 여기서 setItineraryByDay를 다시 호출해 리셋할 수도 있음
        // setItineraryByDay(initializeItinerary()); 
     }
  }, [scheduleData]);


  const [isOptimized, setIsOptimized] = useState(false);

  const [mapCenter, setMapCenter] = useState({
    lat: 37.5551,
    lng: 126.9707
  });

  const [showButton, setShowButton] = useState(false);

  const DAY_COLORS = ["#FF0000", "#2196F3", "#4CAF50"];


  /* ============================================================
     📍 장소 검색창에서 직접 검색
  ============================================================ */
  const handleManualSearch = (place) => {
  console.log("🔥 place 수신:", place);
  console.log("geometry:", place.geometry);
  console.log("location:", place.geometry?.location);

    // 좌표를 여러 방식으로 안전하게 꺼내도록 개선함
    const lat = 
    place.geometry?.location?.lat?.() ??
    place.geometry?.location?.lat ??
    place.lat ??
    place.latitude ??
    null;

  const lng =
    place.geometry?.location?.lng?.() ??
    place.geometry?.location?.lng ??
    place.lng ??
    place.longitude ??
    null;

    if (lat === null || lng === null) {
      console.log("지원하지 않는 place 구조:", place);
      alert("장소 정보를 가져올 수 없습니다.");
      return;
    }
    const photoUrl = 
      place.photos?.[0]?.getUrl({ maxWidth: 500, maxHeight: 500 }) ?? null;
     
      // SearchResultItem.jsx 에 맞춘 photos 배열 강제 통일
      const photosArray = place.photos
        ? place.photos
        : photoUrl
        ? [
            {
              getUrl: () => photoUrl,
            },
          ]
        : [];

    const newPlace = {
      id: place.place_id || Date.now().toString(),
      name: place.name || "이름없음",
      address: place.formatted_address || "",  // 주소 필드 추가
      rating: place.rating || 0,
      reviews: place.user_ratings_total || 0,
      lat,
      lng,
      photos: photosArray,
      type: 'searched'
      
    };

    setMapCenter({ lat, lng });
    setSearchResults([newPlace]);
    setActiveTab('search');
    setShowButton(false);
  };


  /* ============================================================
     📍 Day1에 기본으로 장소 추가 (최적화 이전에는 임시로 Day1에 넣음)
  ============================================================ */
  const addToItinerary = (place) => {
    // 중복 체크 (모든 day에서 검색)
    const exists = Object.values(itineraryByDay).some(dayList =>
      dayList.some(item => item.id === place.id)
    );
    if (exists) {
      alert("이미 일정에 추가된 장소입니다.");
      return;
    }

    // 일단 최적화 전에는 Day1에만 추가
    // 12/10 나중에 일정을 받을떄에는 일정에 맞게 하는것이 좋은듯 ex) 12/10 ~ 12/12 면 3일로 되도록 
    setItineraryByDay({
      ...itineraryByDay,
      day1: [...itineraryByDay.day1, place]
    });

    setIsOptimized(false);
  };


  


  /* ============================================================
     📍 Day별 드래그앤드롭 정렬
     - normal-list (최적화 전 단일 리스트)
     - day1/day2/day3 (최적화 후 Day별 리스트)
  ============================================================ */
  const handleOnDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const { droppableId: sourceId } = source;
    const { droppableId: destId } = destination;

    // 0️⃣ 최적화 전: ItineraryListNormal 에서 오는 드래그 (droppableId: "normal-list")
    if (sourceId === "normal-list" && destId === "normal-list") {
      const items = Array.from(itineraryByDay.day1); // 최적화 전에는 day1만 사용

      const [moved] = items.splice(source.index, 1);
      items.splice(destination.index, 0, moved);

      setItineraryByDay({
        ...itineraryByDay,
        day1: items
      });
      setIsOptimized(false);
      return;
    }

    // 1️⃣ 최적화 이후: day1/day2/day3 사이 드래그
    const sourceDay = sourceId;   // 예: "day1"
    const destDay = destId;       // 예: "day2"

    // 방어 코드: 혹시 모르는 droppableId
    if (!itineraryByDay[sourceDay] || !itineraryByDay[destDay]) {
      console.warn("알 수 없는 droppableId:", sourceDay, destDay);
      return;
    }

    // 같은 Day 안에서 순서 변경
    if (sourceDay === destDay) {
      const items = Array.from(itineraryByDay[sourceDay] || []);
      const [moved] = items.splice(source.index, 1);
      items.splice(destination.index, 0, moved);

      setItineraryByDay({
        ...itineraryByDay,
        [sourceDay]: items
      });
      setIsOptimized(false);
      return;
    }

    // Day 간 이동
    const sourceItems = Array.from(itineraryByDay[sourceDay] || []);
    const destItems = Array.from(itineraryByDay[destDay] || []);

    const [moved] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, moved);

    setItineraryByDay({
      ...itineraryByDay,
      [sourceDay]: sourceItems,
      [destDay]: destItems
    });

    setIsOptimized(false);
  };


 /* ============================================================
   📍 n일코스 최적화 요청 → Day별로 자동 배분된 결과 생성
============================================================ */
const handleOptimize = async () => {
  console.log("🔥 handleOptimize 실행됨 시작");

  // 전체 장소 합치기 (동적 처리)
    const totalPlaces = Object.values(itineraryByDay).flat();
    const currentDays = Object.keys(itineraryByDay).length; // 현재 일수 (예: 5)

  try {
    const response = await axios.post("http://127.0.0.1:8000/optimize", {
      places: totalPlaces,
      days: currentDays
    });

    console.log("📡 백엔드 응답 도착:", response.data);

    const result = response.data?.optimized_places;
    console.log("📦 optimized_places(result):", result);

    const newItinerary = {};

    // 🔥 백엔드 구조가 [ [..], [..], [..] ] 이므로 이렇게 처리해야 함
    // const getDayPlaces = (index) => {
    //   const dayArr = result?.[index];
    //   return Array.isArray(dayArr) ? dayArr : [];
    // };

    for (let i = 0; i < currentDays; i++) {
      newItinerary[`day${i+1}`] = result?.[i] || [];
    }

    setItineraryByDay(newItinerary);
    setIsOptimized(true);
    alert(`${currentDays}일 코스로 최적화 완료!`);

  } catch (err) {
    console.log("❌ 최적화 중 오류 발생:", err);
    alert("백엔드 오류");
  }

  console.log("🔥 handleOptimize 끝까지 실행됨");
};



  /* ============================================================
     📍 일정 삭제 (Day 안에서 삭제)
  ============================================================ */
  const removeFromItinerary = (id) => {
    const updated = {};
    Object.keys(itineraryByDay).forEach(dayKey => {
       updated[dayKey] = itineraryByDay[dayKey].filter(item => item.id !== id);
    });
    setItineraryByDay(updated);
    setIsOptimized(false);
  };


  /* ============================================================
     📍 화면 렌더링 (MapPage로 props 전달)
  ============================================================ */
  return (
    <MapPage
      // ★ 3. MapPage에게 검색어 전달 (props로 넘겨줌)
      //  12 -2 수정 
      initialSearchKeyword={searchKeyword} 
      // 12-11 수정 
      scheduleData={scheduleData} // 하고 MapPage에서 useLocation 쓰지 않도록 설정 

      activeTab={activeTab}
      setActiveTab={setActiveTab}

      searchResults={searchResults}
      setSearchResults={setSearchResults}

      itineraryByDay={itineraryByDay}
      setItineraryByDay={setItineraryByDay}

      handleManualSearch={handleManualSearch}
      addToItinerary={addToItinerary}

      handleOnDragEnd={handleOnDragEnd}
      handleOptimize={handleOptimize}
      removeFromItinerary={removeFromItinerary}

      isOptimized={isOptimized}

      mapCenter={mapCenter}
      showButton={showButton}
      setShowButton={setShowButton}

      DAY_COLORS={DAY_COLORS}
      API_KEY={API_KEY}
    />
  );
};

export default App;
