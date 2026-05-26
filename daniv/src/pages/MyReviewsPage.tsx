// MY → 내 리뷰
import { useNavigate } from 'react-router-dom';
import { Card, Stars, Tag, PlaceholderImage } from '@/components/ui';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { useIsDesktop } from '@/hooks/useBreakpoint';
import { useAsync } from '@/hooks/useAsync';
import { meApi } from '@/api';

export default function MyReviewsPage() {
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const { data, loading } = useAsync(() => meApi.reviews(), []);
  const reviews = data ?? [];

  return (
    <>
      <TopBar title="내 리뷰" onBack={() => navigate(-1)} />
      <PageContainer variant="narrow" style={{ padding: isDesktop ? '8px 24px 48px' : '0 16px 24px' }}>
        {/* 헤더 통계 */}
        <Card style={{ padding: '14px 16px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>📝</span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>총 작성한 리뷰</p>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>
              <span className="mono">{reviews.length}</span>개
            </p>
          </div>
          {reviews.length > 0 && (
            <Tag variant="indigo">
              평균 ★{' '}
              <span className="mono">
                {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}
              </span>
            </Tag>
          )}
        </Card>

        {loading ? (
          <Card style={{ padding: 32, textAlign: 'center', color: 'var(--ink-4)' }}>
            불러오는 중...
          </Card>
        ) : reviews.length === 0 ? (
          <Card style={{ padding: 48, textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 30, marginBottom: 12 }}>✍️</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--ink-2)' }}>
              아직 작성한 리뷰가 없어요
            </p>
            <p style={{ margin: '6px 0 16px', fontSize: 12, color: 'var(--ink-4)' }}>
              맛집을 방문하고 리뷰를 남기면 +25p 가 적립돼요
            </p>
            <button
              type="button"
              onClick={() => navigate('/food')}
              style={{
                padding: '10px 18px',
                borderRadius: 12,
                background: 'var(--ink)',
                color: 'var(--bg)',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              맛집 둘러보기 →
            </button>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {reviews.map((rv) => (
              <Card
                key={rv.id}
                style={{ padding: 14, cursor: 'pointer' }}
                onClick={() => navigate(`/food/${rv.restaurantId}`)}
              >
                {/* 헤더 — 식당명 + 별점 + 작성시각 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, flex: 1, minWidth: 0 }}>
                    {rv.restaurantName}
                  </p>
                  <Stars value={rv.rating} size={12} />
                  <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>
                    {rv.createdAt}
                  </span>
                </div>

                {/* 본문 */}
                <p
                  style={{
                    margin: '8px 0 0',
                    fontSize: 13,
                    color: 'var(--ink-2)',
                    lineHeight: 1.55,
                  }}
                >
                  {rv.body}
                </p>

                {/* 사진 */}
                {rv.photos && rv.photos.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    {rv.photos.map((p, i) => (
                      <PlaceholderImage key={i} label={p} width={56} height={56} radius={10} />
                    ))}
                  </div>
                )}

                {/* 태그 */}
                {rv.tags && rv.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                    {rv.tags.map((t) => (
                      <Tag key={t} variant="mint">
                        {t}
                      </Tag>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </PageContainer>
    </>
  );
}
