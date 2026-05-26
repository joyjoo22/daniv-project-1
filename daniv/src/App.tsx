// 앱 루트 — RouterProvider + 전역 Toaster.
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Toaster } from '@/components/ui/Toaster';
import { InstallPrompt } from '@/components/ui/InstallPrompt';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { SplashScreen } from '@/components/ui/SplashScreen';
import { useAuthStore } from '@/store/authStore';

// 네이버 지도 SDK 가 호출하는 인증 실패 콜백 — 디버깅 용도.
// SDK 로드 전에 window 에 등록되어 있어야 하므로 모듈 톱레벨에서 즉시 실행.
if (typeof window !== 'undefined') {
  window.navermap_authFailure = () => {
    console.error(
      '[Naver Map] 인증 실패 — NCP 콘솔 설정 확인 필요 ' +
        '(서비스 URL 등록, Web Dynamic Map 활성화, ncpKeyId 일치 여부)',
    );
  };
}

export default function App() {
  const hydrate = useAuthStore((s) => s.hydrate);

  // 앱 마운트 시 토큰이 있다면 사용자 정보 자동 hydrate.
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <>
      <OfflineBanner />
      {/*
        ⚠ RouterProvider 를 transform 애니메이션 wrapper 로 감싸지 말 것!
        transform 이 적용된 요소는 자손의 position:fixed 가 viewport 가 아닌
        wrapper 기준으로 동작해서 BottomTabBar 가 스크롤을 따라가지 못함.
        스플래시 페이드아웃만으로도 진입감 충분.
      */}
      <RouterProvider router={router} />
      <Toaster />
      <InstallPrompt />
      <SplashScreen />
    </>
  );
}
