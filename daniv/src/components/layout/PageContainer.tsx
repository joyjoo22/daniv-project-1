// 컨텐츠 폭 정규화 — 모바일에서는 풀폭, 데스크탑에서는 maxWidth 로 가독성 유지.
//
// variant:
//   - 'narrow'  : 580px  (상세 페이지 — 음식점 상세, 동아리 상세, 설정 등)
//   - 'default' : 920px  (홈, 맛집 리스트, 시간표 — 다중 컬럼)
//   - 'wide'    : 1200px (어드민 대시보드)
//   - 'full'    : 풀폭   (지도)
import type { ReactNode, CSSProperties } from 'react';

type Variant = 'narrow' | 'default' | 'wide' | 'full';

const MAX: Record<Variant, string | undefined> = {
  narrow: '580px',
  default: '920px',
  wide: '1200px',
  full: undefined,
};

type PageContainerProps = {
  variant?: Variant;
  className?: string;
  style?: CSSProperties;
  /** 좌우 패딩 제거 (예: 지도 풀폭) */
  noPadding?: boolean;
  children: ReactNode;
};

export function PageContainer({
  variant = 'default',
  className,
  style,
  noPadding = false,
  children,
}: PageContainerProps) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        maxWidth: MAX[variant],
        margin: '0 auto',
        padding: noPadding ? 0 : '0 16px',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
