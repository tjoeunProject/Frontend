// components/DirectionsPolyline.jsx

import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { getRoutePath } from "../utils/getRoutePath";
import { resolveEndpoint } from "../utils/resolveEndpoint";

/**
 * DirectionsPolyline (Hybrid A)
 *
 * - "의미상 도보 이동"
 * - "경로 생성은 TRANSIT 사용"
 * - 버스/정류장 튀는 문제 제거
 * - WALKING ZERO_RESULTS 문제 제거
 */
const DirectionsPolyline = ({ origin, destination, color }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !origin || !destination) return;

    let polylineInstance = null;

    const drawRoute = async () => {
      try {
        // 1️⃣ 내부 마커 보정
        const o = resolveEndpoint(origin, destination).point;
        const d = resolveEndpoint(destination, origin).point;

        // 2️⃣ TRANSIT으로 경로 요청 (길 생성용)
        const result = await getRoutePath(o, d, "TRANSIT");

        if (!result || !result.path || result.path.length === 0) {
          console.warn("Transit route not found, fallback to straight line");

          // 최후 fallback (거의 안 탐)
          polylineInstance = new window.google.maps.Polyline({
            path: [
              { lat: o.lat, lng: o.lng },
              { lat: d.lat, lng: d.lng },
            ],
            strokeColor: color || "#999999",
            strokeOpacity: 0.6,
            strokeWeight: 3,
            map,
          });
          return;
        }

        // 3️⃣ Polyline (도보 의미)
        polylineInstance = new window.google.maps.Polyline({
          path: result.path,
          strokeColor: color || "#FF7A00", // 주황 추천 (도보 느낌)
          strokeOpacity: 1.0,
          strokeWeight: 4,
          map,
        });

      } catch (err) {
        console.error("Hybrid route draw failed:", err);
      }
    };

    drawRoute();

    return () => {
      if (polylineInstance) polylineInstance.setMap(null);
    };
  }, [map, origin, destination, color]);

  return null;
};

export default DirectionsPolyline;
