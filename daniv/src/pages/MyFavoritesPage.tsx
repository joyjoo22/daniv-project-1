// MY → 즐겨찾기 (음식점 / 동아리 / 건물 통합)
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Chip, PlaceholderImage, HeartIcon, PinIcon, TrophyIcon } from '@/components/ui';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { useIsDesktop } from '@/hooks/useBreakpoint';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useUIStore } from '@/store/uiStore';
import type { FavoriteTarget } from '@/types/domain';

type Filter = 'all' | FavoriteTarget;

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: 'all',        label: '전체' },
  { value: 'restaurant', label: '맛집' },
  { value: 'club',       label: '동아리' },
  { value: 'building',   label: '건물' },
];

const TARGET_LABEL: Record<FavoriteTarget, string> = {
  restaurant: '맛집',
  club: '동아리',
  building: '건물',
};

export default function MyFavoritesPage() {
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const { items, isLoaded, load, remove } = useFavoritesStore();
  const pushToast = useUIStore((s) => s.pushToast);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    load();
  }, [load]);

  const visible = filter === 'all' ? items : items.filter((f) => f.targetType === filter);

  const counts = {
    restaurant: items.filter((f) => f.targetType === 'restaurant').length,
    club:       items.filter((f) => f.targetType === 'club').length,
    building:   items.filter((f) => f.targetType === 'building').length,
  };

  const handleNavigate = (type: FavoriteTarget, id: string) => {
    if (type === 'restaurant') navigate(`/food/${id}`);
    else if (type === 'club')   navigate(`/club/${id}`);
    else if (type === 'building') navigate(`/building/${id}`);
  };

  const handleRemove = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await remove(id);
      pushToast(`${name} 즐겨찾기에서 제거됨`, 'success');
    } catch {
      pushToast('제거 실패', 'error');
    }
  };

  return (
    <>
      <TopBar title="즐겨찾기" onBack={() => navigate(-1)} />
      <PageContainer variant="narrow" style={{ padding: isDesktop ? '8px 24px 48px' : '0 16px 24px' }}>
        {/* 헤더 통계 */}
        <Card
          style={{
            padding: '14px 16px',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'oklch(0.94 0.04 18)',
              color: 'oklch(0.42 0.14 18)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HeartIcon size={22} filled />
          </span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>총 즐겨찾기</p>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>
              <span className="mono">{items.length}</span>개
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--ink-3)' }}>
            <span>맛집 {counts.restaurant}</span>
            <span>·</span>
            <span>동아리 {counts.club}</span>
            <span>·</span>
            <span>건물 {counts.building}</span>
          </div>
        </Card>

        {/* 필터 칩 */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 12 }}>
          {FILTERS.map((f) => (
            <Chip key={f.value} active={filter === f.value} onCard onClick={() => setFilter(f.value)}>
              {f.label}
            </Chip>
          ))}
        </div>

        {!isLoaded ? (
          <Card style={{ padding: 32, textAlign: 'center', color: 'var(--ink-4)' }}>
            불러오는 중...
          </Card>
        ) : visible.length === 0 ? (
          <Card style={{ padding: 48, textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 30, marginBottom: 12 }}>💛</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--ink-2)' }}>
              {filter === 'all'
                ? '아직 즐겨찾기가 없어요'
                : `즐겨찾기한 ${TARGET_LABEL[filter as FavoriteTarget]}이 없어요`}
            </p>
            <p style={{ margin: '6px 0 16px', fontSize: 12, color: 'var(--ink-4)' }}>
              상세 페이지의 ❤️ 버튼을 눌러 즐겨찾기에 추가하세요
            </p>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {visible.map((f) => (
              <Card
                key={f.id}
                style={{ padding: 12, display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer' }}
                onClick={() => handleNavigate(f.targetType, f.targetId)}
              >
                {/* 썸네일 — 타입별 다른 비주얼 */}
                {f.targetType === 'restaurant' ? (
                  <PlaceholderImage label={f.imageLabel ?? '맛집'} width={56} height={56} radius={12} />
                ) : (
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 12,
                      background:
                        f.targetType === 'club'
                          ? 'var(--primary)'
                          : 'oklch(0.62 0.14 60)',
                      color: '#fff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {f.targetType === 'club' ? <TrophyIcon size={24} /> : <PinIcon size={24} />}
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
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
                      {f.targetName}
                    </p>
                  </div>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>
                    {f.targetMeta}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 10, color: 'var(--ink-4)' }}>
                    추가 · {f.createdAt}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleRemove(f.id, f.targetName, e)}
                  aria-label="즐겨찾기 해제"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'oklch(0.94 0.04 18)',
                    color: 'oklch(0.42 0.14 18)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <HeartIcon size={18} filled />
                </button>
              </Card>
            ))}
          </div>
        )}
      </PageContainer>
    </>
  );
}
