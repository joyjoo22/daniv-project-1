// 맛집 리스트 — restaurantsApi.list() 기반. 카테고리 필터 변경 시 자동 재요청.
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Chip,
  Tag,
  Stars,
  PlaceholderImage,
  Button,
  Field,
  StampIcon,
  SearchIcon,
  CloseIcon,
} from '@/components/ui';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { useIsDesktop } from '@/hooks/useBreakpoint';
import { useAsync } from '@/hooks/useAsync';
import { restaurantsApi } from '@/api';

const FILTERS = ['전체', '한식', '분식', '일식', '중식', '카페', '치킨/맥주'] as const;

type SortKey = 'distance' | 'rating' | 'reviews';

export default function FoodListPage() {
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('전체');
  const [sort, setSort] = useState<SortKey>('distance');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const { data: restaurants, loading, error } = useAsync(
    () => restaurantsApi.list({ category: filter }),
    [filter],
  );

  // 검색어 + 정렬 적용
  const visible = useMemo(() => {
    const list = (restaurants ?? []).slice();
    const q = query.trim().toLowerCase();
    const filtered = q
      ? list.filter(
          (r) =>
            r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q),
        )
      : list;
    return filtered.sort((a, b) => {
      if (sort === 'distance') return a.walkMin - b.walkMin;
      if (sort === 'rating') return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });
  }, [restaurants, query, sort]);

  const SORT_LABEL: Record<SortKey, string> = {
    distance: '거리순',
    rating: '평점순',
    reviews: '리뷰많은순',
  };

  const cycleSort = () => {
    setSort((s) => (s === 'distance' ? 'rating' : s === 'rating' ? 'reviews' : 'distance'));
  };

  return (
    <>
      <TopBar
        title="맛집"
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
              placeholder="음식점 이름 / 카테고리로 검색"
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

        {/* 정렬 + 카운트 */}
        <div
          style={{
            padding: isDesktop ? '0 0 12px' : '8px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
            {loading ? '불러오는 중...' : `${visible.length}개 장소`}
          </span>
          <button
            type="button"
            onClick={cycleSort}
            style={{
              fontSize: 12,
              color: 'var(--ink-2)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {SORT_LABEL[sort]}
            <svg width="10" height="10" viewBox="0 0 12 12">
              <path
                d="m2 4 4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </button>
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
            맛집 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </p>
        )}

        {/* 카드 리스트 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? 'repeat(2, 1fr)' : '1fr',
            gap: 10,
            padding: isDesktop ? 0 : '0 16px',
          }}
        >
          {visible.map((p) => (
            <Card
              key={p.id}
              style={{ padding: 12, display: 'flex', gap: 12, alignItems: 'stretch', cursor: 'pointer' }}
              onClick={() => navigate(`/food/${p.id}`)}
            >
              <PlaceholderImage label={p.imageLabel} width={78} height={78} radius={14} />
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em' }}>{p.name}</p>
                    {p.hot && <Tag variant="rose">🔥 HOT</Tag>}
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-3)' }}>
                    {p.category} · {p.price} · 도보 {p.walkMin}분
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Stars value={p.rating} size={12} />
                    <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>{p.rating}</span>
                    <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>({p.reviewCount})</span>
                  </div>
                  {p.hasStamp && (
                    <Tag variant="indigo" style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <StampIcon size={11} /> 스탬프
                    </Tag>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {!loading && !error && visible.length === 0 && (
            <Card
              style={{
                padding: 24,
                textAlign: 'center',
                color: 'var(--ink-4)',
                fontSize: 13,
              }}
            >
              해당 카테고리에 맛집이 없어요.
            </Card>
          )}
        </div>
      </PageContainer>
    </>
  );
}
