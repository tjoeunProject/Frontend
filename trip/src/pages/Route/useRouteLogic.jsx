import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react'; // import 추가 필요


// =====================================================================
// 1. [Axios 인스턴스 설정]
// =====================================================================
// 반복되는 서버 URL과 헤더 설정을 미리 정의해두는 곳입니다.

// 12/12 수정
const token = localStorage.getItem("access_token"); 

const simpleAxios = axios.create({
  baseURL: '/sts/api/route', 
  
  // JSON 형식으로 데이터를 주고받겠다는 약속
  headers: { 'Content-Type': 'application/json', 
    // 12/12 수정
    'Authorization' : `Bearer ${token}`, // ✅ 철자 정확히
  }
});

// =====================================================================
// 2. [API 서비스 객체]
// =====================================================================
// 컴포넌트 내부 로직과 API 호출 코드를 분리하여 깔끔하게 관리합니다.

// simpleAxios의 baseURL 덕분에 URL 앞부분('/sts/api/route')을 생략할 수 있습니다.
const api = {
  // [POST] 일정 생성: 데이터(DTO)를 body에 담아 보냄 -> 생성된 ID 반환
  createRoute: (data) => simpleAxios.post('', data).then(res => res.data),

  // data 형태 -> createPayload 임(객체)

  // [GET] 일정 상세 조회: ID로 특정 여행 일정을 가져옴
  getRouteDetail: (id) => simpleAxios.get(`/${id}`).then(res => res.data),

  // [GET] 내 일정 목록: 특정 유저(memberId)의 모든 여행 리스트 조회
  getMyRoutes: (memberId) => simpleAxios.get(`/member/${memberId}`).then(res => res.data),

  // [PUT] 일정 수정: ID와 수정할 데이터를 보냄
  updateRoute: (id, data) => simpleAxios.put(`/${id}`, data).then(res => res.data),

  // [DELETE] 일정 삭제: ID에 해당하는 일정 삭제
  deleteRoute: (id) => simpleAxios.delete(`/${id}`).then(res => res.data),
};

// =====================================================================
// 3. [Custom Hook: useRouteLogic]
// =====================================================================
// 비즈니스 로직(Logic)을 분리

// 컴포넌트는 이 Hook이 뱉어주는 함수와 변수만 가져다 쓰면 됩니다.
const useRouteLogic = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 Hook

  // -------------------------------------------------------------------
  // [State 관리]
  // -------------------------------------------------------------------
  const [title, setTitle] = useState('');       // 여행 제목
  const [startDate, setStartDate] = useState(''); // 여행 시작일 (YYYY-MM-DD)
  const [endDate, setEndDate] = useState('');     // 여행 종료일 (YYYY-MM-DD)
  
  // ★ [핵심 데이터 구조: 2차원 배열]
  // 여행 일정은 "여러 날(Day)"과 각 날짜의 "여러 장소(Place)"로 구성됩니다.
  // schedule[0] -> 1일차 장소 목록 배열
  // schedule[1] -> 2일차 장소 목록 배열
  // 초기값: [ [] ] (1일차만 있고 장소는 없는 상태)
  const [schedule, setSchedule] = useState([ [] ]); 
  
  // 목록 조회 시 받아온 리스트 데이터 저장소
  const [myRoutes, setMyRoutes] = useState([]);

  // 상세 조회 시 받아온 현재 보고 있는 여행 데이터 원본
  const [currentRoute, setCurrentRoute] = useState(null);

  // TODO: 실제 구현 시에는 로그인 컨텍스트(AuthContext)나 세션에서 가져와야 함
  const memberId = 1; 

  // -------------------------------------------------------------------
  // [UI Helper Functions] 화면 조작을 도와주는 함수들
  // -------------------------------------------------------------------
  
  // [추가] 날짜가 변경되면 자동으로 schedule 배열 길이를 맞추는 로직
  useEffect(() => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // 날짜 차이 계산 (밀리초 단위 계산 -> 일 단위 변환)
    const diffTime = end.getTime() - start.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24) + 1; // +1을 해야 당일치기도 1일이 됨

    if (diffDays > 0) {
        setSchedule((prevSchedule) => {
        // 1. 현재 일정 배열의 길이
        const currentLength = prevSchedule.length;

        // 2. 날짜가 늘어난 경우: 빈 배열 추가
        if (diffDays > currentLength) {
            const newDays = Array(diffDays - currentLength).fill([]);
            return [...prevSchedule, ...newDays];
        }
        
        // 3. 날짜가 줄어든 경우: 뒷부분 자르기 (주의: 작성한 내용이 날아갈 수 있음)
        if (diffDays < currentLength) {
            return prevSchedule.slice(0, diffDays);
        }

        // 4. 같은 경우: 유지
        return prevSchedule;
        });
    }
  }, [startDate, endDate]); // 시작일이나 종료일이 바뀔 때마다 실행됨


  // Day 추가 버튼 클릭 시: 빈 배열을 하나 더 추가하여 날짜를 늘림 / 사용안할거같아서 주석처리 
