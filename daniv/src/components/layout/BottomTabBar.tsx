// 하단 탭 — 시안 ui.jsx의 TabBar (5탭: 홈/지도/스탬프/맛집/MY).
//
// 시안에서는 onChange 콜백으로만 동작했지만, 실제 앱에서는 라우팅을 위해 두 가지 모드를 지원:
//   1) 'state' 모드 — active + onChange (시안 데모와 동일)
//   2) 'route' 모드 — useLocation 기반 자동 active + Link 네비게이션 (실제 라우팅)
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  MapIcon,
  StampIcon,
  HeartIcon,
  UserIcon,
} from '@/components/ui/Icon';

export type TabId = 'home' | 'map' | 'stamp' | 'food' | 'me';

const TABS: Array<{
  id: TabId;
  label: string;
  to: string;
  icon: (active: boolean) => React.ReactNode;
}> = [
  { id: 'home',  label: '홈',     to: '/',       icon: () => <HomeIcon size={22} /> },
  { id: 'map',   label: '지도',   to: '/map',    icon: () => <MapIcon size={22} /> },
  { id: 'stamp', label: '스탬프', to: '/stamp',  icon: () => <StampIcon size={22} /> },
  { id: 'food',  label: '맛집',   to: '/food',   icon: (active) => <HeartIcon size={22} filled={active} /> },
  { id: 'me',    label: 'MY',     to: '/me',     icon: () => <UserIcon size={22} /> },
];

type CommonStyles = {
  outer: React.CSSProperties;
  itemBase: React.CSSProperties;
  pill: (on: boolean) => React.CSSProperties;
};

const styles: CommonStyles = {
  outer: {
    // 모바일에서 스크롤과 무관하게 항상 보이도록 fixed 처리.
    // env(safe-area-inset-bottom) 으로 iOS 홈 인디케이터 영역까지 자연스럽게 패딩.
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    display: 'flex',
    padding: '8px 8px calc(env(safe-area-inset-bottom, 0px) + 14px)',
    background: 'var(--card)',
    borderTop: '1px solid var(--line)',
    flexShrink: 0,
  },
  itemBase: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
    padding: '6px 0',
    transition: 'color .15s ease',
  },
  pill: (on) => ({
    padding: '4px 12px',
    borderRadius: 999,
    background: on ? 'var(--primary-soft)' : 'transparent',
    color: on ? 'var(--primary-ink)' : 'inherit',
    transition: 'background .15s ease',
  }),
};

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: '-0.02em',
};

// ─────────── state 모드 (시안 호환) ───────────
type StateProps = {
  mode?: 'state';
  active: TabId;
  onChange: (id: TabId) => void;
};

// ─────────── route 모드 (실제 라우팅) ───────────
type RouteProps = {
  mode: 'route';
};

type Props = StateProps | RouteProps;

function isActiveByLocation(pathname: string, to: string): boolean {
  if (to === '/') return pathname === '/';
  return pathname === to || pathname.startsWith(to + '/');
}

export function BottomTabBar(props: Props) {
  // route 모드: 위치 기반 active 자동 계산
  const location = useLocation();

  if (props.mode === 'route') {
    return (
      <nav style={styles.outer} aria-label="하단 탭">
        {TABS.map((t) => {
          const on = isActiveByLocation(location.pathname, t.to);
          return (
            <Link
              key={t.id}
              to={t.to}
              style={{
                ...styles.itemBase,
                color: on ? 'var(--ink)' : 'var(--ink-4)',
              }}
            >
              <div style={styles.pill(on)}>{t.icon(on)}</div>
              <span style={LABEL_STYLE}>{t.label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  // state 모드: 시안과 동일하게 콜백 기반
  const { active, onChange } = props;
  return (
    <div style={styles.outer}>
      {TABS.map((t) => {
        const on = active === t.id;
        return (
          <button
            type="button"
            key={t.id}
            onClick={() => onChange(t.id)}
            style={{
              ...styles.itemBase,
              color: on ? 'var(--ink)' : 'var(--ink-4)',
              background: 'transparent',
            }}
          >
            <div style={styles.pill(on)}>{t.icon(on)}</div>
            <span style={LABEL_STYLE}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
