// 단이브 버튼 — 시안에 5가지 자주 등장하는 변형.
//   • primary : .btn-primary (검정 배경, 큰 CTA)
//   • ghost   : .btn-ghost (회색 배경, 보조)
//   • icon    : 38×38 카드 + 라인 (Home 우상단 검색/벨 같은 곳)
//   • hero    : 38×38 흰색 반투명 (이미지 위 뒤로가기/하트 — heroBtn)
//   • fab     : 44×44 카드 + sh2 그림자 (지도 우하단 FAB)
import type { ButtonHTMLAttributes, ReactNode, CSSProperties } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'ghost' | 'icon' | 'hero' | 'fab';

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  variant?: Variant;
  children?: ReactNode;
};

const ICON_STYLE: CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 12,
  background: 'var(--card)',
  border: '1px solid var(--line)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--ink-2)',
};

const HERO_STYLE: CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 12,
  background: 'var(--hero-btn-bg)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--hero-btn-fg)',
};

const FAB_STYLE: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 14,
  background: 'var(--card)',
  color: 'var(--ink-2)',
  boxShadow: 'var(--sh-2)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export function Button({ variant = 'primary', className, style, children, ...rest }: Props) {
  if (variant === 'primary') {
    return (
      <button className={cn('btn-primary', className)} style={style} {...rest}>
        {children}
      </button>
    );
  }
  if (variant === 'ghost') {
    return (
      <button className={cn('btn-ghost', className)} style={style} {...rest}>
        {children}
      </button>
    );
  }
  const baseStyle = variant === 'icon' ? ICON_STYLE : variant === 'hero' ? HERO_STYLE : FAB_STYLE;
  return (
    <button className={className} style={{ ...baseStyle, ...style }} {...rest}>
      {children}
    </button>
  );
}
