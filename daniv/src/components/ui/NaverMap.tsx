// 네이버 지도 컴포넌트 — 키가 있을 때 실제 지도, 없으면 CampusMap fallback.
//
// 모바일에서 flex 부모 안에 들어가도 잘 렌더링되도록 absolute inset 패턴 사용:
//   wrapper(position: relative, width:100%, height:height) > inner(position:absolute, inset:0)
// → 부모의 height 계산이 늦어도 inner 가 wrapper 를 강제로 채워서 SDK 초기화 시점에
//   0×0 으로 시작하는 문제를 회피.
// 또한 ResizeObserver 로 컨테이너 크기 변경을 감지해 SDK 가 정상 렌더되도록 보장.
import { useEffect, useRef, useState } from 'react';
import { loadNaverMaps } from '@/lib/naverMapsLoader';
import { hasNaverMaps, JUKJEON_CAMPUS } from '@/lib/env';
import { CampusMap } from './CampusMap';

export type NaverMapMarker = {
  lat: number;
  lng: number;
  label: string;
  color?: string;
};

type NaverMapProps = {
  height?: number | string;
  /** 지도 중심 (기본: 죽전 캠퍼스) */
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: NaverMapMarker[];
  /** key 없거나 SDK 실패 시 보여줄 fallback. 기본은 CampusMap. */
  fallback?: React.ReactNode;
  /** 줌 컨트롤 (좌측 상단 + / − 버튼) 표시 여부. 기본 false — 핀치줌 사용. */
  showZoomControl?: boolean;
  /** 네이버 로고 표시 여부. 기본 false. NCP 약관상 운영시 표시 권장. */
  showLogoControl?: boolean;
  /** "© NAVER Corp." 같은 데이터 출처 텍스트. 기본 false. */
  showMapDataControl?: boolean;
  /** 축적 막대 (1km, 500m 등). 기본 false. */
  showScaleControl?: boolean;
  /** 지도 / 위성 / 지형 타입 전환 컨트롤. 기본 false. */
  showMapTypeControl?: boolean;
  /** 지도 표시 방식: 일반 / 위성 / 하이브리드 / 지형. 기본 'normal'. */
  mapTypeId?: 'normal' | 'satellite' | 'hybrid' | 'terrain';
};

export type MapTypeId = 'normal' | 'satellite' | 'hybrid' | 'terrain';

export function NaverMap({
  height = 300,
  center = JUKJEON_CAMPUS,
  zoom = 16,
  markers = [],
  fallback,
  showZoomControl = false,
  showLogoControl = false,
  showMapDataControl = false,
  showScaleControl = false,
  showMapTypeControl = false,
  mapTypeId = 'normal',
}: NaverMapProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<unknown>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

  useEffect(() => {
    if (!hasNaverMaps()) {
      setStatus('error');
      return;
    }

    let cancelled = false;
    setStatus('loading');

    // 컨테이너가 실제 크기를 가질 때까지 기다린 후 SDK 초기화.
    // ResizeObserver 로 dimensions 안정화 감지.
    const waitForSize = (): Promise<void> =>
      new Promise((resolve) => {
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
        // 안전장치 — 1초 뒤엔 무조건 진행 (서버에서 받기 전이라 등).
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
        // 모든 컨트롤을 prop 기반으로 — 기본은 모두 OFF 라서 우리 UI 오버레이와 안 겹침.
        const map = new maps.Map(containerRef.current, {
          center: new maps.LatLng(center.lat, center.lng),
          zoom,
          zoomControl: showZoomControl,
          logoControl: showLogoControl,
          mapDataControl: showMapDataControl,
          scaleControl: showScaleControl,
          mapTypeControl: showMapTypeControl,
          mapTypeId,
        });
        mapRef.current = map;

        markers.forEach((m) => {
          new maps.Marker({
            position: new maps.LatLng(m.lat, m.lng),
            map,
            icon: {
              content: `
                <div style="display:flex;flex-direction:column;align-items:center;gap:2px;transform:translate(-50%,-100%)">
                  <div style="
                    padding:4px 9px;border-radius:999px;
                    background:${m.color ?? 'var(--ink)'};color:#fff;
                    font:600 10.5px/1 'Pretendard Variable',system-ui;
                    white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,.18);
                  ">${m.label}</div>
                  <div style="
                    width:0;height:0;
                    border-left:5px solid transparent;border-right:5px solid transparent;
                    border-top:6px solid ${m.color ?? 'var(--ink)'};
                  "></div>
                </div>
              `,
            },
          });
        });

        setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    center.lat,
    center.lng,
    zoom,
    JSON.stringify(markers),
    showZoomControl,
    showLogoControl,
    showMapDataControl,
    showScaleControl,
    showMapTypeControl,
    mapTypeId,
  ]);

  // SDK 키가 없거나 로드 실패 시 fallback 표시.
  if (!hasNaverMaps() || status === 'error') {
    return (
      <div style={{ position: 'relative', width: '100%', height }}>
        {fallback ?? (
          <CampusMap
            height="100%"
            pins={markers.map((m, i) => ({
              x: 20 + (i * 15) % 80,
              y: 20 + (i * 23) % 60,
              label: m.label,
              color: m.color,
            }))}
          />
        )}
      </div>
    );
  }

  // wrapper 가 height 를 갖고, container 는 absolute inset:0 로 wrapper 를 강제 채움.
  // 부모 flex 계산 타이밍과 무관하게 SDK 가 항상 측정 가능한 크기를 갖게 됨.
  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'relative',
        width: '100%',
        height,
        background: 'var(--bg-2)',
      }}
      aria-label="캠퍼스 지도"
    >
      <div
        ref={containerRef}
        style={{ position: 'absolute', inset: 0 }}
      />
      {status === 'loading' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--ink-4)',
            fontSize: 13,
            pointerEvents: 'none',
          }}
        >
          지도를 불러오는 중...
        </div>
      )}
    </div>
  );
}
