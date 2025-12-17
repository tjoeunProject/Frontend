import React, { useEffect, useState } from "react";
import {
  fetchSeasonCandidates,
  sortAndSelectTop10,
  enrichPlaces,
  getSeason
} from "../../lib/rankingUtils";

import "../../resources/css/RankingPage.css";
import { useNavigate } from "react-router-dom";

const RankingComponent = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [seasonName, setSeasonName] = useState("");

  // 펼쳐진 리뷰들의 ID를 저장하는 Set
  const [expandedIds, setExpandedIds] = useState(new Set());

  // "일정에 담기" 버튼 클릭 핸들러
  const handleAddToItinerary = (e, place) => {
    e.stopPropagation(); // 부모 클릭 이벤트(리뷰 토글) 방지

    // 좌표 정보 확인
    // (place.lat이 이미 있으면 그것을 쓰고, 없으면 geometry에서 확인)
    const hasLocation = place.lat || (place.geometry && place.geometry.location);

    if (!hasLocation) {
      alert("위치 정보를 불러오지 못해 지도에 추가할 수 없습니다.");
      return;
    }

    if (window.confirm(`"${place.name}"을(를) 지도에 추가하시겠습니까?`)) {
      
      // 🔥 [핵심 수정] MapPage가 사용하는 이름으로 데이터 매핑 (별명 달아주기)
      const placeData = {
        place_id: place.place_id,
        name: place.name,
        
        // 1. 주소 데이터 매핑 (MapPage는 vicinity를 찾을 확률이 높음)
        formatted_address: place.formatted_address,
        vicinity: place.formatted_address, // 주소 정보를 vicinity에도 넣어줌
        addr: place.formatted_address,     // 혹시 모르니 addr에도 넣어줌
        
        rating: place.rating,
        
        // 2. 리뷰 개수 데이터 매핑 (MapPage는 reviews를 숫자로 쓸 확률이 높음)
        user_ratings_total: place.user_ratings_total,
        reviews: place.user_ratings_total, // 리뷰 개수를 reviews에도 넣어줌
        
        photoUrl: place.photoUrl,
        
        // 좌표값 추출
        lat: place.lat || (place.geometry.location.lat && place.geometry.location.lat()) || 0,
        lng: place.lng || (place.geometry.location.lng && place.geometry.location.lng()) || 0
      };
      
      navigate("/map", { state: { placeToAdd: placeData } });

    }
  };
  useEffect(() => {
    // 현재 계절 이름 가져오기 (타이틀용)
    const s = getSeason();
    const seasonMap = { spring: "봄", summer: "여름", autumn: "가을", winter: "겨울" };
    setSeasonName(seasonMap[s]);

    const loadRanking = async () => {
      try {
        setLoading(true);
        setError("");

        await loadGoogleScript();

        const candidates = await fetchSeasonCandidates();
        const top10 = sortAndSelectTop10(candidates);
        const detailed = await enrichPlaces(top10);

        setPlaces(detailed);
      } catch (err) {
        console.error(err);
        setError("랭킹 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadRanking();
  }, []);

  // 리뷰 클릭 시(... 클릭 시) 펼침/접힘 토글 함수
  const toggleReview = (id) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id); // 이미 펼쳐져 있으면 제거 (접기)
      } else {
        newSet.add(id);    // 없으면 추가 (펼치기)
      }
      return newSet;
    });
  };

  return (
    <div className="ranking-container">
      {/* 헤더 디자인 변경 */}
      <h2 className="ranking-title">
        지금 가장 HOT 🔥 한 {seasonName} 여행지 TOP 10
      </h2> 

      {loading && <p className="loading-text">데이터를 분석 중입니다...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <div className="ranking-grid">
          {places.map((p, index) => {
            const isExpanded = expandedIds.has(p.place_id);

            return (
              <div key={p.place_id} className="ranking-item">
                {/* 왼쪽: 텍스트 정보 */}
                <div className="ranking-info">
                  <div className="ranking-header-row">
                    <span className="ranking-rank">{index + 1}</span>
                    <h3 className="ranking-name">{p.name}</h3>
                    {/* 일정 담기 버튼 */}
                    <button 
                      className="btn-rank-add"
                      onClick={(e) => handleAddToItinerary(e, p)}
                    >
                      🗺️ 지도에서 보기
                    </button>
                  </div>

                  <p
                    className={`ranking-desc ${isExpanded ? "expanded" : ""}`}
                    onClick={() => toggleReview(p.place_id)}
                    title="클릭하면 리뷰 전체를 볼 수 있습니다."
                  >
                    {p.review || "등록된 한줄평이 없습니다."}
                  </p>

                  <div className="ranking-meta">
                    <span className="star">★</span>
                    <span className="rating-score">{p.rating || "0.0"}</span>
                    <span className="review-count">({p.user_ratings_total})</span>
                    {/* 주소 간략화 (앞 두 단어만) */}
                    <span className="location-text">
                      {p.formatted_address
                        ? p.formatted_address.split(" ").slice(1, 3).join(" ")
                        : "위치 정보 없음"}
                    </span>
                  </div>
                </div>

                {/* 오른쪽: 이미지 */}
                <div className="ranking-img-box">
                  {p.photoUrl ? (
                    <img src={p.photoUrl} alt={p.name} className="ranking-img" />
                  ) : (
                    <div className="no-img">No Image</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* Google Maps Script 로더 */
const loadGoogleScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }&libraries=places`;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

export default RankingComponent;