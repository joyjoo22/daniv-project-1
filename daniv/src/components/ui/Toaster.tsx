// 전역 토스트 — uiStore.toasts 를 구독해서 화면 우상단(데스크탑)/하단(모바일)에 표시.
import { useEffect, useState } from 'react';
import { useUIStore } from '@/store/uiStore';
import { CheckIcon, CloseIcon, BellIcon } from './Icon';

function useViewportDesktop() {
  const [d, setD] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const h = (e: MediaQueryListEvent) => setD(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return d;
}

const VARIANT_STYLE: Record<string, { bg: string; fg: string; icon: React.ReactNode }> = {
  success: {
    bg: 'oklch(0.94 0.04 165)',
    fg: 'oklch(0.42 0.12 165)',
    icon: <CheckIcon size={16} />,
  },
  error: {
    bg: 'oklch(0.94 0.04 18)',
    fg: 'oklch(0.42 0.14 18)',
    icon: <CloseIcon size={16} />,
  },
  info: {
    bg: 'var(--primary-soft)',
    fg: 'var(--primary-ink)',
    icon: <BellIcon size={16} />,
  },
};

export function Toaster() {
  const toasts = useUIStore((s) => s.toasts);
  const dismiss = useUIStore((s) => s.dismissToast);
  const isDesktop = useViewportDesktop();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 100,
        // 데스크탑: 우상단, 모바일: 하단 (탭바 위에)
        top: isDesktop ? 20 : 'auto',
        right: isDesktop ? 20 : 12,
        left: isDesktop ? 'auto' : 12,
        bottom: isDesktop ? 'auto' : 'calc(var(--bottom-tab-h) + 12px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'none',
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((t) => {
        const style = VARIANT_STYLE[t.variant ?? 'info'];
        return (
          <div
            key={t.id}
            role="status"
            onClick={() => dismiss(t.id)}
            style={{
              pointerEvents: 'auto',
              cursor: 'pointer',
              minWidth: isDesktop ? 280 : undefined,
              maxWidth: isDesktop ? 380 : '100%',
              padding: '12px 14px',
              borderRadius: 14,
              background: 'var(--card)',
              border: `1px solid ${style.bg}`,
              boxShadow: 'var(--sh-2)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              animation: 'daniv-fade .2s ease both',
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: style.bg,
                color: style.fg,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {style.icon}
            </span>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>
              {t.message}
            </span>
          </div>
        );
      })}
    </div>
  );
}
