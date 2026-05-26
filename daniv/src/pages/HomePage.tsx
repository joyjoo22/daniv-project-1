// 홈 화면 — 다음 수업 + 퀵 액션 + 동선 + 날씨/교통 + 학식.
// 모바일: 단일 컬럼 스크롤
// 데스크탑: 헤로(다음 수업) + 사이드 (날씨·교통·학식 카드들) 2-3 컬럼 그리드
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Tag,
  NaverMap,
  CalIcon,
  StampIcon,
  HeartIcon,
  TrophyIcon,
  BellIcon,
  SearchIcon,
  PinIcon,
  WalkIcon,
  CloudIcon,
  BusIcon,
  TrainIcon,
} from '@/components/ui';
import { PageContainer } from '@/components/layout/PageContainer';
import { useIsDesktop } from '@/hooks/useBreakpoint';
import { useAsync } from '@/hooks/useAsync';
import { useComingSoon } from '@/hooks/useComingSoon';
import { weatherApi, transitApi, buildingsApi } from '@/api';
import { useAuthStore } from '@/store/authStore';
import { JUKJEON_CAMPUS } from '@/lib/env';

export default function HomePage() {
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const comingSoon = useComingSoon();
  void comingSoon; // 향후 다른 미구현 액션에 사용 예정
  const user = useAuthStore((s) => s.user);
  const nickname = user?.nickname ?? '단풍이';

  return (
    <PageContainer
      variant="default"
      style={{ padding: isDesktop ? '24px 24px 48px' : '8px 0 24px' }}
    >
      {/* 헤더: 인사말 + 검색/알림 */}
      <div
        style={{
          padding: isDesktop ? '4px 0 18px' : '8px 20px 4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-3)' }}>안녕 {nickname}님 👋</p>
          <p style={{ margin: 0, fontSize: isDesktop ? 22 : 17, fontWeight: 700, letterSpacing: '-0.02em' }}>
            오늘도 화이팅!
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Button variant="icon" aria-label="검색" onClick={() => navigate('/food')}>
            <SearchIcon size={18} />
          </Button>
          <Button
            variant="icon"
            aria-label="알림"
            style={{ position: 'relative' }}
            onClick={() => navigate('/notifications')}
          >
            <BellIcon size={18} />
            <span
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 8,
                height: 8,
                borderRadius: 999,
                background: 'var(--accent)',
                border: '2px solid var(--card)',
              }}
            />
          </Button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? '1.4fr 1fr' : '1fr',
          gap: 14,
          padding: isDesktop ? 0 : '0 16px',
        }}
      >
        {/* 메인 컬럼 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* 다음 수업 헤로 */}
          <NextClassHero />

          {/* 퀵 액션 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {[
              { icon: <CalIcon size={20} />,    label: '시간표', bg: 'var(--primary-soft)',         fg: 'var(--primary-ink)',         to: '/timetable' },
              { icon: <StampIcon size={20} />,  label: '스탬프', bg: 'var(--accent-soft)',          fg: 'var(--accent-ink)',          to: '/stamp' },
              { icon: <HeartIcon size={20} />,  label: '맛집',   bg: 'oklch(0.94 0.04 18)',        fg: 'oklch(0.42 0.14 18)',        to: '/food' },
              { icon: <TrophyIcon size={20} />, label: '동아리', bg: 'oklch(0.94 0.04 165)',       fg: 'oklch(0.42 0.12 165)',       to: '/clubs' },
            ].map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => navigate(q.to)}
                style={{
                  background: 'var(--card)',
                  borderRadius: 18,
                  padding: '14px 8px',
                  border: '1px solid var(--line)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: q.bg,
                    color: q.fg,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {q.icon}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{q.label}</span>
              </button>
            ))}
          </div>

          {/* 오늘의 동선 — 지도 프리뷰 */}
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div
              style={{
                padding: '14px 16px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)', letterSpacing: '0.04em' }}>
                  오늘의 동선
                </p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>IT관 → 학생회관 → 도서관</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/map')}
                style={{ fontSize: 12, color: 'var(--primary-ink)', fontWeight: 600 }}
              >
                전체보기 ›
              </button>
            </div>
            <NaverMap
              height={isDesktop ? 220 : 150}
              markers={[
                { lat: JUKJEON_CAMPUS.lat - 0.0007, lng: JUKJEON_CAMPUS.lng - 0.0003, label: '지금', color: 'var(--accent)' },
                { lat: JUKJEON_CAMPUS.lat + 0.0003, lng: JUKJEON_CAMPUS.lng + 0.0005, label: 'IT관', color: 'var(--primary)' },
              ]}
            />
          </Card>
        </div>

        {/* 우측 컬럼 (데스크탑) / 아래로 (모바일) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* 날씨 + 교통 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 10 }}>
            <WeatherCard />
            <BusCard />
          </div>

          {/* 지하철 */}
          <SubwayCard />

          {/* 학식 */}
          <CafeteriaCard />
        </div>
      </div>
    </PageContainer>
  );
}

