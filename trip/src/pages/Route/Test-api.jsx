import React, { useEffect, useState } from "react";
import useRouteLogic from "./useRouteLogic"; // 경로 맞게 수정

export default function RouteTestPage() {
  const {
    title, setTitle,
    startDate, setStartDate,
    endDate, setEndDate,
    schedule, addPlaceToDay,

    myRoutes, currentRoute,

    // ✅ 이거 빠져서 너 코드가 터짐
    handleCreateRoute,
    handleGetMyRoutes,
    handleGetRouteDetail,
    handleDeleteRoute,
  } = useRouteLogic();

  const [detailId, setDetailId] = useState("");

  // 페이지 들어오면 목록 조회 1번
  useEffect(() => {
    handleGetMyRoutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addDummyPlace = () => {
    // schedule[0]이 없을 수도 있으니 안전하게
    const dayIndex = 0;
    addPlaceToDay(dayIndex, {
      place_id: "ChIJc-9ZJjSifDURK8X4a1gY1Z0", // ✅ 실제 구글 place_id로 바꿔야 PlaceDetails가 안 비어있음
      name: "서울시청",
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Route API 테스트 페이지</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <input
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button onClick={addDummyPlace}>1일차 더미 장소 추가</button>
        <button onClick={handleCreateRoute}>일정 생성(POST)</button>
        <button onClick={handleGetMyRoutes}>내 일정 목록 조회(GET)</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="상세조회 routeId"
          value={detailId}
          onChange={(e) => setDetailId(e.target.value)}
        />
        <button onClick={() => handleGetRouteDetail(Number(detailId))}>
          상세 조회(GET)
        </button>

        <button onClick={() => handleDeleteRoute(Number(detailId))}>
          삭제(DELETE)
        </button>
      </div>

      <hr />

      <h3>현재 schedule</h3>
      <pre>{JSON.stringify(schedule, null, 2)}</pre>

      <h3>내 일정 목록 myRoutes</h3>
      <pre>{JSON.stringify(myRoutes, null, 2)}</pre>

      <h3>상세 currentRoute</h3>
      <pre>{JSON.stringify(currentRoute, null, 2)}</pre>
    </div>
  );
}
