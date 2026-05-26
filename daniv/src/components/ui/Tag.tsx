// 태그 (작은 배지) — 시안의 .tag + .tag-amber/-indigo/-mint/-rose 글로벌 클래스 활용.
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type TagVariant = 'amber' | 'indigo' | 'mint' | 'rose';

type TagProps = {
  variant?: TagVariant;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
};

export function Tag({ variant = 'indigo', className, style, children }: TagProps) {
  return (
    <span className={cn('tag', `tag-${variant}`, className)} style={style}>
      {children}
    </span>
  );
}
