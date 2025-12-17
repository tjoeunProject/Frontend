// App.jsx (수정 완료 버전)

import React, { useState, useRef } from 'react';
import axios from 'axios';
import MapPage from './pages/MapPage.jsx';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // 1. useLocation 추가 12-2

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const App = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchResults, setSearchResults] = useState([]);
  const [nearbyGoogleRestaurants, setNearbyGoogleRestaurants] = useState([]);
  const [recommendedRestaurants, setRecommendedRestaurants] = useState([]);
  const hasFetched = useRef(false);

  // 12-02 이정민 수정  - 검색어 기반 검색
  // 2. 받아온 데이터 꾸러미(location) 풀기
  const location = useLocation();
  const searchKeyword = location.state?.searchKeyword; // "부산" 같은 글자가 여기 들어옴

  // 12/11 수정 - 기존것들 다 3일로 고정되어 받는중 날짜를 받을때 그 날짜대로 하게끔 수정작업 
  // 🔥 [핵심 수정 1] 넘어온 일정 데이터(schedule) 꺼내기
  const scheduleData = location.state?.schedule; 


  // 12/12 수정 
  // 1. SurveyFourPage에서 보낸 데이터 수신
  const generateRequest = location.state?.generateRequest;


// 상태 관리
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태



  // 🔥 [핵심 수정 2] 동적으로 초기 State 생성 함수
  // generateRequest 있으면 그 기간만큼 없을때 scheduleData가 있으면 그 기간만큼, 없으면 기본 3일치 생성
  const initializeItinerary = () => {
  const days = generateRequest ? generateRequest.days : 
        (scheduleData ? scheduleData.diffDays + 1 : 3);    

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
      formatted_address: place.formatted_address || "",  // 주소 필드 추가
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
    const rawPlaces = Object.values(itineraryByDay).flat();
    const currentDays = Object.keys(itineraryByDay).length; // 현재 일수 (예: 5)

    // 🔥 [핵심 수정] 백엔드로 보내기 전에 '함수'를 '문자열'로 변환 (Pre-processing)
    const totalPlaces = rawPlaces.map(place => {
    // 1) 이미 문자열 URL이 있는 경우 (재편집 등)
    let finalUrl = place.photoUrl;

    // 2) 구글맵 객체(함수)가 살아있는 경우 -> 실행해서 문자열로 변환
    if (!finalUrl && place.photos && place.photos.length > 0 && typeof place.photos[0].getUrl === 'function') {
      finalUrl = place.photos[0].getUrl({ maxWidth: 500, maxHeight: 500 });
    }

    // 3) 둘 다 없으면 null (나중에 프론트에서 기본이미지 처리)
    
    return {
      ...place,       // 기존 정보 유지
      photoUrl: finalUrl, // 🔥 이미지 주소를 문자열로 박제해서 보냄!
      // photos: []   // (선택사항) 용량을 줄이려면 원본 객체는 지워도 됨 (필수는 아님)
    };
  });



  try {
    const response = await axios.post("/py/optimize", {
      places: totalPlaces,
      days: scheduleData ? scheduleData.diffDays+1 : 3
      
    });
    const dayCount = scheduleData ? scheduleData.diffDays+1 : 3
    console.log(totalPlaces);

    console.log("📡 백엔드 응답 도착:", response.data);
    console.log("🔥 handleOptimize 실행됨 시작");

    const result = response.data?.optimized_places;
    console.log("📦 optimized_places(result):", result);

    const newItinerary = {};

    // 🔥 백엔드 구조가 [ [..], [..], [..] ] 이므로 이렇게 처리해야 함
    // const getDayPlaces = (index) => {
    //   const dayArr = result?.[index];
    //   return Array.isArray(dayArr) ? dayArr : [];
    // };

    for (let i = 0; i < dayCount; i++) {
      newItinerary[`day${i+1}`] = result?.[i] || [];
    }

    setItineraryByDay(newItinerary);
    setIsOptimized(true);
    alert(`${dayCount}일 코스로 최적화 완료!`);

  } catch (err) {
    console.log("❌ 최적화 중 오류 발생:", err);
    alert("백엔드 오류");
  }

  console.log("🔥 handleOptimize 끝까지 실행됨");
};

