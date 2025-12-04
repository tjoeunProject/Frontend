import React, { useEffect, useRef } from 'react';
import { useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import './SearchBox.css';

const SearchBox = ({ onPlaceSelect }) => {
  const inputRef = useRef(null);
  const places = useMapsLibrary('places');
  const map = useMap();

  /* ----------------------------------------
     Autocomplete
  ---------------------------------------- */
  useEffect(() => {
    if (!places || !inputRef.current) return;
                                        
    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ['name', 'geometry', 'place_id', 'rating', 'user_ratings_total', 'photos', 'formatted_address'],
      types: ['establishment'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      // ❗ geometry 없는 place는 다시 findPlaceFromQuery로 강제 검색
      if (!place.geometry) return forceFind(place.name);

      onPlaceSelect(place);
      inputRef.current.value = "";
    });
  }, [places]);

  /* ----------------------------------------
     엔터 검색 (Intro와 완전 동일 구조로 강제)
  ---------------------------------------- */
  const handleEnterSearch = (e) => {
    if (e.key !== 'Enter') return;

    e.preventDefault();
    forceFind(inputRef.current.value.trim());
  };


  /* ----------------------------------------
     Intro 검색 방식으로 강제 findPlaceFromQuery 실행
  ---------------------------------------- */
  const forceFind = (query) => {
  if (!query || !places || !map) return;

  const service = new places.PlacesService(map);

  // 1) place_id만 가져옴
  service.findPlaceFromQuery(
    {
      query,
      fields: ["place_id"],
    },
    (results, status) => {
      if (
        status !== places.PlacesServiceStatus.OK ||
        !results ||
        results.length === 0
      ) {
        console.log("❌ forceFind: 검색 실패", query);
        return;
      }

      const placeId = results[0].place_id;

      // 2) place_id로 getDetails 실행
      service.getDetails(
        {
          placeId,
          fields: [
            "name",
            "geometry",
            "formatted_address",
            "place_id",
            "rating",
            "user_ratings_total",
            "photos",
          ],
        },
        (detail, detailStatus) => {
          if (
            detailStatus === places.PlacesServiceStatus.OK &&
            detail
          ) {
            onPlaceSelect(detail);
            inputRef.current.value = "";
          } else {
            console.log("❌ getDetails 실패");
          }
        }
      );
    }
  );
};



  return (
    <div className="searchbox-container">
      <input
        ref={inputRef}
        placeholder="가고 싶은 장소를 검색해주세요! (ex: 해운대)"
        className="searchbox-input"
        onKeyDown={handleEnterSearch}
      />
    </div>
  );
};

export default SearchBox;
