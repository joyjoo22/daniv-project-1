// 어드민 — 리워드 관리 (CRUD + 색상 팔레트)
import { useEffect, useState } from 'react';
import { Card, Field, FieldLabel, GiftIcon } from '@/components/ui';
import { AdminHeader } from './AdminShell';
import { pointsApi, type CreateRewardRequest } from '@/api';
import { useUIStore } from '@/store/uiStore';
import type { Reward } from '@/types/domain';

const COLOR_PALETTE = [
  'oklch(0.62 0.12 165)', // mint
  'oklch(0.66 0.18 50)',  // orange
  'oklch(0.58 0.16 235)', // sky blue
  'oklch(0.55 0.14 280)', // purple
  'oklch(0.62 0.16 18)',  // rose
  'oklch(0.62 0.13 145)', // green
  'var(--primary)',
  'var(--ink)',
];

type EditingState =
  | { mode: 'view'; reward: Reward | null }
  | { mode: 'create' }
  | { mode: 'edit'; reward: Reward };

const blankForm: CreateRewardRequest = {
  name: '',
  pointsRequired: 500,
  stock: 10,
  color: COLOR_PALETTE[0],
};

export default function AdminRewardsPage() {
  const pushToast = useUIStore((s) => s.pushToast);
  const [items, setItems] = useState<Reward[]>([]);
  const [editing, setEditing] = useState<EditingState>({ mode: 'view', reward: null });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await pointsApi.rewards();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const totalStock = items.reduce((s, r) => s + r.stock, 0);

  const handleCreate = async (form: CreateRewardRequest) => {
    try {
      const created = await pointsApi.createReward(form);
      setItems((prev) => [created, ...prev]);
      setEditing({ mode: 'edit', reward: created });
      pushToast(`${created.name} 등록 완료`, 'success');
    } catch {
      pushToast('등록 실패', 'error');
    }
  };

  const handleUpdate = async (id: string, patch: Partial<Reward>) => {
    try {
      const updated = await pointsApi.updateReward(id, patch);
      setItems((prev) => prev.map((r) => (r.id === id ? updated : r)));
      setEditing({ mode: 'edit', reward: updated });
      pushToast('저장 완료', 'success');
    } catch {
      pushToast('저장 실패', 'error');
    }
  };

  const handleDelete = async (r: Reward) => {
    if (!window.confirm(`'${r.name}' 리워드를 삭제할까요?`)) return;
    try {
      await pointsApi.removeReward(r.id);
      setItems((prev) => prev.filter((x) => x.id !== r.id));
      setEditing({ mode: 'view', reward: null });
      pushToast('삭제 완료', 'success');
    } catch {
      pushToast('삭제 실패', 'error');
    }
  };

  return (
    <>
      <AdminHeader
        title="리워드 관리"
        sub={`총 ${items.length}개 리워드 · 누적 재고 ${totalStock}개`}
        action={
          <button
            type="button"
            onClick={() => setEditing({ mode: 'create' })}
            style={{
              height: 36,
              padding: '0 14px',
              borderRadius: 10,
              background: 'var(--ink)',
              color: 'var(--bg)',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            + 리워드 등록
          </button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', minHeight: 0 }}>
        {/* 리스트 — 카드 그리드 */}
        <div style={{ padding: '20px 16px 20px 24px', borderRight: '1px solid var(--line)' }}>
          {loading ? (
            <Card style={{ padding: 32, textAlign: 'center', color: 'var(--ink-4)' }}>
              불러오는 중...
            </Card>
          ) : items.length === 0 ? (
            <Card style={{ padding: 32, textAlign: 'center', color: 'var(--ink-4)' }}>
              등록된 리워드가 없어요.
            </Card>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: 10,
              }}
            >
              {items.map((r) => {
                const selected = editing.mode === 'edit' && editing.reward.id === r.id;
                const lowStock = r.stock <= 3;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setEditing({ mode: 'edit', reward: r })}
                    style={{
                      background: 'var(--card)',
                      borderRadius: 18,
                      border: selected
                        ? '2px solid var(--primary)'
                        : '1px solid var(--line)',
                      overflow: 'hidden',
                      padding: 0,
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        height: 80,
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
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          fontWeight: 700,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {r.name}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: 6,
                        }}
                      >
                        <span
                          className="mono"
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: 'var(--primary-ink)',
                          }}
                        >
                          {r.pointsRequired}p
                        </span>
                        <span
                          className="mono"
                          style={{
                            fontSize: 11,
                            color: lowStock ? 'oklch(0.62 0.16 18)' : 'var(--ink-4)',
                            fontWeight: lowStock ? 700 : 500,
                          }}
                        >
                          재고 {r.stock}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 상세 / 등록 */}
        <div style={{ padding: '20px 24px 20px 16px', background: 'var(--bg-2)' }}>
          {editing.mode === 'view' && (
            <Card style={{ padding: 32, textAlign: 'center', color: 'var(--ink-4)', fontSize: 13 }}>
              <p style={{ margin: 0, fontSize: 30, marginBottom: 12 }}>🎁</p>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--ink-3)' }}>
                리워드를 선택하거나 신규 등록
              </p>
            </Card>
          )}
          {editing.mode === 'create' && (
            <RewardForm
              key="create"
              initial={blankForm}
              submitLabel="등록"
              onCancel={() => setEditing({ mode: 'view', reward: null })}
              onSubmit={handleCreate}
            />
          )}
          {editing.mode === 'edit' && (
            <RewardForm
              key={editing.reward.id}
              initial={editing.reward}
              submitLabel="저장"
              onCancel={() => setEditing({ mode: 'view', reward: null })}
              onSubmit={(form) => handleUpdate(editing.reward.id, form)}
              extraAction={
                <button
                  type="button"
                  onClick={() => handleDelete(editing.reward)}
                  style={{
                    height: 44,
                    padding: '0 16px',
                    borderRadius: 12,
                    background: 'oklch(0.94 0.04 18)',
                    color: 'oklch(0.42 0.14 18)',
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  삭제
                </button>
              }
            />
          )}
        </div>
      </div>
    </>
  );
}

type RewardFormProps = {
  initial: CreateRewardRequest | Reward;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (form: CreateRewardRequest) => void;
  extraAction?: React.ReactNode;
};

function RewardForm({ initial, submitLabel, onCancel, onSubmit, extraAction }: RewardFormProps) {
  const [form, setForm] = useState<CreateRewardRequest>({
    name: initial.name,
    pointsRequired: initial.pointsRequired,
    stock: initial.stock,
    color: initial.color,
  });
  const update = <K extends keyof CreateRewardRequest>(k: K, v: CreateRewardRequest[K]) =>
    setForm((f) => ({ ...f, [k]: v }));
  const canSubmit = form.name.trim().length >= 2 && form.pointsRequired > 0;

  return (
    <>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {/* 미리보기 */}
        <div
          style={{
            height: 100,
            background: form.color,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <GiftIcon size={36} />
          <p
            style={{
              position: 'absolute',
              bottom: 8,
              left: 12,
              margin: 0,
              fontSize: 11,
              fontWeight: 700,
              opacity: 0.8,
            }}
          >
            미리보기
          </p>
        </div>

        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <FieldLabel>상품명</FieldLabel>
            <Field
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="예: 스타벅스 아메리카노"
              style={{ height: 40 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <FieldLabel>필요 포인트</FieldLabel>
              <Field
                mono
                type="number"
                min={1}
                value={String(form.pointsRequired)}
                onChange={(e) => update('pointsRequired', Number(e.target.value) || 0)}
                style={{ height: 40 }}
              />
            </div>
            <div>
              <FieldLabel>재고 수량</FieldLabel>
              <Field
                mono
                type="number"
                min={0}
                value={String(form.stock)}
                onChange={(e) => update('stock', Number(e.target.value) || 0)}
                style={{ height: 40 }}
              />
            </div>
          </div>

          <div>
            <FieldLabel>썸네일 색상</FieldLabel>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => update('color', color)}
                  aria-label={`색상 ${color}`}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: color,
                    border:
                      form.color === color ? '3px solid var(--ink)' : '2px solid var(--bg)',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            height: 44,
            borderRadius: 12,
            background: 'var(--card)',
            border: '1px solid var(--line)',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          취소
        </button>
        {extraAction}
        <button
          type="button"
          onClick={() => onSubmit(form)}
          disabled={!canSubmit}
          style={{
            flex: 2,
            height: 44,
            borderRadius: 12,
            background: canSubmit ? 'var(--ink)' : 'var(--ink-4)',
            color: 'var(--bg)',
            fontSize: 13,
            fontWeight: 700,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
          }}
        >
          {submitLabel}
        </button>
      </div>
    </>
  );
}
