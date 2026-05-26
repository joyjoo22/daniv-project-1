// 카드 — 시안의 .card 글로벌 클래스 래퍼.
import type { ReactNode, CSSProperties } from 'react';
import { cn } from '@/utils/cn';

type CardProps = {
  as?: 'div' | 'section' | 'article';
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  onClick?: () => void;
};

export function Card({ as: Tag = 'div', className, style, children, onClick }: CardProps) {
  return (
    <Tag className={cn('card', className)} style={style} onClick={onClick}>
      {children}
    </Tag>
  );
}
