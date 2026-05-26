// 통계 표시 — 시안의 Stat / Mini 두 변형 통합.
//   • Stat: 큰 숫자 (20px) + 라벨 — 카드 내부 인라인 배치
//   • Mini: 작은 숫자 (18px) 카드 형태 (.card 래퍼 포함)
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type StatProps = {
  n: ReactNode;
  l: ReactNode;
  className?: string;
};

export function Stat({ n, l, className }: StatProps) {
  return (
    <div className={className}>
      <p className="mono" style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>
        {n}
      </p>
      <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-3)' }}>{l}</p>
    </div>
  );
}

type MiniProps = {
  n: ReactNode;
  l: ReactNode;
  className?: string;
};

export function Mini({ n, l, className }: MiniProps) {
  return (
    <div className={cn('card', className)} style={{ padding: '12px 10px', textAlign: 'center' }}>
      <p className="mono" style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>
        {n}
      </p>
      <p style={{ margin: '2px 0 0', fontSize: 10, color: 'var(--ink-3)' }}>{l}</p>
    </div>
  );
}
