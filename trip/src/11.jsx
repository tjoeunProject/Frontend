import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./pages/Login/AuthContext.jsx"; // 경로 맞게 조정
import useRouteLogic from './pages/Route/useRouteLogic';

function TestRouteCreate() {
  const [message, setMessage] = useState("아직 요청 안 함");
  const navigate = useNavigate();

  // AuthContext에 토큰 저장/조회가 있으면 그걸 쓰는 게 제일 좋음
  // (없으면 localStorage에서 읽어도 됨)
  const { isLoggedIn } = useAuth();

  const handleTest = async () => {
    try {
      // ✅ 로그인 체크
      if (!isLoggedIn) {
        alert("로그인 후 이용 가능합니다.");
        navigate("/login");
        return;
      }

      const token = localStorage.getItem("access_token"); 
      if (!token) {
        alert("토큰이 없습니다. 다시 로그인 해주세요.");
        navigate("/login");
        return;
      }

      setMessage("요청 중...");

      // ✅ 너 프로젝트에 맞게 URL 통일
      // - 프론트 proxy가 /sts로 잡혀있으면 유지
      // - 아니면 "/api/route"로 바꿔
      const response = await fetch("/sts/api/route/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ 철자 정확히
        },
        body: JSON.stringify(
{
  "memberId": 1,
  "title": "서울 1일 여행",
  "startDate": "2025-01-10",
  "endDate": "2025-01-10",
  "places": [
    [
      {
        "placeId": "ChIJc-9ZJjSifDURK8X4a1gY1Z0",
        "placeName": "경복궁"
      }
    ]
  ]
}

),
      });

      // ✅ 에러일 때 서버가 text로 줄 수도 있어서 안전 처리
      const contentType = response.headers.get("content-type") || "";
      const payload = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        throw new Error(
          typeof payload === "string"
            ? `HTTP ${response.status} - ${payload}`
            : `HTTP ${response.status} - ${JSON.stringify(payload)}`
        );
      }

      // 성공 응답이 routeId(Long)일 수도 있고 {id: ...}일 수도 있음
      const routeId =
        typeof payload === "number"
          ? payload
          : typeof payload === "string"
          ? payload
          : payload?.id ?? payload;

      setMessage(`✅ 일정 생성 성공! routeId = ${routeId}`);
    } catch (err) {
      console.error(err);
      setMessage(`❌ 실패: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <useRouteLogic/>
      <h2>Route 생성 테스트</h2>
      <button onClick={handleTest}>POST /api/route 테스트</button>
      <p>{message}</p>
    </div>
  );
}

export default TestRouteCreate;
