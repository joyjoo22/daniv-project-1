// 캠퍼스 지도 모킹 — 시안 ui.jsx의 CampusMap.
// PHASE 6에서 실제 네이버 지도로 교체 예정. 그 전까지 전 화면에서 동일한 시각 자리표시자로 사용.
type Pin = {
  x: number;        // 0~100 (%)
  y: number;        // 0~100 (%)
  label: string;
  color?: string;
};

type CampusMapProps = {
  height?: number | string;
  showRoute?: boolean;
  pins?: Pin[];
};

export function CampusMap({ height = 220, showRoute = true, pins = [] }: CampusMapProps) {
  return (
    <div className="map-canvas" style={{ width: '100%', height, position: 'relative' }}>
      <div className="map-grid" />
      {/* 도로 + 건물 + (선택)경로 */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <path d="M-5 35 Q 30 28, 55 45 T 110 60" stroke="rgba(0,0,0,0.18)" strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d="M-5 35 Q 30 28, 55 45 T 110 60" stroke="#fff" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <path d="M40 -5 Q 45 35, 60 55 T 70 110" stroke="rgba(0,0,0,0.13)" strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M40 -5 Q 45 35, 60 55 T 70 110" stroke="#fff" strokeWidth={2} fill="none" strokeLinecap="round" />
        <rect x={15} y={20} width={14} height={10} rx={1.5} fill="oklch(0.88 0.02 270)" stroke="rgba(0,0,0,0.1)" strokeWidth={0.4} />
        <rect x={62} y={22} width={10} height={14} rx={1.5} fill="oklch(0.9 0.025 55)" stroke="rgba(0,0,0,0.1)" strokeWidth={0.4} />
        <rect x={48} y={62} width={18} height={12} rx={1.5} fill="oklch(0.88 0.02 165)" stroke="rgba(0,0,0,0.1)" strokeWidth={0.4} />
        <rect x={22} y={70} width={12} height={10} rx={1.5} fill="oklch(0.9 0.018 270)" stroke="rgba(0,0,0,0.1)" strokeWidth={0.4} />
        <rect x={78} y={78} width={14} height={10} rx={1.5} fill="oklch(0.9 0.02 90)" stroke="rgba(0,0,0,0.1)" strokeWidth={0.4} />
        {showRoute && (
          <path
            d="M22 25 Q 35 35, 45 50 T 67 72"
            stroke="var(--primary)"
            strokeWidth={1.6}
            fill="none"
            strokeLinecap="round"
            strokeDasharray="3 2.5"
          />
        )}
      </svg>

      {/* 핀 */}
      {pins.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div
              style={{
                padding: '4px 9px',
                borderRadius: 999,
                background: p.color || 'var(--ink)',
                color: '#fff',
                fontSize: 10.5,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
              }}
            >
              {p.label}
            </div>
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: `6px solid ${p.color || 'var(--ink)'}`,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
              }}
            />
          </div>
        </div>
      ))}

      {/* 현재 위치 (펄스 애니메이션) */}
      <div
        style={{
          position: 'absolute',
          left: '22%',
          top: '26%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className="animate-daniv-pulse"
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--accent)',
            opacity: 0.25,
            position: 'absolute',
            inset: -6,
          }}
        />
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: 'var(--accent)',
            border: '3px solid #fff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        />
      </div>
    </div>
  );
}

export type { Pin };
