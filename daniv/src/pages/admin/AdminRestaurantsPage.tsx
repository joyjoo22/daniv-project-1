// 어드민 — 맛집 관리 (목록 + 추가/수정/삭제 + 스탬프 설정)
//
// 좌측: 리스트 (필터 칩 + 카운트)
// 우측: 상세 편집 패널 (선택된 음식점 수정 또는 신규 등록 모드)
// 헤더 액션: "+ 맛집 등록" 클릭 시 우측 패널이 신규 등록 폼으로 전환.
import { useEffect, useState } from 'react';
import {
  Card,
  Chip,
  Switch,
  Tag,
  Stars,
  Field,
  FieldLabel,
  SelectField,
  PlaceholderImage,
  StampIcon,
} from '@/components/ui';
import { AdminHeader } from './AdminShell';
import { restaurantsApi, type CreateRestaurantRequest } from '@/api';
import { useUIStore } from '@/store/uiStore';
import type { Restaurant } from '@/types/domain';

const CATEGORY_FILTERS = ['전체', '한식', '분식', '일식', '중식', '카페', '치킨/맥주'] as const;
type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

type EditingState =
  | { mode: 'view'; restaurant: Restaurant | null }
  | { mode: 'create' }
  | { mode: 'edit'; restaurant: Restaurant };

const PRICE_OPTIONS: Restaurant['price'][] = ['₩', '₩₩', '₩₩₩'];

// 등록 폼 초기값 — 신규 등록 모드 시 사용.
const blankForm: CreateRestaurantRequest = {
  name: '',
  category: '한식',
  price: '₩₩',
  walkMin: 5,
  hours: '11–22시',
  phone: '',
  imageLabel: '한식',
  hasStamp: false,
  hot: false,
};

