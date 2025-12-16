import { useEffect } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

const NearbyFoodController = ({
  selectedPlace,
  radius,
  onResults,
  API_KEY, // 🔥 API_KEY 받기 (필요)
}) => {
  const map = useMap();
  const placesLib = useMapsLibrary("places");

  useEffect(() => {
    if (!map || !placesLib || !selectedPlace) return;

    const service = new placesLib.PlacesService(map);

    const request = {
      location: new window.google.maps.LatLng(
        selectedPlace.lat,
        selectedPlace.lng
      ),
      radius,
      type: "restaurant",
    };

    console.log("📍 nearbySearch request:", request);

    service.nearbySearch(request, (results, status) => {
      console.log("📡 nearbySearch status:", status);
      console.log("📦 raw results:", results);

      if (status !== placesLib.PlacesServiceStatus.OK || !results) {
        console.log("❌ nearbySearch failed");
        onResults([]);
        return;
      }
      // 🔥 [필터링 로직 추가] 
      // 평점(rating)이 3.5 초과이고, 리뷰수(reviews)가 10개 초과인 곳만 남김
      const filteredResults = results.filter((r) => {
        const rating = r.rating || 0;
        const reviews = r.user_ratings_total || 0;
        
        // 3.5 이하거나 10개 이하면 false (제외됨)
        return rating > 3.5 && reviews > 10;
      });


      const normalized = filteredResults.map((r) => {
        let photoUrl = null;

        // =============================
        // 1️⃣ getUrl() 지원하는 경우
        // =============================
        if (
          r.photos &&
          r.photos.length > 0 &&
          typeof r.photos[0].getUrl === "function"
        ) {
          try {
            photoUrl = r.photos[0].getUrl({
              maxWidth: 400,
              maxHeight: 300,
            });
          } catch (e) {
            photoUrl = null;
          }
        }

        // =============================
        // 2️⃣ photo_reference 기반 URL (Fallback)
        // =============================
        if (!photoUrl && r.photos && r.photos.length > 0) {
          const ref = r.photos[0].photo_reference;
          if (ref && API_KEY) {
            photoUrl =
              `https://maps.googleapis.com/maps/api/place/photo` +
              `?maxwidth=400` +
              `&photoreference=${ref}` +
              `&key=${API_KEY}`;
          }
        }

        return {
          id: r.place_id,
          placeId: r.place_id,
          name: r.name,
          rating: r.rating,
          reviews: r.user_ratings_total,
          lat: r.geometry?.location?.lat(),
          lng: r.geometry?.location?.lng(),
          vicinity: r.vicinity,

          // ⭐ SearchResultItem에서 photos를 그대로 쓰기 때문에 유지해야 함
          photos: r.photos || null,

          // ⭐ 일정에 넣을 썸네일 URL
          photoUrl,

          type: "restaurant",
        };
      });

      console.log("✅ normalized 결과 (photoUrl 포함):", normalized);
      onResults(normalized);
    });
  }, [map, placesLib, selectedPlace, radius, onResults, API_KEY]);

  return null;
};

export default NearbyFoodController;
