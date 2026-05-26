// 동아리 목록 — 카테고리 필터 + 카드 그리드.
// 모바일: 1열, 데스크탑: 2~3열.
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Chip,
  Tag,
  Button,
  Field,
  SearchIcon,
  CloseIcon,
  PinIcon,
  UserIcon,
  TrophyIcon,
} from '@/components/ui';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { useIsDesktop } from '@/hooks/useBreakpoint';
import { useAsync } from '@/hooks/useAsync';
import { useComingSoon } from '@/hooks/useComingSoon';
import { clubsApi } from '@/api';

const FILTERS = ['전체', '문화/예술', '체육', '학술', '봉사', '취미', '모집중'] as const;

export default function ClubListPage() {
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const comingSoon = useComingSoon();
  void comingSoon; // 더 이상 사용 안 함
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('전체');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const { data, loading, error } = useAsync(
    () =>
      clubsApi.list({
        category: filter === '모집중' || filter === '전체' ? undefined : filter,
        recruiting: filter === '모집중' ? true : undefined,
      }),
    [filter],
  );

  const allClubs = data ?? [];
  const clubs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allClubs;
    return allClubs.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.description ?? '').toLowerCase().includes(q),
    );
  }, [allClubs, query]);
  const recruitingCount = allClubs.filter((c) => c.recruiting).length;

  return (
    <>
      <TopBar
        title="중앙동아리"
        action={
          <Button
            variant="icon"
            aria-label={searchOpen ? '검색 닫기' : '검색 열기'}
            onClick={() => {
              setSearchOpen((v) => {
                if (v) setQuery('');
                return !v;
              });
            }}
          >
            {searchOpen ? <CloseIcon size={18} /> : <SearchIcon size={18} />}
          </Button>
        }
      />
      <PageContainer variant="default" style={{ padding: isDesktop ? '8px 24px 48px' : '0 0 24px' }}>
        {searchOpen && (
          <div style={{ padding: isDesktop ? '0 0 12px' : '0 16px 12px' }}>
            <Field
              placeholder="동아리명 / 카테고리 / 소개로 검색"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        )}
        {/* 필터 */}
        <div
          style={{
            padding: isDesktop ? '0 0 12px' : '0 16px 8px',
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
          }}
        >
          {FILTERS.map((f) => (
            <Chip key={f} active={filter === f} onCard onClick={() => setFilter(f)}>
              {f}
            </Chip>
          ))}
        </div>

        {/* 통계 / 카운트 */}
        <div
          style={{
            padding: isDesktop ? '0 0 12px' : '8px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
            {loading ? '불러오는 중...' : `${clubs.length}개 동아리`}
          </span>
          <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>모집중 {recruitingCount}개</span>
        </div>

        {error && (
          <p
            role="alert"
            style={{
              padding: 16,
              margin: isDesktop ? 0 : '0 16px',
              color: 'oklch(0.42 0.14 18)',
              background: 'oklch(0.94 0.04 18)',
              borderRadius: 12,
              fontSize: 13,
            }}
          >
            동아리 목록을 불러오지 못했어요.
          </p>
        )}

        {/* 카드 그리드 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isDesktop
              ? 'repeat(auto-fill, minmax(260px, 1fr))'
              : '1fr',
            gap: 10,
            padding: isDesktop ? 0 : '0 16px',
          }}
        >
          {clubs.map((c) => (
            <Card
              key={c.id}
              style={{ padding: 14, cursor: 'pointer' }}
              onClick={() => navigate(`/club/${c.id}`)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: c.logoColor ?? 'var(--ink)',
                    color: '#fff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    flexShrink: 0,
                  }}
                >
                  {c.name[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {c.name}
                    </p>
                    {c.recruiting && <Tag variant="indigo">모집중</Tag>}
                  </div>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--ink-3)' }}>
                    {c.category} · 중앙동아리
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  marginTop: 12,
                  paddingTop: 10,
                  borderTop: '1px solid var(--line)',
                  fontSize: 11,
                  color: 'var(--ink-3)',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <PinIcon size={12} /> {c.buildingName} {c.room}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <UserIcon size={12} />
                  <span className="mono">{c.members}</span>명
                </span>
                {c.awards > 0 && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      color: 'var(--accent-ink)',
                    }}
                  >
                    <TrophyIcon size={12} />
                    <span className="mono">{c.awards}</span>
                  </span>
                )}
              </div>
            </Card>
          ))}

          {clubs.length === 0 && (
            <Card
              style={{
                padding: 24,
                textAlign: 'center',
                color: 'var(--ink-4)',
                fontSize: 13,
              }}
            >
              해당 카테고리에 등록된 동아리가 없어요.
            </Card>
          )}
        </div>
      </PageContainer>
    </>
  );
}
