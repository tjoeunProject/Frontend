import React, { useEffect, useState } from "react";
import {
  fetchSeasonCandidates,
  sortAndSelectTop10,
  enrichPlaces,
} from "../../lib/rankingUtils";

import "../../resources/css/RankingPage.css";

const RankingComponent = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRanking = async () => {
      try {
        setLoading(true);
        setError("");

        // Google API 로드
        await loadGoogleScript();

        // 1) 계절별 후보 장소 수집
        const candidates = await fetchSeasonCandidates();

        // 2) 인기 점수 기반 Top10 정렬
        const top10 = sortAndSelectTop10(candidates);

        // 3) 상세 정보 보강
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

  return (
    <div className="ranking-container">
      <h2 className="ranking-title">"관광지 TOP 10"</h2>

      {loading && <p className="loading-text">불러오는 중...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="ranking-grid">
        {!loading &&
          !error &&
          places.map((p, index) => (
            <div key={p.place_id} className="ranking-card">
              <h3 className="ranking-name">
                {index + 1}. {p.name}
                <span className="heart">
                  ⭐{p.rating} ({p.user_ratings_total})
                </span>
              </h3>

              {p.photoUrl ? (
                <img src={p.photoUrl} className="ranking-img" />
              ) : (
                <div className="no-img ranking-img">이미지 없음</div>
              )}

              <p className="ranking-location">{p.formatted_address}</p>
              <p className="ranking-tag"># {p.review || "한줄평 없음"}</p>
            </div>
          ))}
      </div>
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
