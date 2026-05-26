// 탭 없는 전체 화면 레이아웃 — 상세 페이지 + 설정. AuthGuard 적용 (보호된 라우트).
import { Outlet } from 'react-router-dom';
import { AuthGuard } from './AuthGuard';

export function PlainLayout() {
  return (
    <AuthGuard>
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Outlet />
      </div>
    </AuthGuard>
  );
}

/** 비인증 라우트용 — 온보딩 / 로그인. AuthGuard 없음. */
export function PublicLayout() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Outlet />
    </div>
  );
}
