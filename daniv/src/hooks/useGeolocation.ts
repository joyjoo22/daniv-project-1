// 실제 브라우저 GPS 훅 — navigator.geolocation.getCurrentPosition 래퍼.
// PWA에서 권한 거부/타임아웃/HTTPS 미지원 등을 다룰 수 있도록 명시적 에러 코드 반환.
//
// 개발 편의: 로컬 dev 환경에서 권한 거부 시 자동으로 죽전 캠퍼스 중심으로 fallback 하는
// devFallback 옵션 제공. 프로덕션에선 false 유지.
import { JUKJEON_CAMPUS } from '@/lib/env';

export type GeoPosition = {
  lat: number;
  lng: number;
  accuracy: number;
};

export type GeoError =
  | { kind: 'unsupported' }
  | { kind: 'permission-denied' }
  | { kind: 'position-unavailable' }
  | { kind: 'timeout' }
  | { kind: 'unknown'; message: string };

export type GeoResult = { ok: true; position: GeoPosition } | { ok: false; error: GeoError };

export function getCurrentPosition(options?: {
  timeoutMs?: number;
  devFallback?: boolean;
}): Promise<GeoResult> {
  const timeoutMs = options?.timeoutMs ?? 8000;
  const devFallback = options?.devFallback ?? import.meta.env.MODE === 'development';

  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      if (devFallback) {
        resolve({
          ok: true,
          position: { lat: JUKJEON_CAMPUS.lat, lng: JUKJEON_CAMPUS.lng, accuracy: 50 },
        });
        return;
      }
      resolve({ ok: false, error: { kind: 'unsupported' } });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          ok: true,
          position: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          },
        }),
      (err) => {
        if (devFallback) {
          resolve({
            ok: true,
            position: { lat: JUKJEON_CAMPUS.lat, lng: JUKJEON_CAMPUS.lng, accuracy: 50 },
          });
          return;
        }
        const kind: GeoError['kind'] =
          err.code === 1
            ? 'permission-denied'
            : err.code === 2
              ? 'position-unavailable'
              : err.code === 3
                ? 'timeout'
                : 'unknown';
        resolve({
          ok: false,
          error: kind === 'unknown' ? { kind, message: err.message } : { kind },
        });
      },
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 30_000 },
    );
  });
}

// 두 좌표 간 거리 (m) — Haversine. 캠퍼스 근거리 비교에 충분히 정확.
export function distanceMeters(a: GeoPosition, b: { lat: number; lng: number }): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