export default function AdminRestaurantsPage() {
  const pushToast = useUIStore((s) => s.pushToast);
  const [items, setItems] = useState<Restaurant[]>([]);
  const [filter, setFilter] = useState<CategoryFilter>('전체');
  const [editing, setEditing] = useState<EditingState>({ mode: 'view', restaurant: null });
  const [loading, setLoading] = useState(true);

  const loadList = async () => {
    setLoading(true);
    try {
      const data = await restaurantsApi.list();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const filtered =
    filter === '전체' ? items : items.filter((r) => r.category.startsWith(filter));

  const stampedCount = items.filter((r) => r.hasStamp).length;

  const handleSelect = (r: Restaurant) => {
    setEditing({ mode: 'edit', restaurant: r });
  };

  const handleStartCreate = () => {
    setEditing({ mode: 'create' });
  };

  const handleCancel = () => {
    setEditing({ mode: 'view', restaurant: null });
  };

  const handleCreate = async (form: CreateRestaurantRequest) => {
    try {
      const created = await restaurantsApi.create(form);
      setItems((prev) => [created, ...prev]);
      setEditing({ mode: 'edit', restaurant: created });
      pushToast(`${created.name} 등록 완료${created.hasStamp ? ' · 스탬프 활성화' : ''}`, 'success');
    } catch {
      pushToast('맛집 등록에 실패했어요', 'error');
    }
  };

  const handleUpdate = async (id: string, patch: Partial<Restaurant>) => {
    try {
      const updated = await restaurantsApi.update(id, patch);
      setItems((prev) => prev.map((r) => (r.id === id ? updated : r)));
      setEditing({ mode: 'edit', restaurant: updated });
      pushToast('변경사항이 저장되었어요', 'success');
    } catch {
      pushToast('수정에 실패했어요', 'error');
    }
  };

  const handleDelete = async (r: Restaurant) => {
    if (!window.confirm(`'${r.name}'을(를) 삭제할까요? 연결된 리뷰도 모두 삭제됩니다.`)) return;
    try {
      await restaurantsApi.remove(r.id);
      setItems((prev) => prev.filter((x) => x.id !== r.id));
      setEditing({ mode: 'view', restaurant: null });
      pushToast(`${r.name} 삭제 완료`, 'success');
    } catch {
      pushToast('삭제에 실패했어요', 'error');
    }
  };

  return (
    <>
      <AdminHeader
        title="맛집 관리"
        sub={`총 ${items.length}개 · 스탬프 활성 ${stampedCount}개`}
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={handleStartCreate}
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
              + 맛집 등록
            </button>
          </div>
        }
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)',
          minHeight: 0,
        }}
      >
        {/* ─── 리스트 ─── */}
        <div style={{ padding: '20px 16px 20px 24px', borderRight: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, overflowX: 'auto' }}>
            {CATEGORY_FILTERS.map((c) => (
              <Chip key={c} active={filter === c} onClick={() => setFilter(c)}>
                {c}
              </Chip>
            ))}
          </div>

          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr 110px 80px 60px',
                padding: '10px 14px',
                background: 'var(--bg-3)',
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--ink-3)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <span />
              <span>이름 · 카테고리</span>
              <span style={{ textAlign: 'center' }}>별점</span>
              <span style={{ textAlign: 'center' }}>스탬프</span>
              <span style={{ textAlign: 'right' }}>가격</span>
            </div>

            {loading ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--ink-4)', fontSize: 13 }}>
                불러오는 중...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--ink-4)', fontSize: 13 }}>
                해당 카테고리에 등록된 맛집이 없어요.
              </div>
            ) : (
              filtered.map((r) => {
                const selected =
                  editing.mode === 'edit' && editing.restaurant.id === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleSelect(r)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60px 1fr 110px 80px 60px',
                      alignItems: 'center',
                      padding: '12px 14px',
                      borderTop: '1px solid var(--line)',
                      background: selected ? 'var(--primary-soft)' : 'transparent',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <PlaceholderImage label={r.imageLabel} width={40} height={40} radius={10} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 13,
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {r.name}
                        </p>
                        {r.hot && <Tag variant="rose">HOT</Tag>}
                      </div>
                      <p style={{ margin: 0, fontSize: 10, color: 'var(--ink-4)' }}>
                        {r.category} · 도보 {r.walkMin}분
                      </p>
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                      <Stars value={r.rating} size={11} />
                      <span className="mono" style={{ fontSize: 11, fontWeight: 600 }}>
                        {r.rating.toFixed(1)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      {r.hasStamp ? (
                        <Tag variant="indigo">
                          <StampIcon size={10} /> ON
                        </Tag>
                      ) : (
                        <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>OFF</span>
                      )}
                    </div>
                    <span
                      className="mono"
                      style={{
                        textAlign: 'right',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--ink-2)',
                      }}
                    >
                      {r.price}
                    </span>
                  </button>
                );
              })
            )}
          </Card>
        </div>

        {/* ─── 상세 / 등록 패널 ─── */}
        <div style={{ padding: '20px 24px 20px 16px', background: 'var(--bg-2)' }}>
          {editing.mode === 'view' && (
            <Card
              style={{
                padding: 32,
                textAlign: 'center',
                color: 'var(--ink-4)',
                fontSize: 13,
              }}
            >
              <p style={{ margin: 0, fontSize: 30, marginBottom: 12 }}>🍱</p>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--ink-3)' }}>
                좌측 리스트에서 항목 선택
              </p>
              <p style={{ margin: '6px 0 0', fontSize: 12 }}>
                또는 우측 상단 "+ 맛집 등록" 버튼으로 새로 추가하세요
              </p>
            </Card>
          )}

          {editing.mode === 'create' && (
            <RestaurantForm
              key="create"
              initial={blankForm}
              submitLabel="등록"
              onCancel={handleCancel}
              onSubmit={(form) => handleCreate(form)}
            />
          )}

          {editing.mode === 'edit' && (
            <RestaurantForm
              key={editing.restaurant.id}
              initial={editing.restaurant}
              submitLabel="저장"
              onCancel={handleCancel}
              onSubmit={(form) => handleUpdate(editing.restaurant.id, form)}
              extraAction={
                <button
                  type="button"
                  onClick={() => handleDelete(editing.restaurant)}
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

/* ────────────────────────────────────────────────
   RestaurantForm — 생성/수정 공용 폼
   ──────────────────────────────────────────────── */
type RestaurantFormProps = {
  initial: CreateRestaurantRequest | Restaurant;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (form: CreateRestaurantRequest) => void;
  extraAction?: React.ReactNode;
};

function RestaurantForm({
  initial,
  submitLabel,
  onCancel,
  onSubmit,
  extraAction,
}: RestaurantFormProps) {
  const [form, setForm] = useState<CreateRestaurantRequest>({
    name: initial.name,
    category: initial.category,
    price: initial.price,
    walkMin: initial.walkMin,
    hours: initial.hours,
    phone: initial.phone,
    imageLabel: initial.imageLabel,
    hasStamp: initial.hasStamp,
    hot: 'hot' in initial ? !!initial.hot : false,
  });

  const update = <K extends keyof CreateRestaurantRequest>(
    key: K,
    value: CreateRestaurantRequest[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const canSubmit = form.name.trim().length >= 2 && form.category.trim().length > 0;

  return (
    <>
      <Card style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <PlaceholderImage label={form.imageLabel || '?'} width={56} height={56} radius={14} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>{form.category || '카테고리 미설정'}</p>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{form.name || '(이름 없음)'}</p>
          </div>
        </div>

        <div>
          <FieldLabel>이름</FieldLabel>
          <Field
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="예: 단풍식당"
            style={{ height: 40 }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <FieldLabel>카테고리</FieldLabel>
            <Field
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              placeholder="예: 한식 · 김치찌개"
              style={{ height: 40 }}
            />
          </div>
          <div>
            <FieldLabel>이미지 라벨</FieldLabel>
            <Field
              value={form.imageLabel}
              onChange={(e) => update('imageLabel', e.target.value)}
              placeholder="예: 한식"
              style={{ height: 40 }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div>
            <FieldLabel>가격대</FieldLabel>
            <SelectField
              value={form.price}
              onChange={(e) => update('price', e.target.value as Restaurant['price'])}
              style={{ height: 40 }}
            >
              {PRICE_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </SelectField>
          </div>
          <div>
            <FieldLabel>도보(분)</FieldLabel>
            <Field
              mono
              type="number"
              min={1}
              max={60}
              value={String(form.walkMin)}
              onChange={(e) => update('walkMin', Number(e.target.value) || 0)}
              style={{ height: 40 }}
            />
          </div>
          <div>
            <FieldLabel>영업시간</FieldLabel>
            <Field
              value={form.hours}
              onChange={(e) => update('hours', e.target.value)}
              placeholder="11–22시"
              style={{ height: 40 }}
            />
          </div>
        </div>

        <div>
          <FieldLabel>전화번호</FieldLabel>
          <Field
            mono
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="031-..."
            style={{ height: 40 }}
          />
        </div>

        {/* 스탬프 토글 — 메인 강조 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 0',
            borderTop: '1px solid var(--line)',
            marginTop: 4,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: form.hasStamp ? 'var(--primary-soft)' : 'var(--bg-2)',
                color: form.hasStamp ? 'var(--primary-ink)' : 'var(--ink-4)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <StampIcon size={18} />
            </span>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>스탬프 참여</p>
              <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>
                방문 인증 시 +20p 적립, 학생 앱에 스탬프 아이콘 표시
              </p>
            </div>
          </div>
          <Switch
            on={form.hasStamp}
            size="sm"
            onChange={() => update('hasStamp', !form.hasStamp)}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 0 0',
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>HOT 배지</p>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>
              학생 앱 카드에 🔥 HOT 표시
            </p>
          </div>
          <Switch on={!!form.hot} size="sm" onChange={() => update('hot', !form.hot)} />
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
