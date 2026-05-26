// 지도 화면 — 모바일: 절대위치 풀스크린 + 하단시트 오버레이 / 데스크탑: 큰 지도 + 우측 사이드 패널.
//
// 모바일 레이아웃 설계:
//   - 컨테이너 height = calc(100dvh - var(--bottom-tab-h))  ← dvh 로 모바일 주소창/PWA 안전
//   - 컨테이너 position: relative + overflow: hidden
//   - 지도는 그 안에서 `inset: 0` 으로 확실하게 풀폭 채움
//   - 검색바/FAB/바텀시트는 모두 절대위치 오버레이 (flex 없이)
//
// 이전 버전은 flex cascade 에 의존했는데 PWA standalone 환경에서 뷰포트 측정 타이밍이
// 어긋나서 지도 컨테이너가 0×0 으로 초기화되는 문제가 있었음. 절대위치는 viewport 단위에
// 즉시 묶이므로 SDK 초기화 시점에 항상 안정된 크기를 가짐.
import { useMemo, useState } from 'react';
import {
  Button,
  NaverMap,
  Chip,
  Field,
  QrScannerModal,
  SearchIcon,
  CloseIcon,
  QrIcon,
  PinIcon,
  WalkIcon,
  LayersIcon,
  type MapTypeId,
} from '@/components/ui';
import { useIsDesktop } from '@/hooks/useBreakpoint';
import { useComingSoon } from '@/hooks/useComingSoon';
import { JUKJEON_CAMPUS } from '@/lib/env';
import { getCurrentPosition } from '@/hooks/useGeolocation';
import { useUIStore } from '@/store/uiStore';
import { usePointsStore } from '@/store/pointsStore';
import { pointsApi } from '@/api';

const FILTERS = ['전체', '내 동선', '학식', '카페', '편의점', '동아리방'] as const;

const ALL_MARKERS = [
  { lat: JUKJEON_CAMPUS.lat - 0.0007, lng: JUKJEON_CAMPUS.lng - 0.0003, label: '지금',              color: 'var(--accent)',  group: '내 동선' as const },
  { lat: JUKJEON_CAMPUS.lat + 0.0008, lng: JUKJEON_CAMPUS.lng - 0.0007, label: '도서관',            color: 'var(--ink)',      group: '내 동선' as const },
  { lat: JUKJEON_CAMPUS.lat - 0.0002, lng: JUKJEON_CAMPUS.lng - 0.0003, label: '학생회관 · 학식',   color: 'var(--primary)', group: '학식' as const },
  { lat: JUKJEON_CAMPUS.lat + 0.0003, lng: JUKJEON_CAMPUS.lng + 0.0005, label: 'IT관 · 다음 수업',   color: 'var(--primary)', group: '내 동선' as const },
  { lat: JUKJEON_CAMPUS.lat - 0.0010, lng: JUKJEON_CAMPUS.lng + 0.0008, label: 'STAFF COFFEE',     color: 'var(--accent)',  group: '카페' as const },
  { lat: JUKJEON_CAMPUS.lat + 0.0005, lng: JUKJEON_CAMPUS.lng - 0.0010, label: 'CU 학생회관',       color: 'var(--ink)',      group: '편의점' as const },
  { lat: JUKJEON_CAMPUS.lat - 0.0004, lng: JUKJEON_CAMPUS.lng + 0.0009, label: '한울 동아리방',     color: 'oklch(0.62 0.13 165)', group: '동아리방' as const },
];

