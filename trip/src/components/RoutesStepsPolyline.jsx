// src/components/RoutesStepsPolyline.jsx

import { useEffect, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { resolveEndpoint } from "../utils/resolveEndpoint";
import { computeRouteStepsViaBackend } from "../utils/computeRouteSteps";

const RoutesStepsPolyline = ({ origin, destination, color }) => {
  const map = useMap();
  const polylinesRef = useRef([]);

  useEffect(() => {
    if (!map || !origin || !destination) return;

    const clear = () => {
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };

    const draw = async () => {
      clear();

      const o = resolveEndpoint(origin, destination).point;
      const d = resolveEndpoint(destination, origin).point;

      try {
        const result = await computeRouteStepsViaBackend({
          origin: o,
          destination: d,
          travelMode: "WALK",
          languageCode: "ko-KR",
        });

        if (!result?.steps?.length) {
          const fallback = new window.google.maps.Polyline({
            path: [
              { lat: o.lat, lng: o.lng },
              { lat: d.lat, lng: d.lng },
            ],
            strokeColor: color || "#999999",
            strokeOpacity: 0.7,
            strokeWeight: 3,
            map,
          });
          polylinesRef.current.push(fallback);
          return;
        }

        result.steps.forEach((s) => {
          const line = new window.google.maps.Polyline({
            path: s.path,
            strokeColor: color || "#FF7A00",
            strokeOpacity: 1.0,
            strokeWeight: 4,
            map,
          });
          polylinesRef.current.push(line);
        });

        // 필요하면 여기서 s.instructions를 리스트로 보여주면 네이버 느낌이 확 올라감
        // 예: setState로 steps 저장 후 UI에 렌더

      } catch (e) {
        console.error(e);
      }
    };

    draw();

    return () => clear();
  }, [map, origin, destination, color]);

  return null;
};

export default RoutesStepsPolyline;
