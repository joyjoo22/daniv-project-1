// 단이브 모달 — backdrop 클릭 + ESC 닫힘, 단일 콘텐츠 카드.
// 데스크탑은 가운데 정렬, 모바일은 하단 시트 스타일.
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { CloseIcon } from './Icon';
import { useIsDesktop } from '@/hooks/useBreakpoint';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** 모바일에서 하단 시트 스타일로 (기본) 또는 전체 시트로 */
  size?: 'sheet' | 'full';
  children: ReactNode;
  /** 푸터 (CTA 등) */
  footer?: ReactNode;
};

export function Modal({ open, onClose, title, size = 'sheet', children, footer }: ModalProps) {
  const isDesktop = useIsDesktop();

  // ESC 닫기 + body 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const fullSheet = size === 'full' || !isDesktop;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(20,16,40,0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: isDesktop ? 'center' : 'flex-end',
        justifyContent: 'center',
        padding: isDesktop ? 24 : 0,
        animation: 'daniv-fade .2s ease both',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: isDesktop ? 560 : '100%',
          maxHeight: fullSheet ? '90vh' : '85vh',
          background: 'var(--card)',
          borderRadius: isDesktop ? 22 : '22px 22px 0 0',
          boxShadow: 'var(--sh-3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* 헤더 */}
        {title && (
          <div
            style={{
              padding: '16px 18px',
              borderBottom: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexShrink: 0,
            }}
          >
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em', flex: 1 }}>
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: 'var(--bg-2)',
                color: 'var(--ink-3)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CloseIcon size={18} />
            </button>
          </div>
        )}

        {/* 콘텐츠 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 18 }}>{children}</div>

        {/* 푸터 */}
        {footer && (
          <div
            style={{
              padding: '12px 16px 18px',
              borderTop: '1px solid var(--line)',
              flexShrink: 0,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
