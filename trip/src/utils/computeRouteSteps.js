// src/utils/computeRouteSteps.js
import { decodePolyline } from "./polylineDecode";

/*
  Routes API endpoint:
  POST https://routes.googleapis.com/directions/v2:computeRoutes

  Field mask는 꼭 넣어야 한다.
*/

export async function computeRouteStepsDirect({
  origin,
  destination,
  travelMode = "WALK",
  languageCode = "ko-KR",
  apiKey,
}) {
  const url = "https://routes.googleapis.com/directions/v2:computeRoutes";

  const body = {
    origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
    destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
    travelMode,
    languageCode,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "routes.distanceMeters,routes.duration,routes.legs.steps.polyline.encodedPolyline,routes.legs.steps.navigationInstruction.instructions",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Routes API failed: ${res.status} ${text}`);
  }

  const json = await res.json();
  const route = json?.routes?.[0];
  const steps = route?.legs?.[0]?.steps ?? [];

  const decodedSteps = steps
    .map((s) => {
      const encoded = s?.polyline?.encodedPolyline;
      if (!encoded) return null;

      const path = decodePolyline(encoded);
      const instructions = s?.navigationInstruction?.instructions ?? "";

      return { path, instructions };
    })
    .filter(Boolean);

  return {
    distanceMeters: route?.distanceMeters ?? null,
    duration: route?.duration ?? null,
    steps: decodedSteps,
  };
}
