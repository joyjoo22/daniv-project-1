// 앱 전체 셸 — 5탭 그룹 화면(`/`, `/map`, `/stamp`, `/food`, `/me`, `/timetable`)의 부모 레이아웃.
//
// 모바일(<768px): 컨텐츠 풀스크린 + 하단 BottomTabBar
// 데스크탑(>=768px): 좌측 Sidebar + 우측 컨텐츠 영역
//
// 시안의 모바일 화면을 그대로 보존하되, 데스크탑에서는 적절한 멀티컬럼 폭으로 확장.
import { Outlet } from 'react-router-dom';
import { useIsDesktop } from '@/hooks/useBreakpoint';
import { BottomTabBar } from './BottomTabBar';
import { Sidebar } from './Sidebar';
import { AuthGuard } from './AuthGuard';

export function AppLayout() {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <AuthGuard>
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
          <Sidebar />
          <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <Outlet />
          </main>
        </div>
      </AuthGuard>
    );
  }

  // 모바일: 하단 탭바는 position:fixed 라 컨텐츠 영역에 padding-bottom 으로
  // 자리 확보. 탭바 높이는 토큰의 --bottom-tab-h.
  return (
    <AuthGuard>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          background: 'var(--bg)',
        }}
      >
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            paddingBottom: 'var(--bottom-tab-h)',
          }}
        >
          <Outlet />
        </main>
        <BottomTabBar mode="route" />
      </div>
    </AuthGuard>
  );
}
