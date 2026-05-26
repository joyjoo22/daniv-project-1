// 오프라인 상태 배너 — 화면 상단에 가는 띠로 표시.
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 95,
        padding: '8px 14px',
        background: 'oklch(0.62 0.16 18)',
        color: '#fff',
        fontSize: 12,
        fontWeight: 600,
        textAlign: 'center',
        letterSpacing: '-0.01em',
        animation: 'daniv-fade .2s ease both',
      }}
    >
      ⚠ 오프라인 상태 — 일부 기능이 제한될 수 있어요
    </div>
  );
}
