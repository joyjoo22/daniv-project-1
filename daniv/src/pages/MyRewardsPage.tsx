// MY → 리워드 보관함 (교환한 기프티콘 목록)
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Chip, Tag, GiftIcon, CheckIcon } from '@/components/ui';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { useIsDesktop } from '@/hooks/useBreakpoint';
import { useAsync } from '@/hooks/useAsync';
import { meApi } from '@/api';
import { useUIStore } from '@/store/uiStore';
import type { RewardRedemption } from '@/types/domain';

type Filter = 'all' | 'available' | 'used';

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: 'all',       label: '전체' },
  { value: 'available', label: '사용 가능' },
  { value: 'used',      label: '사용 완료' },
];

export default function MyRewardsPage() {
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const pushToast = useUIStore((s) => s.pushToast);
  const [filter, setFilter] = useState<Filter>('all');
  const { data, loading, refetch } = useAsync(() => meApi.redemptions(), []);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  // 마운트 시 첫 화면이 "사용 가능" 인 게 자연스러움
  useEffect(() => {
    if (data && data.some((r) => !r.isUsed)) setFilter('available');
  }, [data]);

  const items = data ?? [];
  const visible = items.filter((r) => {
    if (filter === 'available') return !r.isUsed;
    if (filter === 'used') return r.isUsed;
    return true;
  });

  const availableCount = items.filter((r) => !r.isUsed).length;
  const usedCount = items.filter((r) => r.isUsed).length;
  const totalSpent = items.reduce((s, r) => s + r.pointsSpent, 0);

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      pushToast('쿠폰 코드 복사됨', 'success');
    } catch {
      pushToast('복사 실패', 'error');
    }
  };

  const handleMarkUsed = async (r: RewardRedemption) => {
    if (!window.confirm('이 쿠폰을 "사용 완료" 처리할까요? 되돌릴 수 없어요.')) return;
    try {
      await meApi.useRedemption(r.id);
      refetch();
      pushToast(`${r.rewardName} 사용 처리 완료`, 'success');
    } catch {
      pushToast('처리 실패', 'error');
    }
  };

  return (
    <>
      <TopBar title="리워드 보관함" onBack={() => navigate(-1)} />
      <PageContainer variant="narrow" style={{ padding: isDesktop ? '8px 24px 48px' : '0 16px 24px' }}>
        {/* 통계 헤로 */}
        <div
          style={{
            background: 'var(--hero-bg)',
            color: 'var(--hero-fg)',
            borderRadius: 22,
            padding: 18,
            marginBottom: 12,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: -30,
              top: -30,
              width: 140,
              height: 140,
              borderRadius: '50%',
              background: 'var(--accent)',
              opacity: 0.35,
              filter: 'blur(18px)',
            }}
          />
          <div style={{ position: 'relative' }}>
            <p style={{ margin: 0, fontSize: 11, opacity: 0.7 }}>사용 가능 쿠폰</p>
            <p
              className="mono"
              style={{ margin: '4px 0 0', fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em' }}
            >
              {availableCount}
              <span style={{ fontSize: 13, opacity: 0.6, marginLeft: 4 }}>장</span>
            </p>
            <div
              style={{
                display: 'flex',
                gap: 14,
                fontSize: 11,
                opacity: 0.7,
                marginTop: 8,
              }}
            >
              <span>사용 완료 {usedCount}장</span>
              <span>·</span>
              <span>
                누적 사용 <span className="mono">{totalSpent}</span>p
              </span>
            </div>
          </div>
        </div>

        {/* 필터 */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 12 }}>
          {FILTERS.map((f) => (
            <Chip key={f.value} active={filter === f.value} onCard onClick={() => setFilter(f.value)}>
              {f.label}
              {f.value === 'available' && availableCount > 0 && (
                <span
                  className="mono"
                  style={{
                    marginLeft: 4,
                    padding: '0 5px',
                    borderRadius: 999,
                    background: 'var(--accent)',
                    color: '#3a1d00',
                    fontSize: 9,
                    fontWeight: 700,
                  }}
                >
                  {availableCount}
                </span>
              )}
            </Chip>
          ))}
        </div>

        {loading ? (
          <Card style={{ padding: 32, textAlign: 'center', color: 'var(--ink-4)' }}>
            불러오는 중...
          </Card>
        ) : visible.length === 0 ? (
          <Card style={{ padding: 48, textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 30, marginBottom: 12 }}>🎁</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--ink-2)' }}>
              {filter === 'available'
                ? '사용 가능한 쿠폰이 없어요'
                : filter === 'used'
                  ? '사용 완료한 쿠폰이 없어요'
                  : '아직 교환한 리워드가 없어요'}
            </p>
            {filter !== 'used' && (
              <>
                <p style={{ margin: '6px 0 16px', fontSize: 12, color: 'var(--ink-4)' }}>
                  포인트를 모아 리워드로 교환하세요
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/stamp')}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 12,
                    background: 'var(--ink)',
                    color: 'var(--bg)',
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  리워드 보러가기 →
                </button>
              </>
            )}
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {visible.map((r) => {
              const isRevealed = revealedIds.has(r.id);
              return (
                <Card
                  key={r.id}
                  style={{
                    padding: 0,
                    overflow: 'hidden',
                    opacity: r.isUsed ? 0.55 : 1,
                    transition: 'opacity .15s',
                  }}
                >
                  {/* 헤더 — 색상 + 아이콘 + 이름 */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 14,
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: r.rewardColor,
                        color: '#fff',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <GiftIcon size={22} />
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
                          {r.rewardName}
                        </p>
                        {r.isUsed ? (
                          <Tag variant="mint">
                            <CheckIcon size={10} /> 사용 완료
                          </Tag>
                        ) : (
                          <Tag variant="amber">사용 가능</Tag>
                        )}
                      </div>
                      <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--ink-4)' }}>
                        <span className="mono">{r.pointsSpent}p</span> · {r.redeemedAt} 교환 ·{' '}
                        <span style={{ color: 'var(--rose)' }}>{r.expiresAt}</span>
                      </p>
                    </div>
                  </div>

                  {/* 쿠폰 코드 + 액션 */}
                  <div style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: 10,
                        background: 'var(--bg-2)',
                        border: '1px dashed var(--line-2)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 14,
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        textAlign: 'center',
                        color: isRevealed ? 'var(--ink)' : 'var(--ink-4)',
                        userSelect: 'all',
                        cursor: 'pointer',
                      }}
                      onClick={() => toggleReveal(r.id)}
                    >
                      {isRevealed ? r.couponCode : '••••-••••-••••-••••'}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(r.couponCode)}
                      disabled={r.isUsed}
                      style={{
                        height: 40,
                        padding: '0 14px',
                        borderRadius: 10,
                        background: 'var(--card)',
                        border: '1px solid var(--line)',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--ink-2)',
                        cursor: r.isUsed ? 'not-allowed' : 'pointer',
                      }}
                    >
                      복사
                    </button>
                    {!r.isUsed && (
                      <button
                        type="button"
                        onClick={() => handleMarkUsed(r)}
                        style={{
                          height: 40,
                          padding: '0 14px',
                          borderRadius: 10,
                          background: 'var(--ink)',
                          color: 'var(--bg)',
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        사용 처리
                      </button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </PageContainer>
    </>
  );
}
