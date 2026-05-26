// 스탬프북 — pointsStore (API 자동 호출) 기반.
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Tag, CheckIcon, GiftIcon, Mini } from '@/components/ui';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { useIsDesktop } from '@/hooks/useBreakpoint';
import { useComingSoon } from '@/hooks/useComingSoon';
import { usePointsStore } from '@/store/pointsStore';
import { useUIStore } from '@/store/uiStore';

export default function StampPage() {
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const { total, goal, stamps, rewards, isLoading, error, load, redeemReward } = usePointsStore();
  const pushToast = useUIStore((s) => s.pushToast);
  const comingSoon = useComingSoon();

  useEffect(() => {
    load();
  }, [load]);

  const obtained = stamps.filter((s) => s.obtained).length;
  const remaining = Math.max(0, goal - total);
  const pct = Math.min(100, (total / goal) * 100);

  const handleRedeem = async (rewardId: string, name: string, required: number) => {
    if (total < required) {
      pushToast('포인트가 부족해요.', 'error');
      return;
    }
    try {
      await redeemReward(rewardId);
      pushToast(`${name} 교환 완료! 🎁`, 'success');
    } catch {
      pushToast('교환에 실패했어요.', 'error');
    }
  };

  return (
    <>
      <TopBar
        title="스탬프북"
        action={
          <button
            type="button"
            onClick={() => navigate('/events')}
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--ink-2)',
              padding: '6px 10px',
              borderRadius: 10,
              background: 'var(--card)',
              border: '1px solid var(--line)',
            }}
          >
            이벤트
          </button>
        }
      />
      <PageContainer variant="default" style={{ padding: isDesktop ? '8px 24px 48px' : '0 16px 16px' }}>
        {error && (
          <p
            role="alert"
            style={{
              padding: 12,
              marginBottom: 12,
              color: 'oklch(0.42 0.14 18)',
              background: 'oklch(0.94 0.04 18)',
              borderRadius: 12,
              fontSize: 13,
            }}
          >
            {error}
          </p>
        )}

        {/* 헤로 */}
        <div
          style={{
            background: 'var(--hero-bg)',
            borderRadius: 24,
            padding: 18,
            color: 'var(--hero-fg)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: -40,
              bottom: -40,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'var(--accent)',
              opacity: 0.4,
              filter: 'blur(28px)',
            }}
          />
          <div style={{ position: 'relative' }}>
            <p style={{ margin: 0, fontSize: 11, opacity: 0.7 }}>이번 학기 누적 포인트</p>
            <p
              className="mono"
              style={{ margin: '2px 0 8px', fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em' }}
            >
              {isLoading ? '...' : total}
              <span style={{ fontSize: 14, opacity: 0.6, marginLeft: 4 }}>p</span>
            </p>

            <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.16)', overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', borderRadius: 999 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11 }}>
              <span style={{ opacity: 0.7 }}>
                {remaining > 0 ? `${remaining}p 더 모으면 ☕ 스타벅스` : '목표 달성! 🎉'}
              </span>
              <span className="mono" style={{ opacity: 0.7 }}>{goal}p</span>
            </div>
          </div>
        </div>

        {/* 미니 통계 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
          <Mini n={obtained} l="모은 스탬프" />
          <Mini n="12" l="작성한 리뷰" />
          <Mini n="3" l="교환한 리워드" />
        </div>

        {/* 스탬프 그리드 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '24px 0 10px',
          }}
        >
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>이번 학기 스탬프</p>
          <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>
            {obtained} / 30
          </span>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${isDesktop ? 8 : 4}, 1fr)`,
            gap: 8,
          }}
        >
          {stamps.map((s) => (
            <div
              key={s.id}
              style={{
                aspectRatio: '1',
                borderRadius: 14,
                background: s.obtained ? 'var(--card)' : 'transparent',
                border: s.obtained ? '1px solid var(--line)' : '1.5px dashed var(--line-2)',
                padding: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                opacity: s.obtained ? 1 : 0.55,
              }}
            >
              {s.obtained ? (
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: s.color,
                    color: '#fff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                  }}
                >
                  <CheckIcon size={16} />
                </div>
              ) : (
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    border: '1.5px dashed var(--line-2)',
                  }}
                />
              )}
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  textAlign: 'center',
                  color: 'var(--ink-3)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                }}
              >
                {s.restaurantName}
              </span>
            </div>
          ))}
        </div>

        {/* 리워드 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '24px 0 10px',
          }}
        >
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>리워드 교환</p>
          <button
            type="button"
            onClick={() => comingSoon('리워드 전체보기는 곧 추가돼요')}
            style={{ fontSize: 12, color: 'var(--primary-ink)', fontWeight: 600 }}
          >
            전체보기 ›
          </button>
        </div>
        <div
          style={{
            display: isDesktop ? 'grid' : 'flex',
            gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : undefined,
            gap: 10,
            overflowX: isDesktop ? undefined : 'auto',
            paddingBottom: 4,
          }}
        >
          {rewards.map((r) => {
            const can = total >= r.pointsRequired;
            return (
              <Card
                key={r.id}
                style={{
                  minWidth: 170,
                  overflow: 'hidden',
                  flexShrink: 0,
                  padding: 0,
                }}
              >
                <div
                  style={{
                    height: 84,
                    background: r.color,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <GiftIcon size={28} />
                </div>
                <div style={{ padding: '10px 12px 12px' }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: '-0.02em' }}>{r.name}</p>
                  <p style={{ margin: '2px 0 8px', fontSize: 10, color: 'var(--ink-4)' }}>
                    재고 {r.stock}개
                  </p>
                  <button
                    type="button"
                    disabled={!can}
                    onClick={() => handleRedeem(r.id, r.name, r.pointsRequired)}
                    style={{
                      width: '100%',
                      height: 30,
                      borderRadius: 10,
                      background: can ? 'var(--ink)' : 'var(--bg-3)',
                      color: can ? 'var(--bg)' : 'var(--ink-4)',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    <span className="mono">{r.pointsRequired}p</span> 교환
                  </button>
                </div>
              </Card>
            );
          })}
        </div>

        <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-2)', borderRadius: 12 }}>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-3)' }}>
            <Tag variant="indigo" style={{ marginRight: 6 }}>TIP</Tag>
            방문 인증(GPS) + 리뷰 작성으로 포인트를 추가로 받을 수 있어요.
          </p>
        </div>
      </PageContainer>
    </>
  );
}
