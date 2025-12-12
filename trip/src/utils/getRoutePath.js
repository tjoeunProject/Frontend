// utils/getRoutePath.js

/**
 * Google Directions API를 이용해 경로를 가져온다.
 * 현재는 WALKING 전용으로 사용한다.
 *
 * 반환:
 * {
 *   path: [{ lat, lng }, ...],
 *   durationMin: number
 * }
 * 실패 시: null
 */
export function getRoutePath(origin, destination, mode = "WALKING") {
  return new Promise((resolve) => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps SDK not loaded");
      resolve(null);
      return;
    }

    const service = new window.google.maps.DirectionsService();

    service.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode[mode],
      },
      (result, status) => {
        if (status !== "OK" || !result?.routes?.length) {
          console.warn("Directions failed:", status);
          resolve(null);
          return;
        }

        const route = result.routes[0];
        const leg = route.legs[0];

        const path = route.overview_path.map((p) => ({
          lat: p.lat(),
          lng: p.lng(),
        }));

        const durationMin = Math.round(leg.duration.value / 60);

        resolve({
          path,
          durationMin,
        });
      }
    );
  });
}
