// 보호된 라우트 가드 — 미인증 시 자동으로 /onboarding 으로 리다이렉트.
//
// PHASE 4 에서 만든 authStore 의 isAuthenticated 를 신뢰원천으로 사용.
// 토큰이 localStorage 에 있고 hydrate 가 끝나기 전에 잠시 false 인 경우를
// 대비해 token 만 있어도 통과시키는 관용 처리를 추가.
import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthStore } from '@/store/authStore';

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const { token, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!token && !isAuthenticated) {
    return <Navigate to="/onboarding" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
