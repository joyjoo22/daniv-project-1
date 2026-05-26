// iOS-스타일 상태바 — 시안 ui.jsx의 StatusBar.
// 실제 모바일 PWA에서는 OS 상태바가 표시되므로 보통 숨기지만, 시안 재현/데모 용도로 유지.
type StatusBarProps = {
  dark?: boolean;
  time?: string;
};

export function StatusBar({ dark = false, time = '9:41' }: StatusBarProps) {
  const c = dark ? '#fff' : '#000';
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 24px 6px',
        flexShrink: 0,
        fontFamily: '-apple-system, system-ui',
      }}
    >
      <span style={{ fontWeight: 600, fontSize: 15, color: c, letterSpacing: 0 }}>{time}</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {/* 신호 막대 */}
        <svg width="17" height="11" viewBox="0 0 17 11">
          <path d="M1 8h2v2H1zM5 6h2v4H5zM9 4h2v6H9zM13 1h2v9h-2z" fill={c} />
        </svg>
        {/* Wi-Fi */}
        <svg width="16" height="11" viewBox="0 0 16 11">
          <path
            d="M8 2.5c2 0 3.8.7 5.1 2L14 3.4A8 8 0 0 0 2 3.4l.9 1.1A7 7 0 0 1 8 2.5Z"
            fill={c}
          />
          <path
            d="M8 6c1.2 0 2.3.5 3.1 1.2l.9-.9A5.6 5.6 0 0 0 8 4.8c-1.5 0-2.8.6-4 1.5l.9.9A4.5 4.5 0 0 1 8 6Z"
            fill={c}
          />
          <circle cx="8" cy="9.3" r="1.3" fill={c} />
        </svg>
        {/* 배터리 */}
        <svg width="25" height="11" viewBox="0 0 25 11">
          <rect x="0.5" y="0.5" width="21" height="10" rx="2.5" fill="none" stroke={c} strokeOpacity="0.4" />
          <rect x="2" y="2" width="18" height="7" rx="1.5" fill={c} />
          <rect x="22.5" y="4" width="1.5" height="3" rx="0.5" fill={c} fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}
