// 칩 — 시안의 .chip + data-active 패턴.
import type { ReactNode, MouseEventHandler } from 'react';
import { cn } from '@/utils/cn';

type ChipProps = {
  active?: boolean;
  /** 비활성 시 배경을 카드 색으로 (시안의 흰 카드 위 배치 패턴) */
  onCard?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
};

export function Chip({ active = false, onCard = false, onClick, className, style, children }: ChipProps) {
  const inlineStyle: React.CSSProperties = {
    ...(!active && onCard ? { background: 'var(--card)' } : {}),
    ...style,
  };
  return (
    <button
      type="button"
      className={cn('chip', className)}
      data-active={active ? 'true' : undefined}
      onClick={onClick}
      style={inlineStyle}
    >
      {children}
    </button>
  );
}
