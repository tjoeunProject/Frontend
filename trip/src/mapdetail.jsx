import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import MapDetailPage from './pages/MapDetailPage.jsx'; 
import { useLocation, useParams } from 'react-router-dom';
import useRouteLogic from './pages/Route/useRouteLogic.jsx'; 

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const App = () => {
  // 1. URL 파라미터 및 Location 정보
  const { id } = useParams();
  const location = useLocation();
  const detailId = id || location.state?.detailId;

  // 🔍 [로그] 진입 시 ID 확인
  console.log("🚀 [App 진입] URL 파라미터 id:", id);
  console.log("🚀 [App 진입] location.state:", location.state);
  console.log("🚀 [App 진입] 결정된 detailId:", detailId);

  // 🔥 [Hook 사용] useRouteLogic에서 필요한 함수와 상태를 가져옵니다.
  const { 
    handleGetRouteDetail, 
    schedules: hookSchedule, 
    title: hookTitle,
    startDate: hookStartDate,
    endDate: hookEndDate
  } = useRouteLogic();

  // 🔍 [로그] 훅에서 가져온 초기 상태 확인
  // (이 로그는 렌더링 될 때마다 찍히므로 데이터 들어오기 전/후 비교 가능)
  // console.log("🎣 [Hook 상태 모니터링]", { hookTitle, hookStartDate, scheduleLength: hookSchedule?.length });

  // -----------------------------------------------------------------
  // [State] MapDetailPage에 넘겨줄 상태들
  // -----------------------------------------------------------------
  const [scheduleData, setScheduleData] = useState(location.state?.schedules || null);
  const [itineraryByDay, setItineraryByDay] = useState({});
  const [isOptimized, setIsOptimized] = useState(false);
  
  const [activeTab, setActiveTab] = useState('search');
  const [searchResults, setSearchResults] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 37.5551, lng: 126.9707 });
  const [showButton, setShowButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchKeyword = location.state?.searchKeyword; 
  const DAY_COLORS = ["#FF0000", "#2196F3", "#4CAF50"];

  // ============================================================
  // 🛠️ [Helper] 날짜 차이 계산
  // ============================================================
  const calculateDiffDays = (start, end) => {
    if (!start || !end) return 1; 
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e - s);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
  };

  // ============================================================
  // 📡 [Effect 1] 상세 정보 요청 (useRouteLogic 활용)
  // ============================================================
  useEffect(() => {
    const fetchData = async () => {
      if (detailId) {
        setIsLoading(true);
        try {
          console.log(`📡 [API 요청 시작] handleGetRouteDetail 호출! ID: ${detailId}`);
          
          // 훅의 함수 호출 -> 훅 내부 상태(hookSchedule 등)가 업데이트됨
          await handleGetRouteDetail(detailId);
          
          console.log("✅ [API 요청 성공] handleGetRouteDetail 완료");
        } catch (error) {
          console.error("❌ [API 요청 실패] 데이터 로딩 에러:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.warn("⚠️ [API 요청 스킵] detailId가 없습니다.");
      }
    };
    fetchData();
  }, [detailId]);

  // ============================================================
  // 🔄 [Effect 2] 훅의 상태가 변하면 -> App 상태로 변환 (Sync)
  // ============================================================
  useEffect(() => {
    // 훅에서 데이터가 들어왔는지 확인하는 로그
    console.log("👀 [Sync Effect 감지] Hook 상태 변경됨:", { 
        title: hookTitle, 
        start: hookStartDate, 
        scheduleLen: hookSchedule?.length 
    });

    if (hookTitle && hookStartDate && hookEndDate) {
      console.log("📦 [데이터 변환 시작] 훅 데이터 -> App State 변환 중...");

      // 1. scheduleData (제목, 날짜) 업데이트
      if (!scheduleData || scheduleData.title !== hookTitle) {
        const diff = calculateDiffDays(hookStartDate, hookEndDate) - 1;
        console.log(`📅 [날짜 계산] 차이: ${diff}일`);
        
        setScheduleData({
          title: hookTitle,
          startDate: hookStartDate,
          endDate: hookEndDate,
          diffDays: diff
        });
      }

      // 2. Schedule(배열) -> ItineraryByDay(객체) 변환
      const newItinerary = {};
      
      hookSchedule.forEach((dayList, index) => {
        const dayKey = `day${index + 1}`;
        
        newItinerary[dayKey] = dayList.map(place => {
          // 이미지 URL 생성 로직
          let photoUrl = null;
          if (place.photoReferences && place.photoReferences.length > 0) {
             photoUrl = `https://places.googleapis.com/v1/${place.photoReferences[0]}/media?maxWidthPx=400&key=${API_KEY}`;
          }

          return {
            id: place.place_id || place.id, 
            name: place.name,
            address: place.formatted_address,
            lat: place.lat,
            lng: place.lng,
            reviews: place.rating,
            photoUrl: photoUrl, 
            type: 'saved'
          };
        });
      });

      console.log("✅ [최종 변환 완료] newItinerary:", newItinerary);

      setItineraryByDay(newItinerary);
      setIsOptimized(true);
      setActiveTab('itinerary');

      // 지도 중심 이동 (첫 번째 장소)
      if (newItinerary.day1 && newItinerary.day1.length > 0) {
        console.log("📍 [지도 이동] 첫 번째 장소로 이동:", newItinerary.day1[0]);
        setMapCenter({ lat: newItinerary.day1[0].lat, lng: newItinerary.day1[0].lng });
      }
    }
  }, [hookSchedule, hookTitle, hookStartDate, hookEndDate]);


  if (isLoading || (detailId && !scheduleData)) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
        <h2 style={{color: '#333'}}>✈️ 여행 정보를 불러오는 중입니다...</h2>
        <div className="loading-spinner" style={{ marginTop: '20px', width: '40px', height: '40px', border: '4px solid #ddd', borderTop: '4px solid #7C97FE', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <MapDetailPage
      scheduleData={scheduleData}
      initialSearchKeyword={searchKeyword}
      
      activeTab={activeTab}
      setActiveTab={setActiveTab}

      searchResults={searchResults}
      setSearchResults={setSearchResults}

      itineraryByDay={itineraryByDay}
      setItineraryByDay={setItineraryByDay}



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