function NextClassHero() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        background: 'var(--hero-bg)',
        color: 'var(--hero-fg)',
        borderRadius: 24,
        padding: 18,
        boxShadow: 'var(--sh-2)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -30,
          right: -20,
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: 'var(--primary)',
          opacity: 0.6,
          filter: 'blur(20px)',
        }}
      />
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <Tag variant="amber" style={{ background: 'var(--accent)', color: '#3a1d00' }}>
            다음 수업 · 18분 후
          </Tag>
          <span className="mono" style={{ fontSize: 11, opacity: 0.7 }}>10:30 — 11:45</span>
        </div>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>자료구조와 알고리즘</h2>
        <p style={{ margin: '4px 0 14px', fontSize: 13, opacity: 0.7 }}>김교수 · 전공 3학점</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              padding: '8px 12px',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
            }}
          >
            <PinIcon size={14} /> 죽전 IT관 403호
          </div>
          <div
            style={{
              padding: '8px 12px',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
            }}
          >
            <WalkIcon size={14} /> 7분
          </div>
          <button
            type="button"
            onClick={() => navigate('/map')}
            style={{
              marginLeft: 'auto',
              padding: '8px 14px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.95)',
              color: 'var(--ink)',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            안내 →
          </button>
        </div>
      </div>
    </div>
  );
}

function WeatherCard() {
  const { data: weather, loading } = useAsync(() => weatherApi.current('jukjeon'), []);

  if (loading || !weather) {
    return (
      <Card style={{ padding: 14, minHeight: 110 }}>
        <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>죽전캠퍼스</p>
        <p style={{ margin: '8px 0', fontSize: 12, color: 'var(--ink-4)' }}>날씨 정보 가져오는 중...</p>
      </Card>
    );
  }

  return (
    <Card style={{ padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>죽전캠퍼스</p>
          <p style={{ margin: '2px 0 0', fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>
            {weather.temp}
            <span style={{ fontSize: 14, color: 'var(--ink-3)' }}>°C</span>
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--ink-3)' }}>
            {weather.description} · 강수 {weather.precipitation}%
          </p>
        </div>
        <span style={{ color: 'var(--ink-3)' }}><CloudIcon size={28} /></span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        {weather.hourly.map((h) => (
          <div key={h.hour} style={{ flex: 1, textAlign: 'center' }}>
            <p className="mono" style={{ margin: 0, fontSize: 9, color: 'var(--ink-4)' }}>{h.hour}</p>
            <p className="mono" style={{ margin: '2px 0 0', fontSize: 11, fontWeight: 600 }}>{h.temp}°</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function BusCard() {
  const { data: bus } = useAsync(() => transitApi.bus('24'), []);
  if (!bus) {
    return (
      <Card style={{ padding: 14, minHeight: 110 }}>
        <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>24번 버스</p>
        <p style={{ margin: '8px 0', fontSize: 12, color: 'var(--ink-4)' }}>로딩...</p>
      </Card>
    );
  }
  return (
    <Card style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: 'oklch(0.94 0.05 235)',
            color: 'oklch(0.42 0.16 235)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BusIcon size={16} />
        </span>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>{bus.route}</p>
          <p style={{ margin: 0, fontSize: 10, color: 'var(--ink-4)' }}>{bus.destination}</p>
        </div>
      </div>
      <div
        className="mono"
        style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--primary-ink)' }}
      >
        {bus.minutes[0]}
        <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>분</span>
        {bus.minutes[1] !== undefined && (
          <span style={{ fontSize: 13, color: 'var(--ink-4)', marginLeft: 8 }}>· {bus.minutes[1]}분</span>
        )}
      </div>
    </Card>
  );
}

function SubwayCard() {
  const { data: subway } = useAsync(() => transitApi.subway('jukjeon'), []);
  if (!subway) return null;
  return (
    <Card style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
      <span
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: 'oklch(0.94 0.05 235)',
          color: 'oklch(0.42 0.16 235)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TrainIcon size={20} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>{subway.route} · 죽전역</p>
        <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>왕십리 방면</p>
      </div>
      <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary-ink)' }}>
        {subway.minutes[0]}
        <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>분</span>
      </div>
    </Card>
  );
}

function CafeteriaCard() {
  const { data: cafeteria } = useAsync(() => buildingsApi.cafeteria('b-11'), []);
  const items = cafeteria?.slice(0, 3) ?? [];
  return (
    <Card style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)', letterSpacing: '0.04em' }}>
            오늘의 학식 · 학생회관
          </p>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>점심 메뉴</p>
        </div>
        <Tag variant="mint">영업중</Tag>
      </div>
      {items.map((m, i) => (
        <div
          key={m.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 0',
            borderTop: i ? '1px solid var(--line)' : 'none',
            opacity: m.soldOut ? 0.5 : 1,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', width: 40 }}>{m.corner}</span>
          <span style={{ flex: 1, fontSize: 13, textDecoration: m.soldOut ? 'line-through' : 'none' }}>
            {m.menu}
          </span>
          {m.soldOut ? (
            <Tag variant="rose">품절</Tag>
          ) : (
            <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>
              {m.price.toLocaleString()}원
            </span>
          )}
        </div>
      ))}
    </Card>
  );
}