//   const addDay = () => setSchedule([...schedule, []]);

  // 특정 Day에 장소 추가:
  // dayIndex: 몇 번째 날인지 (0부터 시작)
  // googlePlace: 구글 지도 API에서 선택한 장소 객체 (전체 정보 포함)
  const addPlaceToDay = (dayIndex, googlePlace) => {
    const newSchedule = [...schedule]; // 불변성 유지를 위해 복사
    newSchedule[dayIndex] = [...newSchedule[dayIndex], googlePlace]; // 해당 날짜 배열에 장소 추가
    setSchedule(newSchedule); // 상태 업데이트
  };

  // -------------------------------------------------------------------
  // [Data Transformation Helper] ★ 프론트엔드 -> 백엔드 변환
  // -------------------------------------------------------------------
  // 백엔드 API(DTO) 스펙에 맞춰 데이터를 가공하는 함수입니다.
  // 프론트엔드의 googlePlace 객체는 너무 방대하므로, DB 저장에 필요한 핵심만 추립니다.
  const createPayload = () => {
    return {
      memberId,
      title,
      startDate,
      endDate,
      // 2차원 배열 구조(Day -> Place)를 유지하면서 매핑
      places: schedule.map(dayList => 
        dayList.map(place => ({
          // ★ Google Place 객체에서 필요한 정보만 추출
          // 백엔드 Entity의 필드명과 일치시켜야 함
          placeId: place.place_id, // 구글 고유 ID (가장 중요)
          placeName: place.name    // 장소 이름
          // 필요하다면 lat, lng, address 등도 여기서 추가해서 보냄
        }))
      )
    };
  };
  // 데이터 받고 저장할 준비하는 객체

  // -------------------------------------------------------------------
  // [Event Handlers] 실제 기능 동작 함수들
  // -------------------------------------------------------------------

  // 1. [Create] 일정 저장
  const handleCreateRoute = () => {
    // 유효성 검사: 필수 입력값 체크
    if (!title || !startDate || !endDate) {
      alert("기본 정보를 입력해주세요.");
      return;
    }

    // 변환된 데이터(payload)를 API로 전송
    api.createRoute(createPayload())
      .then((newRouteId) => {
        alert("일정이 저장되었습니다!");
        // 저장이 완료되면 상세 페이지로 이동 (UX 고려)
        navigate(`/route/detail/${newRouteId}`);
      })
      .catch((err) => {
        console.error(err);
        alert("저장 실패: 서버 에러가 발생했습니다.");
      });
  };

  // 2. [Read - Detail] 상세 조회 및 데이터 복원 ★ 중요
  const handleGetRouteDetail = (routeId) => {
    // route id 를 통하여 루트 조회(및 루트에 속한 Place 들도 조회)
    api.getRouteDetail(routeId)
    // data -> route 
      .then((data) => {
        // 백엔드에서 받은 데이터를 State에 세팅
        // Route 테이블을 가져온거임 
        setCurrentRoute(data);
        setTitle(data.title);
        setStartDate(data.startDate);
        setEndDate(data.endDate);

        // ★ [데이터 역변환: 백엔드 DTO -> 프론트엔드 객체]
        // 백엔드는 Google Place의 모든 정보를 저장하지 않을 수도 있고, 필드명이 다를 수 있습니다.
        // 프론트엔드 컴포넌트들이 기존 Google Place 객체 형식을 기대하고 있다면,
        // 여기서 그 형식에 맞게 다시 만들어줘야 에러가 안 납니다.
        const restoredSchedule = data.places.map(dayList => 
          dayList.map(dto => ({
            // 프론트엔드에서 사용하는 이름 : 백엔드 DTO의 이름
            place_id: dto.googlePlaceId,       // Google ID 복원
            name: dto.name,                    // 이름 복원
            formatted_address: dto.formattedAddress, // 주소
            location: { lat: dto.lat, lng: dto.lng }, // 좌표 객체 재조립
            rating: dto.rating ,                // 별점
            user_ratings_total: dto.userRatingsTotal, // [추가] 총 리뷰 수
            types: dto.types,                         // [추가] 장소 타입 (예: ['cafe', 'food'])
            html_attributions: dto.htmlAttributions ? [dto.htmlAttributions] : [], // [추가] 저작권 정보 (배열 형태 권장)
            photos: dto.photoReferences,       // 사진 정보
            // 7. 순서 (순서)
            orderIndex: dto.orderIndex
            // 이 구조가 addPlaceToDay에서 넣는 googlePlace 객체와 최대한 비슷해야 함
          }))
        );
        
        setSchedule(restoredSchedule); // 복원된 스케줄로 상태 업데이트
      })
      .catch((err) => console.error("상세 정보 조회 실패", err));
  };
// 데이터를 받아 지도에 띄우는 함수 



  // 3. [Read - List] 내 여행 목록 조회
  const handleGetMyRoutes = () => {
    api.getMyRoutes(memberId)
      .then((list) => setMyRoutes(list)) // 리스트 상태 업데이트
      .catch((err) => console.error("목록 조회 실패", err));
  };

  

  // 4. [Delete] 일정 삭제
  const handleDeleteRoute = (routeId) => {
    if(window.confirm("정말 삭제하시겠습니까? 복구할 수 없습니다.")) {
      api.deleteRoute(routeId)
        .then(() => {
          alert("삭제되었습니다.");
          window.location.reload(); // ✅ F5 느낌 (전체 새로고침)
        })
        .catch(err => alert("삭제 실패"));
    }
  };

  // -------------------------------------------------------------------
  // [Return] 컴포넌트로 내보낼 값과 함수들
  // -------------------------------------------------------------------
  return {
    // State 변수들 (화면에 보여줄 데이터)
    title, setTitle,
    startDate, setStartDate,
    endDate, setEndDate,
    schedule,       // 현재 작성/조회 중인 일정 (2차원 배열)
    myRoutes,       // 내 여행 목록 리스트
    currentRoute,   // 상세 조회된 원본 데이터

    // Helper 함수들 (UI 조작용)
    // addDay,
    addPlaceToDay,

    // API 연동 함수들 (이벤트 핸들러용)
    handleCreateRoute,  // 1. [Create] 일정 저장
    handleGetRouteDetail, // 2. [Read - Detail] 상세 조회 및 데이터 복원 ★ 중요
    handleGetMyRoutes,  // 3. [Read - List] 내 여행 목록 조회
    handleDeleteRoute // 4. [Delete] 일정 삭제
  };
};

export default useRouteLogic;