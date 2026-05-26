// 상단 바 — 시안 ui.jsx의 TopBar.
// 뒤로가기(옵션) + 제목 + 우측 액션 슬롯. sticky 기본값 true.
import type { ReactNode } from 'react';
import { ChevronLeftIcon } from '@/components/ui/Icon';

type TopBarProps = {
  title: string;
  onBack?: () => void;
  action?: ReactNode;
  dark?: boolean;
  sticky?: boolean;
};

export function TopBar({ title, onBack, action, dark = false, sticky = true }: TopBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 16px 12px',
        background: dark ? 'transparent' : 'var(--bg)',
        position: sticky ? 'sticky' : 'static',
        top: 0,
        zIndex: 4,
        flexShrink: 0,
      }}
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로가기"
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--card)',
            border: '1px solid var(--line)',
          }}
        >
          <ChevronLeftIcon size={18} />
        </button>
      )}
      <h1
        style={{
          flex: 1,
          fontSize: 17,
          fontWeight: 700,
          margin: 0,
          color: dark ? '#fff' : 'var(--ink)',
        }}
      >
        {title}
      </h1>
      {action}
    </div>
  );
}
