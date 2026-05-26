// 좌표 픽커 — 어드민에서 건물 위치를 지정할 때 사용.
//
// 동작:
//   - 지도 초기화 1회 (마운트 시) — center 와 marker 는 동시에 lat/lng 위치에 설정
//   - 사용자가 지도 클릭 → 마커 위치 이동 + onChange(lat, lng) 호출
//   - 상위에서 lat/lng prop 이 외부 변경되면 (예: 숫자 입력) → 마커만 setPosition 으로 이동
//   - NaverMap 컴포넌트와 별개 — 인터랙티브 픽킹에 특화
import { useEffect, useRef, useState } from 'react';
import { loadNaverMaps } from '@/lib/naverMapsLoader';
import { hasNaverMaps, JUKJEON_CAMPUS } from '@/lib/env';

// SDK 인스턴스 ref 타입 — vite-env.d.ts 의 declare 가 모듈 스코프라 여기선 unknown 으로 보관.
// 사용 시점에 좁혀 쓰는 것보다 ref 만 받아두는 정도라 unknown 으로 충분.

type MapPickerProps = {
  lat?: number;
  lng?: number;
  onChange: (lat: number, lng: number) => void;
  height?: number | string;
  /** 픽킹 마커 색상. 기본 primary */
  color?: string;
};

export function MapPicker({
  lat,
  lng,
  onChange,
  height = 220,
  color = 'var(--primary)',
}: MapPickerProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // 네이버 지도 SDK 인스턴스는 우리가 직접 메서드 호출하므로 ref 만 보관 (타입은 unknown)
  const mapRef = useRef<unknown>(null);
  const markerRef = useRef<{ setPosition: (latlng: unknown) => void } | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

  // 좌표가 prop 으로 없을 때 죽전 중심으로 fallback
  const safeLat = typeof lat === 'number' ? lat : JUKJEON_CAMPUS.lat;
  const safeLng = typeof lng === 'number' ? lng : JUKJEON_CAMPUS.lng;

  // 1) 지도 + 마커 초기화 (한 번만)
  useEffect(() => {
    if (!hasNaverMaps()) {
      setStatus('error');
      return;
    }

    let cancelled = false;
    setStatus('loading');

    const waitForSize = () =>
      new Promise<void>((resolve) => {
        const el = containerRef.current;
        if (!el) return resolve();
        if (el.offsetWidth > 0 && el.offsetHeight > 0) return resolve();
        const ro = new ResizeObserver(() => {
          if (el.offsetWidth > 0 && el.offsetHeight > 0) {
            ro.disconnect();
            resolve();
          }
        });
        ro.observe(el);
        setTimeout(() => {
          ro.disconnect();
          resolve();
        }, 1000);
      });

    (async () => {
      try {
        await loadNaverMaps();
        await waitForSize();
        if (cancelled || !containerRef.current || !window.naver) return;
        const { maps } = window.naver;
        const map = new maps.Map(containerRef.current, {
          center: new maps.LatLng(safeLat, safeLng),
          zoom: 17,
          zoomControl: false,
          logoControl: false,
          mapDataControl: false,
          scaleControl: false,
          mapTypeControl: false,
        });
        mapRef.current = map;

        // 픽킹 마커 — 커스텀 핀 (인디고 또는 주어진 color)
        const marker = new maps.Marker({
          position: new maps.LatLng(safeLat, safeLng),
          map,
          icon: {
            content: `
              <div style="display:flex;flex-direction:column;align-items:center;gap:2px;transform:translate(-50%,-100%)">
                <div style="
                  padding:5px 11px;border-radius:999px;
                  background:${color};color:#fff;
                  font:700 11px/1 'Pretendard Variable',system-ui;
                  white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,.22);
                ">📍 여기</div>
                <div style="
                  width:0;height:0;
                  border-left:6px solid transparent;border-right:6px solid transparent;
                  border-top:7px solid ${color};
                "></div>
              </div>
            `,
          },
        });
        markerRef.current = marker as unknown as typeof markerRef.current;

        // 클릭 → 마커 이동 + 상위에 알림
        maps.Event.addListener(map, 'click', (e) => {
          const newLat = e.coord.lat();
          const newLng = e.coord.lng();
          marker.setPosition(new maps.LatLng(newLat, newLng));
          onChange(newLat, newLng);
        });

        setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
    // 의도적으로 마운트 시 1회만 — 좌표 변경은 별도 effect 가 처리
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) 외부에서 lat/lng prop 이 바뀌면 마커만 이동 (지도는 그대로)
  useEffect(() => {
    if (!markerRef.current || !window.naver) return;
    const { maps } = window.naver;
    markerRef.current.setPosition(new maps.LatLng(safeLat, safeLng));
  }, [safeLat, safeLng]);

  // 키 미설정 시 fallback — 좌표 직접 입력 안내
  if (!hasNaverMaps() || status === 'error') {
    return (
      <div
        style={{
          width: '100%',
          height,
          background: 'var(--bg-2)',
          border: '1px dashed var(--line-2)',
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--ink-4)',
          fontSize: 12,
          textAlign: 'center',
          padding: 16,
          lineHeight: 1.5,
        }}
      >
        🗺 네이버 지도 키가 설정되지 않았어요.
        <br />
        좌표를 직접 입력해주세요.
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'relative',
        width: '100%',
        height,
        borderRadius: 14,
        overflow: 'hidden',
        border: '1px solid var(--line)',
      }}
      aria-label="좌표 픽커"
    >
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />

      {/* 도움말 안내 — 우상단 */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          padding: '6px 10px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)',
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--ink-2)',
          boxShadow: 'var(--sh-1)',
          pointerEvents: 'none',
        }}
      >
        지도를 클릭해서 위치 선택
      </div>

      {/* 현재 좌표 표시 — 우하단 */}
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          padding: '6px 10px',
          borderRadius: 8,
          background: 'rgba(20,16,40,0.85)',
          color: '#fff',
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          pointerEvents: 'none',
        }}
      >
        {safeLat.toFixed(5)}, {safeLng.toFixed(5)}
      </div>

      {status === 'loading' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-2)',
            color: 'var(--ink-4)',
            fontSize: 13,
          }}
        >
          지도를 불러오는 중...
        </div>
      )}
    </div>
  );
}
