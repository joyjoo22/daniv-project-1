// 데스크탑/태블릿 사이드바 — 모바일의 BottomTabBar 를 768px 이상에서 대체.
// 5탭 (홈/지도/스탬프/맛집/MY) + 설정/로그아웃 보조 메뉴.
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  MapIcon,
  StampIcon,
  HeartIcon,
  UserIcon,
  SettingsIcon,
  CalIcon,
  TrophyIcon,
} from '@/components/ui/Icon';
import { Wordmark } from '@/components/ui/Wordmark';

type NavItem = {
  to: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
};

const PRIMARY_NAV: NavItem[] = [
  { to: '/',          label: '홈',     icon: () => <HomeIcon size={20} /> },
  { to: '/map',       label: '지도',   icon: () => <MapIcon size={20} /> },
  { to: '/timetable', label: '시간표', icon: () => <CalIcon size={20} /> },
  { to: '/stamp',     label: '스탬프', icon: () => <StampIcon size={20} /> },
  { to: '/food',      label: '맛집',   icon: (a) => <HeartIcon size={20} filled={a} /> },
  { to: '/clubs',     label: '동아리', icon: () => <TrophyIcon size={20} /> },
  { to: '/me',        label: 'MY',     icon: () => <UserIcon size={20} /> },
];

const SECONDARY_NAV: NavItem[] = [
  { to: '/settings', label: '설정', icon: () => <SettingsIcon size={18} /> },
];

function isActive(pathname: string, to: string) {
  if (to === '/') return pathname === '/';
  return pathname === to || pathname.startsWith(to + '/');
}

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        background: 'var(--card)',
        borderRight: '1px solid var(--line)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 14px',
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      <div style={{ padding: '4px 8px 18px' }}>
        <Wordmark size={22} />
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }} aria-label="주요 메뉴">
        {PRIMARY_NAV.map((n) => {
          const on = isActive(pathname, n.to);
          return (
            <Link
              key={n.to}
              to={n.to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 12,
                background: on ? 'var(--primary-soft)' : 'transparent',
                color: on ? 'var(--primary-ink)' : 'var(--ink-2)',
                fontSize: 14,
                fontWeight: on ? 700 : 500,
              }}
            >
              <span style={{ width: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {n.icon(on)}
              </span>
              <span>{n.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }} aria-label="보조 메뉴">
        {SECONDARY_NAV.map((n) => {
          const on = isActive(pathname, n.to);
          return (
            <Link
              key={n.to}
              to={n.to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 12,
                background: on ? 'var(--bg-2)' : 'transparent',
                color: 'var(--ink-3)',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              <span style={{ width: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {n.icon(on)}
              </span>
              <span>{n.label}</span>
            </Link>
          );
        })}
      </nav>

      <p className="mono" style={{ margin: '14px 8px 0', fontSize: 10, color: 'var(--ink-4)', letterSpacing: '0.08em' }}>
        DANIV · v0.3.0
      </p>
    </aside>
  );
}
