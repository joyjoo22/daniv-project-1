// 스위치 — 시안에 3가지 변형 존재.
//   • size="md" (Settings) : 42×26, primary 색
//   • size="sm" (Admin)    : 36×22, primary/rose 색 (danger)
//   • size="lg" (Vendor)   : 52×30, rose 색 + ✕ 글리프
import type { CSSProperties } from 'react';

type SwitchProps = {
  on: boolean;
  onChange?: () => void;
  size?: 'sm' | 'md' | 'lg';
  /** 활성 색을 rose 로 (Admin 학식 품절, Vendor 토글) */
  danger?: boolean;
  /** lg 사이즈에서 ON일 때 ✕ 표시 */
  showCross?: boolean;
};

const SIZES = {
  sm: { w: 36, h: 22, pad: 2, knob: 18, x: 14 },
  md: { w: 42, h: 26, pad: 3, knob: 20, x: 16 },
  lg: { w: 52, h: 30, pad: 3, knob: 24, x: 22 },
} as const;

export function Switch({ on, onChange, size = 'md', danger = false, showCross = false }: SwitchProps) {
  const s = SIZES[size];
  const activeBg = danger ? 'oklch(0.65 0.18 18)' : 'var(--primary)';
  const wrapStyle: CSSProperties = {
    width: s.w,
    height: s.h,
    borderRadius: 999,
    padding: s.pad,
    background: on ? activeBg : 'var(--line-2)',
    display: 'flex',
    alignItems: 'center',
    transition: 'background .15s ease',
    cursor: onChange ? 'pointer' : 'default',
    flexShrink: 0,
  };
  const knobStyle: CSSProperties = {
    width: s.knob,
    height: s.knob,
    borderRadius: '50%',
    background: '#fff',
    transform: on ? `translateX(${s.x}px)` : 'translateX(0)',
    transition: 'transform .15s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  return (
    <div onClick={onChange} style={wrapStyle} role="switch" aria-checked={on}>
      <div style={knobStyle}>
        {showCross && on && <span style={{ fontSize: 12 }}>✕</span>}
      </div>
    </div>
  );
}
