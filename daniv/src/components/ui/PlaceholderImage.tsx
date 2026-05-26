// 이미지 자리표시자 — 시안의 .ph 줄무늬 박스.
// 실제 이미지가 들어가기 전 시안과 동일한 시각을 유지하기 위해 사용.
import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/utils/cn';

type PlaceholderImageProps = {
  label?: ReactNode;
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export function PlaceholderImage({
  label,
  width,
  height,
  radius,
  className,
  style,
  children,
}: PlaceholderImageProps) {
  const merged: CSSProperties = {
    width,
    height,
    borderRadius: radius,
    ...style,
  };
  return (
    <div className={cn('ph', className)} style={merged}>
      {label}
      {children}
    </div>
  );
}
