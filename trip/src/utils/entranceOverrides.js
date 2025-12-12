// src/utils/entranceOverrides.js

/**
 * 특정 장소는 "정문/출입구"가 경로 품질에 매우 큰 영향을 준다.
 * placeId(googlePlaceId) 기반으로 출입구 좌표를 강제로 지정할 수 있다.
 *
 * 사용 방법:
 * 1) Places 저장 시 googlePlaceId를 place 객체에 포함한다.
 * 2) 아래 overrides에 해당 placeId를 키로 추가한다.
 *
 * 주의:
 * - 여기 좌표는 예시다. 너희 프로젝트에서 실제 placeId/출입구 좌표로 교체해야 한다.
 * - "전부 수동"이 아니라 "진짜 큰 곳만" 최소한으로 넣는 용도다.
 */

export const entranceOverrides = {
  // 예시: 경복궁 (placeId는 예시임, 실제 Google Place ID로 교체해야 함)
  // "ChIJ...": {
  //   name: "경복궁",
  //   entrances: [
  //     { lat: 37.579617, lng: 126.977041, label: "광화문" },
  //     { lat: 37.577928, lng: 126.981006, label: "국립고궁박물관 쪽" }
  //   ]
  // },

  // 예시: 창덕궁
  // "ChIJ...": {
  //   name: "창덕궁",
  //   entrances: [
  //     { lat: 37.579431, lng: 126.991059, label: "돈화문" }
  //   ]
  // }
};
