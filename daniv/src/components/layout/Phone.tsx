// 모바일 셸 — 시안 ui.jsx의 Phone.
// 화면 전체를 감싸는 컨테이너. dark prop 으로 다크 모드 직접 적용 (시안 호환).
//
// 실제 라우팅에서는 RouterLayout 안쪽에서 사용되므로, html.dark 클래스로
// 다크 모드를 토글하는 것이 기본 — Phone 의 dark prop 은 시안 데모용으로 유지.
import type { ReactNode } from 'react';
import { StatusBar } from './StatusBar';

type PhoneProps = {
  children: ReactNode;
  /** 시안 호환: 이 셸 내부에서만 강제로 다크 모드 적용 (data-theme 사용) */
  dark?: boolean;
  /** 상태바 숨기기 (실제 PWA 환경에서 사용) */
  hideStatusBar?: boolean;
};

export function Phone({ children, dark = false, hideStatusBar = false }: PhoneProps) {
  return (
    <div
      data-daniv-phone=""
      // dark prop은 시안 호환을 위해 컨테이너에 .dark 클래스를 추가.
      // 글로벌 html.dark 와 함께 자식에 영향을 미친다.
      className={dark ? 'dark' : undefined}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
        color: 'var(--ink)',
      }}
    >
      {!hideStatusBar && <StatusBar dark={dark} />}
      {children}
    </div>
  );
}
