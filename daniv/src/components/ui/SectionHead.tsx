// 섹션 헤더 — 시안 SettingsScreen 의 SectionHead.
// 작은 uppercase 라벨 (대문자 + 자간 0.06em).
import type { ReactNode } from 'react';

type SectionHeadProps = { children: ReactNode };

export function SectionHead({ children }: SectionHeadProps) {
  return (
    <p
      style={{
        margin: '20px 4px 8px',
        fontSize: 11,
        color: 'var(--ink-4)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontWeight: 700,
      }}
    >
      {children}
    </p>
  );
}
