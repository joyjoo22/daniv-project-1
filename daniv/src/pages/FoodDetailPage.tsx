// 음식점 상세 — 히어로 + 메타 + 별점/리뷰수 + 영업/전화/가격대 + 세그먼트 + 리뷰 + 스티키 CTA
// 데스크탑에서는 히어로/메타 좌측, 리뷰 우측 2컬럼 레이아웃.
//
// "도장 받기" 버튼: GPS 위치 모킹 → 인증 → pointsApi.earnStamp() → 토스트.
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Tag,
  Stars,
  PlaceholderImage,
  Segmented,
  HeartIcon,
  ShareIcon,
  ChevronLeftIcon,
  PlusIcon,
  QrIcon,
} from '@/components/ui';
import { PageContainer } from '@/components/layout/PageContainer';
import { useIsDesktop } from '@/hooks/useBreakpoint';
import { useAsync } from '@/hooks/useAsync';
import { getCurrentPosition } from '@/hooks/useGeolocation';
import { useComingSoon } from '@/hooks/useComingSoon';
import { restaurantsApi, pointsApi } from '@/api';
import { usePointsStore } from '@/store/pointsStore';
import { useUIStore } from '@/store/uiStore';
import { useFavoritesStore } from '@/store/favoritesStore';

export default function FoodDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const pushToast = useUIStore((s) => s.pushToast);
  const loadPoints = usePointsStore((s) => s.load);

  const [tab, setTab] = useState<'reviews' | 'menu' | 'photos'>('reviews');
  const [stampLoading, setStampLoading] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const comingSoon = useComingSoon();

  // 즐겨찾기 store 와 연동.
  const { find: findFavorite, toggle: toggleFavorite, load: loadFavorites } = useFavoritesStore();
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);
  const favorited = !!findFavorite('restaurant', id);

  const { data: restaurant, loading } = useAsync(() => restaurantsApi.detail(id), [id]);
  const { data: reviewsData, refetch: refetchReviews } = useAsync(
    () => restaurantsApi.reviews(id),
    [id],
  );
  const reviews = reviewsData ?? [];

  const handleEarnStamp = async () => {
    if (!restaurant) return;
    setStampLoading(true);
    try {
      pushToast('현재 위치 확인 중...', 'info');
      const result = await getCurrentPosition();
      if (!result.ok) {
        const errorMessages: Record<string, string> = {
          'permission-denied': '위치 권한이 필요해요. 설정에서 허용해주세요.',
          'position-unavailable': '현재 위치를 알 수 없어요.',
          timeout: '위치 확인이 너무 오래 걸려요. 다시 시도해주세요.',
          unsupported: '이 기기는 위치 정보를 지원하지 않아요.',
          unknown: '위치 확인 중 오류가 발생했어요.',
        };
        pushToast(errorMessages[result.error.kind] ?? '위치 확인 실패', 'error');
        return;
      }
      // 실제 운영에서는 backend 에서 restaurant 좌표와 distanceMeters() 비교 후 200m 이내 검증.
      // 현재 mock 단계에서는 위치만 받아오면 통과.
      await pointsApi.earnStamp(restaurant.id);
      await loadPoints();
      pushToast(`${restaurant.name} 스탬프 획득! +20p 🎉`, 'success');
    } catch {
      pushToast('스탬프 적립에 실패했어요.', 'error');
    } finally {
      setStampLoading(false);
    }
  };

  // 데이터 로드 중 빠른 가드 — 시안의 더미 데이터 의존 제거.
  if (loading || !restaurant) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-4)', fontSize: 14 }}>
        불러오는 중...
      </div>
    );
  }

  // refetch 는 사용처가 없어서 ref 만 유지 — 향후 리뷰 작성 후 자동 갱신용.
  void refetchReviews;

  const handleFavorite = async () => {
    if (!restaurant) return;
    try {
      const { added } = await toggleFavorite({
        targetType: 'restaurant',
        targetId: restaurant.id,
        targetName: restaurant.name,
        targetMeta: `${restaurant.category} · 도보 ${restaurant.walkMin}분`,
        imageLabel: restaurant.imageLabel,
      });
      pushToast(added ? '즐겨찾기에 추가했어요' : '즐겨찾기에서 제거했어요', 'success');
    } catch {
      pushToast('처리 실패', 'error');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: restaurant?.name ?? '단이브 맛집',
          text: `${restaurant?.name} - ${restaurant?.category}`,
          url,
        });
      } catch {
        // 사용자가 share dialog 닫음 — 정상.
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        pushToast('링크가 복사되었어요', 'success');
      } catch {
        pushToast('공유를 사용할 수 없어요', 'error');
      }
    } else {
      comingSoon('이 브라우저는 공유 기능을 지원하지 않아요');
    }
  };

  const hero = (
    <div className="ph" style={{ height: isDesktop ? 320 : 240, position: 'relative' }}>
      {restaurant.name} 대표 이미지
      {!isDesktop && (
        <>
          <div style={{ position: 'absolute', top: 14, left: 14 }}>
            <Button variant="hero" aria-label="뒤로" onClick={() => navigate(-1)}>
              <ChevronLeftIcon size={20} />
            </Button>
          </div>
          <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: 8 }}>
            <Button variant="hero" aria-label="찜" onClick={handleFavorite}>
              <HeartIcon size={18} filled={favorited} />
            </Button>
            <Button variant="hero" aria-label="공유" onClick={handleShare}>
              <ShareIcon size={18} />
            </Button>
          </div>
        </>
      )}
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          left: 0,
          right: 0,
          display: 'flex',
          gap: 4,
          justifyContent: 'center',
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setPhotoIndex(i)}
            aria-label={`${i + 1}번째 사진`}
            style={{
              width: i === photoIndex ? 18 : 5,
              height: 5,
              borderRadius: 999,
              background: i === photoIndex ? '#fff' : 'rgba(255,255,255,0.5)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'width .2s ease, background .2s ease',
            }}
          />
        ))}
      </div>
    </div>
  );

  const meta = (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>
            {restaurant.name}
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--ink-3)' }}>
            {restaurant.category} · 정문 도보 {restaurant.walkMin}분
          </p>
        </div>
        <Tag variant="mint" style={{ alignSelf: 'flex-start', marginTop: 4 }}>영업중</Tag>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
        <Stars value={restaurant.rating} size={14} />
        <span className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{restaurant.rating}</span>
        <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>리뷰 {restaurant.reviewCount}</span>
        <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>·</span>
        <span style={{ fontSize: 12, color: 'var(--primary-ink)', fontWeight: 600 }}>스탬프 +1</span>
      </div>

      <Card
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 0,
          marginTop: 14,
          padding: 12,
        }}
      >
        {[
          { l: '영업', v: restaurant.hours },
          { l: '전화', v: restaurant.phone },
          { l: '가격대', v: restaurant.price },
        ].map((m, i) => (
          <div key={m.l} style={{ textAlign: 'center', borderLeft: i ? '1px solid var(--line)' : 'none' }}>
            <p style={{ margin: 0, fontSize: 10, color: 'var(--ink-4)' }}>{m.l}</p>
            <p style={{ margin: '2px 0 0', fontSize: 12, fontWeight: 600 }}>{m.v}</p>
          </div>
        ))}
      </Card>
    </>
  );

  const reviewSection = (
    <>
      <Segmented
        options={[
          { value: 'reviews', label: `리뷰 ${restaurant.reviewCount}` },
          { value: 'menu',    label: '메뉴' },
          { value: 'photos',  label: '사진 64' },
        ]}
        value={tab}
        onChange={setTab}
        style={{ marginTop: 16 }}
      />

      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {reviews.map((rv, i) => (
          <div
            key={rv.id}
            style={{
              paddingBottom: 12,
              borderBottom: i < reviews.length - 1 ? '1px solid var(--line)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: i === 0 ? 'var(--accent-soft)' : 'var(--primary-soft)',
                  color: i === 0 ? 'var(--accent-ink)' : 'var(--primary-ink)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {rv.userName[0]}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{rv.userName}</p>
                <p style={{ margin: 0, fontSize: 10, color: 'var(--ink-4)' }}>
                  {rv.userTag} · {rv.createdAt}
                </p>
              </div>
              <Stars value={rv.rating} size={11} />
            </div>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.55 }}>{rv.body}</p>
            {rv.photos && (
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                {rv.photos.map((p, j) => (
                  <PlaceholderImage key={j} label={p} width={64} height={64} radius={10} />
                ))}
              </div>
            )}
          </div>
        ))}
        {reviews.length === 0 && (
          <p
            style={{
              padding: 24,
              textAlign: 'center',
              fontSize: 13,
              color: 'var(--ink-4)',
              background: 'var(--bg-2)',
              borderRadius: 14,
            }}
          >
            아직 리뷰가 없어요. 첫 리뷰를 남겨보세요!
          </p>
        )}
      </div>
    </>
  );

  const ctas = (
    <div style={{ display: 'flex', gap: 8 }}>
      <button
        type="button"
        className="btn-ghost"
        disabled={stampLoading}
        onClick={handleEarnStamp}
        style={{
          height: 52,
          background: 'var(--accent-soft)',
          color: 'var(--accent-ink)',
          fontWeight: 700,
          padding: '0 18px',
          opacity: stampLoading ? 0.6 : 1,
        }}
      >
        <QrIcon size={18} /> {stampLoading ? '인증 중...' : '도장 받기'}
      </button>
      <Button
        variant="primary"
        style={{ flex: 1 }}
        onClick={() => navigate(`/food/${restaurant.id}/review`)}
      >
        <PlusIcon size={16} /> 리뷰 쓰기
      </Button>
    </div>
  );

  if (isDesktop) {
    return (
      <PageContainer variant="wide" style={{ padding: '24px 24px 48px' }}>
        <div style={{ marginBottom: 16 }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: 'var(--ink-3)',
            }}
          >
            <ChevronLeftIcon size={16} /> 뒤로
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 24 }}>
          <div>
            <Card style={{ overflow: 'hidden', padding: 0 }}>
              {hero}
              <div style={{ padding: 20 }}>{meta}</div>
            </Card>
            <div style={{ marginTop: 16, position: 'sticky', bottom: 24 }}>{ctas}</div>
          </div>

          <div>{reviewSection}</div>
        </div>
      </PageContainer>
    );
  }

  // 모바일
  return (
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 88 }}>
        {hero}
        <div
          style={{
            padding: '18px 18px 0',
            background: 'var(--bg)',
            borderRadius: '24px 24px 0 0',
            marginTop: -22,
            position: 'relative',
            zIndex: 2,
          }}
        >
          {meta}
          {reviewSection}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '12px 16px 22px',
          background: 'var(--bg)',
          borderTop: '1px solid var(--line)',
        }}
      >
        {ctas}
      </div>
    </div>
  );
}
