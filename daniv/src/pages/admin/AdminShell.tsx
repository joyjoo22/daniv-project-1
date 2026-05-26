// 어드민 셸 — 사이드바 + 메인. 시안 AdminShell 의 데스크탑 구조.
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Wordmark,
  HomeIcon,
  TrophyIcon,
  HeartIcon,
  PinIcon,
  BellIcon,
  GiftIcon,
  UserIcon,
} from '@/components/ui';

type NavItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
  enabled?: boolean;
};

const NAV: NavItem[] = [
  { to: '/admin',             label: '대시보드',     icon: <HomeIcon size={18} />,         enabled: true },
  { to: '/admin/cafeteria',   label: '학식 메뉴',     icon: <span style={{ fontSize: 14 }}>🍱</span>, enabled: true },
  { to: '/admin/restaurants', label: '맛집',         icon: <HeartIcon size={16} />,        enabled: true },
  { to: '/admin/clubs',       label: '동아리',       icon: <TrophyIcon size={16} />,       enabled: true },
  { to: '/admin/buildings',   label: '건물 / 시설',  icon: <PinIcon size={16} />,          enabled: true },
  { to: '/admin/reports',     label: '리뷰 신고함',  icon: <BellIcon size={16} />,         enabled: true },
  { to: '/admin/rewards',     label: '리워드',       icon: <GiftIcon size={16} />,         enabled: true },
  { to: '/admin/users',       label: '사용자',       icon: <UserIcon size={16} />,         enabled: true },
];

export function AdminShell() {
  const { pathname } = useLocation();
  const isActive = (to: string) =>
    to === '/admin' ? pathname === '/admin' : pathname.startsWith(to);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-2)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          background: 'var(--card)',
          borderRight: '1px solid var(--line)',
          display: 'flex',
          flexDirection: 'column',
          padding: '18px 12px',
          position: 'sticky',
          top: 0,
          height: '100vh',
          flexShrink: 0,
        }}
      >
        <div style={{ padding: '0 8px 8px' }}>
          <Wordmark size={18} />
          <p
            className="mono"
            style={{
              margin: '8px 0 0',
              fontSize: 9,
              color: 'var(--ink-4)',
              letterSpacing: '0.1em',
            }}
          >
            ADMIN · v0.3.0
          </p>
        </div>

        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <p
            style={{
              margin: '0 8px 4px',
              fontSize: 10,
              color: 'var(--ink-4)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            관리
          </p>
          {NAV.map((n, i) => {
            const on = n.enabled && isActive(n.to);
            // 미구현 메뉴 — 회색 톤으로 표시하되 클릭은 가능 (대시보드로 이동).
            if (!n.enabled) {
              return (
                <Link
                  key={`${n.to}-${i}`}
                  to={n.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 10,
                    background: 'transparent',
                    color: 'var(--ink-4)',
                    fontSize: 13,
                    fontWeight: 500,
                    textAlign: 'left',
                    opacity: 0.6,
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                    }}
                  >
                    {n.icon}
                  </span>
                  <span style={{ flex: 1 }}>{n.label}</span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: 'var(--ink-4)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    SOON
                  </span>
                </Link>
              );
            }
            return (
              <Link
                key={`${n.to}-${i}`}
                to={n.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 10px',
                  borderRadius: 10,
                  background: on ? 'var(--primary-soft)' : 'transparent',
                  color: on ? 'var(--primary-ink)' : 'var(--ink-2)',
                  fontSize: 13,
                  fontWeight: on ? 700 : 500,
                  textAlign: 'left',
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                  }}
                >
                  {n.icon}
                </span>
                <span style={{ flex: 1 }}>{n.label}</span>
              </Link>
            );
          })}
        </div>

        <div style={{ flex: 1 }} />

        <div
          style={{
            padding: 10,
            borderRadius: 12,
            background: 'var(--bg-2)',
            border: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'var(--ink)',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            관
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>관리자</p>
            <p style={{ margin: 0, fontSize: 10, color: 'var(--ink-4)' }}>학생복지팀</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}

export function AdminHeader({
  title,
  sub,
  action,
}: {
  title: string;
  sub?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: '20px 28px 18px',
        borderBottom: '1px solid var(--line)',
        background: 'var(--bg-2)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        position: 'sticky',
        top: 0,
        zIndex: 4,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>{title}</h1>
        {sub && <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--ink-3)' }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}
