// 어드민 — 리뷰 신고함
//
// 상태별 탭 (대기/숨김/반려) + 단일 컬럼 카드 리스트.
// 액션: "리뷰 숨김" / "신고 반려" / "삭제"
import { useEffect, useState } from 'react';
import { Card, Tag, Stars, BellIcon } from '@/components/ui';
import { AdminHeader } from './AdminShell';
import { reportsApi } from '@/api';
import { useUIStore } from '@/store/uiStore';
import type { ReviewReport, ReportStatus } from '@/types/domain';

const STATUS_TABS: Array<{ value: 'all' | ReportStatus; label: string }> = [
  { value: 'all',      label: '전체' },
  { value: 'pending',  label: '처리 대기' },
  { value: 'hidden',   label: '리뷰 숨김' },
  { value: 'rejected', label: '신고 반려' },
];

const REASON_VARIANT: Record<ReviewReport['reason'], 'rose' | 'amber' | 'indigo' | 'mint'> = {
  명예훼손: 'rose',
  '욕설/혐오': 'rose',
  '광고/스팸': 'amber',
  '허위 정보': 'amber',
  기타: 'indigo',
};

const STATUS_VARIANT: Record<ReportStatus, 'amber' | 'rose' | 'mint'> = {
  pending: 'amber',
  hidden: 'rose',
  rejected: 'mint',
};

const STATUS_LABEL: Record<ReportStatus, string> = {
  pending: '처리 대기',
  hidden: '리뷰 숨김',
  rejected: '신고 반려',
};

export default function AdminReportsPage() {
  const pushToast = useUIStore((s) => s.pushToast);
  const [items, setItems] = useState<ReviewReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all' | ReportStatus>('pending');

  const load = async () => {
    setLoading(true);
    try {
      const data = await reportsApi.list();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const visible = tab === 'all' ? items : items.filter((r) => r.status === tab);
  const pendingCount = items.filter((r) => r.status === 'pending').length;

  const handleResolve = async (r: ReviewReport, next: Exclude<ReportStatus, 'pending'>) => {
    const label = next === 'hidden' ? '리뷰 숨김 처리' : '신고 반려';
    if (!window.confirm(`${label} 하시겠어요?`)) return;
    try {
      const updated = await reportsApi.resolve(r.id, next);
      setItems((prev) => prev.map((x) => (x.id === r.id ? updated : x)));
      pushToast(`${label} 완료`, 'success');
    } catch {
      pushToast('처리 실패', 'error');
    }
  };

  const handleDelete = async (r: ReviewReport) => {
    if (!window.confirm('이 신고 기록을 영구 삭제할까요?')) return;
    try {
      await reportsApi.remove(r.id);
      setItems((prev) => prev.filter((x) => x.id !== r.id));
      pushToast('삭제 완료', 'success');
    } catch {
      pushToast('삭제 실패', 'error');
    }
  };

  return (
    <>
      <AdminHeader
        title="리뷰 신고함"
        sub={
          pendingCount > 0
            ? `처리 대기 ${pendingCount}건 · 전체 ${items.length}건`
            : `처리 대기 없음 · 전체 ${items.length}건`
        }
        action={
          <div
            style={{
              padding: '8px 12px',
              borderRadius: 10,
              background:
                pendingCount > 0 ? 'oklch(0.94 0.04 18)' : 'oklch(0.94 0.04 165)',
              color:
                pendingCount > 0 ? 'oklch(0.42 0.14 18)' : 'oklch(0.42 0.12 165)',
              fontSize: 12,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <BellIcon size={14} />
            {pendingCount > 0 ? `긴급 ${pendingCount}건` : '모두 처리됨'}
          </div>
        }
      />

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* 상태 탭 */}
        <div className="seg" style={{ maxWidth: 400 }}>
          {STATUS_TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              data-active={tab === t.value ? 'true' : undefined}
              onClick={() => setTab(t.value)}
            >
              {t.label}
              {t.value === 'pending' && pendingCount > 0 && (
                <span
                  className="mono"
                  style={{
                    marginLeft: 4,
                    padding: '0 6px',
                    borderRadius: 999,
                    background: 'oklch(0.62 0.16 18)',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <Card style={{ padding: 32, textAlign: 'center', color: 'var(--ink-4)' }}>
            불러오는 중...
          </Card>
        ) : visible.length === 0 ? (
          <Card style={{ padding: 48, textAlign: 'center', color: 'var(--ink-4)' }}>
            <p style={{ margin: 0, fontSize: 28, marginBottom: 8 }}>✨</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>해당 상태의 신고가 없어요</p>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {visible.map((r) => (
              <Card key={r.id} style={{ padding: 18 }}>
                {/* 헤더 — 신고 사유 + 시간 + 상태 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <Tag variant={REASON_VARIANT[r.reason]}>{r.reason}</Tag>
                  <Tag variant={STATUS_VARIANT[r.status]}>{STATUS_LABEL[r.status]}</Tag>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontSize: 11, color: 'var(--ink-4)' }} className="mono">
                    {r.createdAt}
                  </span>
                </div>

                {/* 신고자 + 사유 상세 */}
                <div
                  style={{
                    padding: 12,
                    background: 'var(--bg-2)',
                    borderRadius: 12,
                    marginBottom: 12,
                  }}
                >
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>
                    신고자: <strong>{r.reporterName}</strong>
                  </p>
                  {r.detail && (
                    <p
                      style={{
                        margin: '6px 0 0',
                        fontSize: 13,
                        color: 'var(--ink-2)',
                        lineHeight: 1.5,
                      }}
                    >
                      {r.detail}
                    </p>
                  )}
                </div>

                {/* 신고된 리뷰 스냅샷 */}
                <div
                  style={{
                    padding: 14,
                    border: '1px solid var(--line)',
                    borderRadius: 14,
                    background: 'var(--card)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 700 }}>
                      {r.reviewSnapshot.restaurantName}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--ink-4)' }}>·</span>
                    <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                      {r.reviewSnapshot.userName}
                    </span>
                    <span style={{ flex: 1 }} />
                    <Stars value={r.reviewSnapshot.rating} size={12} />
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: 'var(--ink-2)',
                      lineHeight: 1.6,
                    }}
                  >
                    "{r.reviewSnapshot.body}"
                  </p>
                </div>

                {/* 액션 */}
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  {r.status === 'pending' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleResolve(r, 'rejected')}
                        style={{
                          flex: 1,
                          height: 38,
                          borderRadius: 10,
                          background: 'var(--card)',
                          border: '1px solid var(--line)',
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        반려 (정상 리뷰)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResolve(r, 'hidden')}
                        style={{
                          flex: 1,
                          height: 38,
                          borderRadius: 10,
                          background: 'var(--ink)',
                          color: 'var(--bg)',
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        리뷰 숨김
                      </button>
                    </>
                  )}
                  {r.status !== 'pending' && (
                    <button
                      type="button"
                      onClick={() => handleDelete(r)}
                      style={{
                        flex: 1,
                        height: 38,
                        borderRadius: 10,
                        background: 'oklch(0.94 0.04 18)',
                        color: 'oklch(0.42 0.14 18)',
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      신고 기록 삭제
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
