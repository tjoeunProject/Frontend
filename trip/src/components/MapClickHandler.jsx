// components/MapClickHandler.jsx
import { useEffect } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

const MapClickHandler = ({ onPlaceSelect }) => {
  const map = useMap();
  const placesLib = useMapsLibrary("places");

  useEffect(() => {
    if (!map || !placesLib) return;

    // 지도 클릭 이벤트 리스너 등록
    const listener = map.addListener('click', (event) => {
      // 1. 기본 말풍선 방지
      event.stop();

      // -------------------------------------------------
      // 케이스 A: POI(장소 아이콘) 클릭
      // -------------------------------------------------
      if (event.placeId) {
        console.log("POI 클릭됨:", event.placeId);
        
        const service = new placesLib.PlacesService(map);
        service.getDetails(
          {
            placeId: event.placeId,
            fields: [
              "place_id", "name", "geometry", "formatted_address", 
              "rating", "user_ratings_total", "photos", "types"
            ],
          },
          (place, status) => {
            if (status === placesLib.PlacesServiceStatus.OK && place) {
              const newPlace = {
                id: place.place_id,
                name: place.name,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                formatted_address: place.formatted_address,
                rating: place.rating || 0,
               reviews: place.user_ratings_total || 0,
                //  user_ratings_total 로 하다가 리뷰수 안받아져서 확인결과 key 값 잘못되어 reviews 로 변경 
                photos: place.photos,
                types: place.types,
                isPOI: true
              };
              
              // 부모에게 전달 (addToItinerary)
              onPlaceSelect(newPlace);
              alert(`'${newPlace.name}' 장소를 일정에 추가했습니다!`);
            }
          }
        );
      }
      // -------------------------------------------------
      // 케이스 B: 빈 땅 클릭
      // -------------------------------------------------
      else if (event.latLng) {
        console.log("빈 땅 클릭됨");
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        // 🔥 1. 이름을 입력받는 팝업창 띄우기
        const userInput = window.prompt("이 장소의 이름을 입력해주세요:", "나만의 장소");

        // 🔥 2. '취소'를 눌렀다면 추가하지 않음
        if (userInput === null) return;

        // 🔥 3. 입력값이 없으면 기본값 사용, 있으면 입력값 사용
        const placeName = userInput.trim() === "" ? "사용자 지정 위치" : userInput;

        const customPlace = {
          id: `custom-${Date.now()}`,
          name: placeName,
          lat: lat,
          lng: lng,
          formatted_address: "지도에서 선택된 위치",
          rating: 0,
          user_ratings_total: 0,
          photos: [],
          isPOI: false
        };

        onPlaceSelect(customPlace);
      }
    });

    // 컴포넌트 사라질 때 리스너 제거 (필수)
    return () => listener.remove();

  }, [map, placesLib, onPlaceSelect]);

  return null; // 화면에 아무것도 그리지 않음 (로직만 담당)
};

export default MapClickHandler;
