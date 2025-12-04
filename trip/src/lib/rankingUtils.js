
/* 1) 계절 계산 */
export const getSeason = () => {
  const m = new Date().getMonth() + 1;
  if ([12, 1, 2].includes(m)) return "winter";
  if ([3, 4, 5].includes(m)) return "spring";
  if ([6, 7, 8].includes(m)) return "summer";
  return "autumn";
};

/* 2) 계절별 키워드 */
export const seasonKeywords = {
  winter: ["겨울 여행지", "눈 명소", "온천", "스키장"],
  spring: ["봄 여행지", "벚꽃 명소"],
  summer: ["여름 여행지", "바다 여행지"],
  autumn: ["가을 여행지", "단풍 명소"],
};

/* 3) PlacesService TextSearch */
const textSearch = (keyword) => {
  return new Promise((resolve) => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.textSearch(
      {
        query: keyword,
        language: "ko",
        region: "KR",
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve(results);
        } else {
          resolve([]);
        }
      }
    );
  });
};

/* 4) 계절 기반 후보 수집 */
export const fetchSeasonCandidates = async () => {
  const season = getSeason();
  const keys = seasonKeywords[season];

  let all = [];

  for (const kw of keys) {
    const results = await textSearch(kw);
    all = all.concat(results);
  }

  // 중복 제거
  const map = {};
  all.forEach((p) => (map[p.place_id] = p));

  return Object.values(map);
};

/* 5) 인기 점수 정렬 */
export const sortAndSelectTop10 = (places) => {
  const ranked = places.map((p) => {
    const rating = p.rating || 0;
    const count = p.user_ratings_total || 0;

    const score = rating * Math.log(1 + count);

    return { ...p, score };
  });

  return ranked.sort((a, b) => b.score - a.score).slice(0, 10);
};

/* 6) Places Details API */
export const fetchDetails = (placeId) => {
  return new Promise((resolve) => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails(
      {
        placeId,
        fields: [
          "name",
          "formatted_address",
          "photos",
          "rating",
          "user_ratings_total",
          "reviews",
        ],
        language: "ko",
      },
      (result, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve(result);
        } else {
          resolve(null);
        }
      }
    );
  });
};

/* 7) 사진 URL 변환 */
const makePhotoUrl = (photoObj) => {
  if (!photoObj) return null;

  return photoObj.getUrl({ maxWidth: 600 });
};

/* 8) 상세 정보 보강 */
export const enrichPlaces = async (places) => {
  const list = [];

  for (const p of places) {
    const detail = await fetchDetails(p.place_id);

    if (!detail) {
      list.push(p);
      continue;
    }

    list.push({
      ...p,
      formatted_address: detail.formatted_address,
      rating: detail.rating,
      user_ratings_total: detail.user_ratings_total,
      photoUrl: makePhotoUrl(detail.photos?.[0]),
      review: detail.reviews?.[0]?.text || "한줄평 없음",
    });
  }

  return list;
};