export default function MapPage() {
  const isDesktop = useIsDesktop();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('전체');
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(JUKJEON_CAMPUS);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [qrOpen, setQrOpen] = useState(false);
  const [mapType, setMapType] = useState<MapTypeId>('normal');
  const pushToast = useUIStore((s) => s.pushToast);
  const loadPoints = usePointsStore((s) => s.load);
  const comingSoon = useComingSoon();
  void comingSoon;

  // 레이어 순환 — 일반 → 위성 → 하이브리드 → 일반
  const cycleMapType = () => {
    const order: MapTypeId[] = ['normal', 'satellite', 'hybrid'];
    const labels: Record<MapTypeId, string> = {
      normal: '일반 지도',
      satellite: '위성 지도',
      hybrid: '하이브리드',
      terrain: '지형 지도',
    };
    const next = order[(order.indexOf(mapType) + 1) % order.length];
    setMapType(next);
    pushToast(`${labels[next]} 로 전환`, 'info');
  };

  // 필터 + 검색에 따른 마커 보이기.
  const visibleMarkers = useMemo(() => {
    let list = filter === '전체' ? ALL_MARKERS : ALL_MARKERS.filter((m) => m.group === filter);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((m) => m.label.toLowerCase().includes(q));
    return list;
  }, [filter, query]);

  // IT관 마커 — 안내 시작 시 사용.
  const nextClassMarker = ALL_MARKERS.find((m) => m.label.includes('IT관'));

  const handleRouteStart = () => {
    if (!nextClassMarker) {
      pushToast('다음 강의 정보를 찾을 수 없어요', 'error');
      return;
    }
    setMapCenter({ lat: nextClassMarker.lat, lng: nextClassMarker.lng });
    pushToast('IT관 403호까지 안내를 시작해요', 'success');
  };

  const handleQrScanned = async () => {
    try {
      // 데모용 — 단풍식당 (r-1) 에 스탬프 적립.
      await pointsApi.earnStamp('r-1');
      await loadPoints();
      pushToast('단풍식당 스탬프 적립! +20p 🎉', 'success');
    } catch {
      pushToast('스탬프 적립 실패', 'error');
    }
  };

  const handleRecenter = async () => {
    pushToast('현재 위치 가져오는 중...', 'info');
    const res = await getCurrentPosition();
    if (!res.ok) {
      pushToast('위치를 가져올 수 없어요.', 'error');
      return;
    }
    setMapCenter({ lat: res.position.lat, lng: res.position.lng });
    pushToast('내 위치로 이동했어요', 'success');
  };

  const searchBar = (
    <div
      style={{
        height: 48,
        width: '100%',
        borderRadius: 16,
        background: 'var(--card)',
        boxShadow: 'var(--sh-2)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 14px',
        gap: 10,
      }}
    >
      <span style={{ color: 'var(--ink-3)' }}><SearchIcon size={18} /></span>
      {searchOpen ? (
        <>
          <Field
            placeholder="건물, 음식점, 동아리방 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              height: 40,
              border: 'none',
              padding: 0,
              background: 'transparent',
              boxShadow: 'none',
            }}
          />
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSearchOpen(false);
            }}
            aria-label="검색 닫기"
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'var(--bg-2)',
              color: 'var(--ink-3)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CloseIcon size={16} />
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            style={{
              flex: 1,
              fontSize: 14,
              color: 'var(--ink-4)',
              textAlign: 'left',
              background: 'transparent',
            }}
          >
            건물, 음식점, 동아리방 검색
          </button>
          <button
            type="button"
            onClick={() => setQrOpen(true)}
            aria-label="QR 스캔"
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'var(--primary-soft)',
              color: 'var(--primary-ink)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <QrIcon size={16} />
          </button>
        </>
      )}
    </div>
  );

  const filterChips = (
    <div style={{ display: 'flex', gap: 6, marginTop: 10, overflowX: 'auto' }}>
      {FILTERS.map((f) => (
        <Chip key={f} active={filter === f} onCard onClick={() => setFilter(f)}>
          {f}
        </Chip>
      ))}
    </div>
  );

  const bottomSheet = (
    <div
      style={{
        background: 'var(--card)',
        borderRadius: '24px 24px 0 0',
        padding: '12px 18px 14px',
        boxShadow: '0 -8px 24px rgba(20,16,40,0.08)',
      }}
    >
      <div
        style={{
          width: 36,
          height: 4,
          borderRadius: 999,
          background: 'var(--line-2)',
          margin: '0 auto 12px',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: 'var(--primary)',
            color: '#fff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <WalkIcon size={22} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>다음 강의까지</p>
          <p style={{ margin: '2px 0 0', fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>
            IT관 403호 · <span style={{ color: 'var(--primary-ink)' }}>도보 7분</span>
          </p>
        </div>
        <button
          type="button"
          onClick={handleRouteStart}
          style={{
            padding: '8px 14px',
            borderRadius: 12,
            background: 'var(--ink)',
            color: 'var(--bg)',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          안내 시작
        </button>
      </div>
    </div>
  );

  const qrModal = (
    <QrScannerModal
      open={qrOpen}
      onClose={() => setQrOpen(false)}
      onScanned={handleQrScanned}
      context="단풍식당"
    />
  );

  // ────────── 데스크탑 ──────────
  if (isDesktop) {
    return (
      <>
      <div style={{ display: 'flex', height: '100vh', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 24, left: 24, right: 360 + 48, zIndex: 5 }}>
          {searchBar}
          {filterChips}
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          <NaverMap height="100%" center={mapCenter} markers={visibleMarkers} mapTypeId={mapType} />
          <div style={{ position: 'absolute', right: 24, bottom: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Button variant="fab" aria-label="내 위치" onClick={handleRecenter}><PinIcon size={18} /></Button>
            <Button variant="fab" aria-label="레이어 전환" onClick={cycleMapType}><LayersIcon size={18} /></Button>
          </div>
        </div>

        <aside
          style={{
            width: 360,
            background: 'var(--bg)',
            borderLeft: '1px solid var(--line)',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            overflow: 'auto',
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>오늘의 동선</h2>
          {bottomSheet}
        </aside>
      </div>
      {qrModal}
      </>
    );
  }

  // ────────── 모바일 — 절대위치 풀스크린 + 오버레이 ──────────
  return (
    <>
    <div
      style={{
        // 100dvh = 동적 뷰포트 (모바일 주소창 / PWA 안전).
        // bottom tab 만큼 빼서 탭바와 겹치지 않게.
        height: 'calc(100dvh - var(--bottom-tab-h))',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 지도 — 컨테이너 전체 채움 */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <NaverMap height="100%" center={mapCenter} markers={visibleMarkers} mapTypeId={mapType} />
      </div>

      {/* 검색바 + 필터 (상단 오버레이) */}
      <div style={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 5 }}>
        {searchBar}
        {filterChips}
      </div>

      {/* FAB (우하단 오버레이, 바텀시트 위에) */}
      <div
        style={{
          position: 'absolute',
          right: 16,
          bottom: 140,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 4,
        }}
      >
        <Button variant="fab" aria-label="내 위치" onClick={handleRecenter}><PinIcon size={18} /></Button>
        <Button variant="fab" aria-label="레이어" onClick={() => comingSoon()}><LayersIcon size={18} /></Button>
      </div>

      {/* 바텀시트 (하단 오버레이) */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 3 }}>
        {bottomSheet}
      </div>
    </div>
    {qrModal}
    </>
  );
}
