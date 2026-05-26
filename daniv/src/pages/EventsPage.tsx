// 학사 일정 / 이벤트 페이지
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Chip, Tag } from '@/components/ui';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { useIsDesktop } from '@/hooks/useBreakpoint';
import { MOCK_EVENTS } from '@/data/mock';
import type { CampusEvent, EventCategory } from '@/types/domain';

const FILTERS: Array<'전체' | EventCategory> = ['전체', '축제', '학사', '공지', '동아리'];

const CATEGORY_VARIANT: Record<EventCategory, 'rose' | 'indigo' | 'amber' | 'mint'> = {
  축제: 'rose',
  학사: 'indigo',
  공지: 'amber',
  동아리: 'mint',
  기타: 'indigo',
};

export default function EventsPage() {
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('전체');

  const visible =
    filter === '전체' ? MOCK_EVENTS : MOCK_EVENTS.filter((e) => e.category === filter);

  const pinned = visible.filter((e) => e.isPinned);
  const regular = visible.filter((e) => !e.isPinned);

  return (
    <>
      <TopBar title="학사 일정 · 이벤트" onBack={() => navigate(-1)} />
      <PageContainer
        variant="narrow"
        style={{ padding: isDesktop ? '8px 24px 48px' : '0 16px 24px' }}
      >
        {/* 통계 */}
        <Card
          style={{
            padding: '14px 16px',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background:
              'radial-gradient(circle at 0% 50%, var(--primary-soft) 0%, var(--card) 60%)',
          }}
        >
          <span style={{ fontSize: 28 }}>📅</span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>이번 학기 일정</p>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>
              <span className="mono">{MOCK_EVENTS.length}</span>개
            </p>
          </div>
          {pinned.length > 0 && (
            <Tag variant="amber">📌 고정 {pinned.length}</Tag>
          )}
        </Card>

        {/* 필터 칩 */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 12 }}>
          {FILTERS.map((f) => (
            <Chip key={f} active={filter === f} onCard onClick={() => setFilter(f)}>
              {f}
            </Chip>
          ))}
        </div>

        {/* 고정 이벤트 */}
        {pinned.length > 0 && (
          <>
            <p
              style={{
                margin: '8px 4px 8px',
                fontSize: 11,
                color: 'var(--ink-4)',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              📌 진행 중인 이벤트
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {pinned.map((e) => (
                <EventCard key={e.id} event={e} highlight onClick={() => e.linkUrl && navigate(e.linkUrl)} />
              ))}
            </div>
          </>
        )}

        {/* 일반 일정 */}
        {regular.length > 0 && (
          <>
            <p
              style={{
                margin: '8px 4px 8px',
                fontSize: 11,
                color: 'var(--ink-4)',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              일정
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {regular.map((e) => (
                <EventCard key={e.id} event={e} onClick={() => e.linkUrl && navigate(e.linkUrl)} />
              ))}
            </div>
          </>
        )}

        {visible.length === 0 && (
          <Card style={{ padding: 48, textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 30, marginBottom: 12 }}>📅</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--ink-2)' }}>
              해당 카테고리의 일정이 없어요
            </p>
          </Card>
        )}
      </PageContainer>
    </>
  );
}

type EventCardProps = {
  event: CampusEvent;
  highlight?: boolean;
  onClick?: () => void;
};

function EventCard({ event, highlight, onClick }: EventCardProps) {
  const clickable = !!onClick;
  return (
    <Card
      style={{
        padding: 14,
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        cursor: clickable ? 'pointer' : 'default',
        background: highlight
          ? 'linear-gradient(135deg, var(--primary-soft) 0%, var(--card) 100%)'
          : 'var(--card)',
        border: highlight ? '1px solid oklch(0.86 0.06 270)' : '1px solid var(--line)',
      }}
      onClick={onClick}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: 'var(--bg-2)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          flexShrink: 0,
        }}
      >
        {event.coverEmoji ?? '📌'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Tag variant={CATEGORY_VARIANT[event.category]}>{event.category}</Tag>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              flex: 1,
              minWidth: 0,
            }}
          >
            {event.title}
          </p>
        </div>
        <p
          style={{
            margin: '6px 0 0',
            fontSize: 12,
            color: 'var(--ink-3)',
            lineHeight: 1.55,
          }}
        >
          {event.description}
        </p>
        <p
          style={{
            margin: '8px 0 0',
            fontSize: 11,
            color: 'var(--ink-4)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <span className="mono">{event.startAt}</span>
          {event.endAt && (
            <>
              <span>·</span>
              <span className="mono">~ {event.endAt}</span>
            </>
          )}
          {event.location && (
            <>
              <span>·</span>
              <span>📍 {event.location}</span>
            </>
          )}
        </p>
      </div>
    </Card>
  );
}
