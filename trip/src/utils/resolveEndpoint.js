// src/utils/resolveEndpoint.js

import { calcDistance } from "./calcDistance";
import { entranceOverrides } from "./entranceOverrides";

/**
 * place 객체 형태(권장):
 * {
 *   lat: number,
 *   lng: number,
 *   googlePlaceId?: string,
 *   viewport?: {
 *     north: number,
 *     south: number,
 *     east: number,
 *     west: number
 *   }
 * }
 *
 * viewport는 Google Place Details/검색 결과의 geometry.viewport를 저장해두면 가장 좋다.
 * (큰 영역 판단 + 경계 후보점 산출에 사용)
 */

/**
 * viewport가 "큰 영역"인지 판단한다.
 * 기준은 프로젝트에 따라 튜닝해야 해서, 일단 보수적으로 설정했다.
 */
function isLargeAreaViewport(viewport, largeAreaThresholdMeters = 250) {
  if (!viewport) return false;

  const centerLat = (viewport.north + viewport.south) / 2;
  const centerLng = (viewport.east + viewport.west) / 2;

  // north-south 거리(대략적인 높이)
  const heightM = calcDistance(viewport.north, centerLng, viewport.south, centerLng);

  // east-west 거리(대략적인 너비)
  const widthM = calcDistance(centerLat, viewport.east, centerLat, viewport.west);

  // 둘 중 하나라도 threshold 이상이면 큰 영역으로 본다.
  return Math.max(heightM, widthM) >= largeAreaThresholdMeters;
}

/**
 * viewport 경계에서 4방향 후보점을 만든다.
 * - 북쪽 경계 중앙, 남쪽 경계 중앙, 동쪽 경계 중앙, 서쪽 경계 중앙
 */
function getViewportBoundaryCandidates(viewport) {
  const centerLat = (viewport.north + viewport.south) / 2;
  const centerLng = (viewport.east + viewport.west) / 2;

  return [
    { lat: viewport.north, lng: centerLng, label: "N" },
    { lat: viewport.south, lng: centerLng, label: "S" },
    { lat: centerLat, lng: viewport.east, label: "E" },
    { lat: centerLat, lng: viewport.west, label: "W" }
  ];
}

/**
 * 후보점들 중, targetPoint(상대 위치)에 가장 가까운 점을 고른다.
 */
function pickClosestCandidate(candidates, targetPoint) {
  let best = null;
  let bestDist = Number.POSITIVE_INFINITY;

  for (const c of candidates) {
    const d = calcDistance(c.lat, c.lng, targetPoint.lat, targetPoint.lng);
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }

  return best;
}

/**
 * (선택) 오버라이드가 있으면 출입구 후보 중 targetPoint에 가장 가까운 출입구를 선택한다.
 */
function resolveByOverride(place, targetPoint) {
  const placeId = place?.googlePlaceId;
  if (!placeId) return null;

  const override = entranceOverrides[placeId];
  if (!override || !override.entrances || override.entrances.length === 0) return null;

  const candidates = override.entrances.map((e) => ({ lat: e.lat, lng: e.lng, label: e.label || "entrance" }));
  return pickClosestCandidate(candidates, targetPoint);
}

/**
 * 내부 마커 보정:
 * 1) 오버라이드(placeId)가 있으면 출입구 기반으로 보정
 * 2) 없으면 viewport가 큰 영역일 때 경계 후보(N/S/E/W) 중 target에 가까운 점으로 보정
 * 3) 그 외는 원래 좌표 유지
 *
 * 반환:
 * {
 *   point: {lat, lng},
 *   reason: string
 * }
 */
export function resolveEndpoint(place, targetPoint, options = {}) {
  const {
    largeAreaThresholdMeters = 250
  } = options;

  if (!place || typeof place.lat !== "number" || typeof place.lng !== "number") {
    return { point: place, reason: "invalid_place" };
  }

  // 1) 오버라이드 우선
  const overridden = resolveByOverride(place, targetPoint);
  if (overridden) {
    return { point: { lat: overridden.lat, lng: overridden.lng }, reason: "override_entrance" };
  }

  // 2) viewport 기반 자동 보정
  const viewport = place.viewport;
  if (viewport && isLargeAreaViewport(viewport, largeAreaThresholdMeters)) {
    const candidates = getViewportBoundaryCandidates(viewport);
    const best = pickClosestCandidate(candidates, targetPoint);
    if (best) {
      return { point: { lat: best.lat, lng: best.lng }, reason: `viewport_boundary_${best.label}` };
    }
  }

  // 3) 그대로
  return { point: { lat: place.lat, lng: place.lng }, reason: "as_is" };
}
