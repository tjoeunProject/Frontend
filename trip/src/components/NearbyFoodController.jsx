// src/components/NearbyFoodController.jsx

import { useEffect } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

const NearbyFoodController = ({
  selectedPlace,
  radius,
  onResults,
}) => {
  const map = useMap();
  const placesLib = useMapsLibrary("places");

  useEffect(() => {
    if (!map || !placesLib || !selectedPlace) return;

    const service = new placesLib.PlacesService(map);

    const request = {
      location: new window.google.maps.LatLng(selectedPlace.lat, selectedPlace.lng),
      radius,
      type: "restaurant",
    };

    service.nearbySearch(request, (results, status) => {
      if (status !== placesLib.PlacesServiceStatus.OK || !results) {
        console.log("❌ nearbySearch 실패:", status);
        onResults([]);
        return;
      }

      const normalized = results.map((r) => ({
        id: r.place_id,
        placeId: r.place_id,
        name: r.name,
        rating: r.rating,
        reviews: r.user_ratings_total,
        lat: r.geometry?.location?.lat(),
        lng: r.geometry?.location?.lng(),
        vicinity: r.vicinity,
      }));

      onResults(normalized);
    });
  }, [map, placesLib, selectedPlace, radius, onResults]);

  return null;
};

export default NearbyFoodController;