// 12/11 
const handleNearby = async () => {
  console.log("🍽️ handleNearby 실행 시작");

  // 1. 현재 일정이 있는지 확인
  if (!itineraryByDay || Object.keys(itineraryByDay).length === 0) {
    alert("최적화된 일정이 없습니다. 먼저 일정을 최적화해주세요.");
    return;
  }

  // 2. 데이터 전처리 (이중 리스트 구조 유지 [[Day1], [Day2]...])
  // 백엔드에서 enumerate로 요일별 구분을 하므로 이중 배열로 보내야 합니다.
  const formattedPlaces = Object.values(itineraryByDay).map((dayPlaces) => {
    return dayPlaces.map((place) => {
      // --- 이미지 URL 문자열 변환 로직 (handleOptimize와 동일) ---
      let finalUrl = place.photoUrl;

      // 구글맵 객체(함수)가 살아있는 경우 -> 실행해서 문자열로 변환
      if (
        !finalUrl &&
        place.photos &&
        place.photos.length > 0 &&
        typeof place.photos[0].getUrl === "function"
      ) {
        finalUrl = place.photos[0].getUrl({ maxWidth: 500, maxHeight: 500 });
      }

      return {
        ...place,
        photoUrl: finalUrl, // 문자열로 박제
        // photos: [] // 필요 시 원본 객체 제거
      };
    });
  });

  try {
    console.log("📤 백엔드로 보내는 데이터(formattedPlaces):", formattedPlaces);

    // 3. API 호출
    const response = await axios.post("/py/nearby", {
      places: formattedPlaces, // [[...], [...]] 형태
    });

    console.log("📡 백엔드 응답 도착(맛집):", response.data);

    // 4. 결과 처리
    const recommendations = response.data?.recommendations || [];
    console.log("😋 추천 맛집 리스트:", recommendations);

    // 5. 상태 업데이트 (맛집 리스트를 저장할 state가 있다고 가정)
    // 예: const [recommendations, setRecommendations] = useState([]);
    setRecommendedRestaurants(recommendations);
    
    if (recommendations.length > 0) {
      alert(`주변 맛집 ${recommendations.length}곳을 찾았습니다!`);
    } else {
      alert("주변에 추천할만한 맛집을 찾지 못했습니다.");
    }

  } catch (err) {
    console.error("❌ 맛집 검색 중 오류 발생:", err);
    alert("맛집 추천 기능을 수행하는 중 오류가 발생했습니다.");
  }

  console.log("🍽️ handleNearby 끝까지 실행됨");
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
    // setIsOptimized(false);
  };

  //12/12 수정 설문 작성 시 
  /* ============================================================
     🔥 [NEW] 페이지 진입 시 AI 코스 자동 생성
  ============================================================ */

  useEffect(() => {
    // 1. 데이터가 있고(generateRequest)
    // 2. 아직 데이터를 가져온 적이 없을 때(!hasFetched.current)만 실행
    if (generateRequest && !hasFetched.current) {
      hasFetched.current = true; // "나 이제 가져온다!"라고 깃발 꽂기
      fetchGeneratedCourse();
    }
  }, []); // 🔥 핵심: 의존성 배열을 비워서 '마운트 시 1회'만 실행하게 함

  const fetchGeneratedCourse = async () => {
    setIsLoading(true); // 로딩 시작
    try {
      console.log("🚀 1. 요청 시작:", generateRequest);
      
      // 반드시 post 요청
      const response = await axios.post("/py/generate", generateRequest);
      const result = response.data?.optimized_places; 
      
      console.log("✅ 2. 응답 도착:", response);

      const newItinerary = {};
      const days = generateRequest.days;
      
      for (let i = 0; i < days; i++) {
        newItinerary[`day${i+1}`] = result?.[i] || [];
      }
      
      console.log("📦 3. 데이터 매핑 완료");
      
      setItineraryByDay(newItinerary);
      setIsOptimized(true);
      setActiveTab('itinerary'); 
      
    } catch (err) {
      console.error("❌ 에러 발생:", err);
      alert("AI 코스 생성 중 오류가 발생했습니다."); 
    } finally {
      setIsLoading(false); // 로딩 끝
    }
  };
  /* ... handleManualSearch, handleOptimize 등 기존 함수들 유지 ... */


  // [로딩 화면] AI가 생성하는 동안 보여줄 간단한 UI


  // 저장하기 누르면 POST 동작하는지 확인할려고 만든 함수
  const handlePost = (e) => {
    axios
    .post('/sts/api/route', formToJSON)
    .then((result) => {
      if (result.data == '일정생성 성공'){
        alert('일정이 히스토리에 저장되었습니다!');
      }
      const routeInfo = {
        Id : form.id,
        Day_index : form.Day_index,
        Order_index : form.Order_ondex, 
        Place_name : form.Place_name,
        Place_id : form.Place_id
      }
      sessionStorage.setItem()
    })
  }

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
      handleNearby={handleNearby}


      activeTab={activeTab}
      setActiveTab={setActiveTab}

      searchResults={searchResults}
      setSearchResults={setSearchResults}

      nearbyGoogleRestaurants={nearbyGoogleRestaurants}
      setNearbyGoogleRestaurants={setNearbyGoogleRestaurants}
      recommendedRestaurants={recommendedRestaurants}

      itineraryByDay={itineraryByDay}
      setItineraryByDay={setItineraryByDay}

      handleManualSearch={handleManualSearch}
      addToItinerary={addToItinerary}

      handleOnDragEnd={handleOnDragEnd}
      handleOptimize={handleOptimize}
      removeFromItinerary={removeFromItinerary}

      isOptimized={isOptimized}
      setIsOptimized={setIsOptimized}
      mapCenter={mapCenter}
      showButton={showButton}
      setShowButton={setShowButton}

      DAY_COLORS={DAY_COLORS}
      API_KEY={API_KEY}
    />
  );
};

export default App;
