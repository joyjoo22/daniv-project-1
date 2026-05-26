// 어드민 — 동아리 관리 (목록 + 추가/수정/삭제)
import { useEffect, useState } from 'react';
import {
  Card,
  Chip,
  Switch,
  Tag,
  Field,
  SelectField,
  FieldLabel,
} from '@/components/ui';
import { AdminHeader } from './AdminShell';
import { clubsApi, type CreateClubRequest } from '@/api';
import { useUIStore } from '@/store/uiStore';
import type { Club } from '@/types/domain';
import { MOCK_BUILDINGS } from '@/data/mock';

const CATEGORIES = ['전체', '문화/예술', '체육', '학술', '봉사', '취미', '검토중'] as const;
const CLUB_CATEGORIES: Club['category'][] = ['문화/예술', '체육', '학술', '봉사', '취미'];
const LOGO_COLORS = [
  'var(--primary)',
  'oklch(0.62 0.16 18)',
  'oklch(0.62 0.13 165)',
  'var(--accent)',
  'oklch(0.58 0.16 235)',
  'oklch(0.62 0.14 60)',
  'oklch(0.5 0.05 270)',
];

type EditingState =
  | { mode: 'view'; club: Club | null }
  | { mode: 'create' }
  | { mode: 'edit'; club: Club };

const blankForm: CreateClubRequest = {
  name: '',
  category: '문화/예술',
  buildingId: 'b-11',
  buildingName: '학생회관',
  room: '',
  status: '활성',
  recruiting: true,
  instagram: '',
  description: '',
  president: '',
  meeting: '',
  fee: 0,
  logoColor: 'var(--primary)',
};

export default function AdminClubsPage() {
  const pushToast = useUIStore((s) => s.pushToast);
  const [items, setItems] = useState<Club[]>([]);
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>('전체');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<EditingState>({ mode: 'view', club: null });
  const [loading, setLoading] = useState(true);

  const loadList = async () => {
    setLoading(true);
    try {
      const data = await clubsApi.list();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const filtered = items.filter((c) => {
    if (filter !== '전체') {
      if (filter === '검토중') {
        if (c.status !== '검토중') return false;
      } else if (c.category !== filter) {
        return false;
      }
    }
    if (search.trim() && !c.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const recruitingCount = items.filter((c) => c.recruiting).length;

  const handleCreate = async (form: CreateClubRequest) => {
    try {
      const created = await clubsApi.create(form);
      setItems((prev) => [created, ...prev]);
      setEditing({ mode: 'edit', club: created });
      pushToast(`${created.name} 등록 완료`, 'success');
    } catch {
      pushToast('동아리 등록에 실패했어요', 'error');
    }
  };

  const handleUpdate = async (id: string, patch: Partial<Club>) => {
    try {
      const updated = await clubsApi.update(id, patch);
      setItems((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setEditing({ mode: 'edit', club: updated });
      pushToast('변경사항이 저장되었어요', 'success');
    } catch {
      pushToast('수정에 실패했어요', 'error');
    }
  };

  const handleDelete = async (c: Club) => {
    if (!window.confirm(`'${c.name}'을(를) 삭제할까요?`)) return;
    try {
      await clubsApi.remove(c.id);
      setItems((prev) => prev.filter((x) => x.id !== c.id));
      setEditing({ mode: 'view', club: null });
      pushToast(`${c.name} 삭제 완료`, 'success');
    } catch {
      pushToast('삭제에 실패했어요', 'error');
    }
  };

  return (
    <>
      <AdminHeader
        title="동아리 관리"
        sub={`총 ${items.length}개 등록 · 모집중 ${recruitingCount}개`}
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Field
              placeholder="동아리 검색…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ height: 36, fontSize: 13, width: 200 }}
            />
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
              + 동아리 등록
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
            {CATEGORIES.map((c) => (
              <Chip key={c} active={filter === c} onClick={() => setFilter(c)}>
                {c}
              </Chip>
            ))}
          </div>

          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 90px 60px 80px 80px',
                padding: '10px 14px',
                background: 'var(--bg-3)',
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--ink-3)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <span>동아리</span>
              <span>위치</span>
              <span style={{ textAlign: 'right' }}>회원</span>
              <span style={{ textAlign: 'center' }}>모집</span>
              <span style={{ textAlign: 'right' }}>상태</span>
            </div>

            {loading ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--ink-4)', fontSize: 13 }}>
                불러오는 중...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--ink-4)', fontSize: 13 }}>
                해당 조건의 동아리가 없어요.
              </div>
            ) : (
              filtered.map((c, i) => {
                const selected = editing.mode === 'edit' && editing.club.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setEditing({ mode: 'edit', club: c })}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.5fr 90px 60px 80px 80px',
                      alignItems: 'center',
                      padding: '12px 14px',
                      borderTop: '1px solid var(--line)',
                      background: selected ? 'var(--primary-soft)' : 'transparent',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 9,
                          background: c.logoColor ?? LOGO_COLORS[i % LOGO_COLORS.length],
                          color: '#fff',
                          fontSize: 12,
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {c.name[0]}
                      </div>
                      <div style={{ minWidth: 0 }}>
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
                          {c.name}
                        </p>
                        <p style={{ margin: 0, fontSize: 10, color: 'var(--ink-4)' }}>{c.category}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{c.buildingName}</span>
                    <span className="mono" style={{ fontSize: 12, fontWeight: 600, textAlign: 'right' }}>
                      {c.members}
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Switch on={c.recruiting} size="sm" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Tag
                        variant={
                          c.status === '활성' ? 'mint' : c.status === '검토중' ? 'amber' : 'rose'
                        }
                      >
                        {c.status}
                      </Tag>
                    </div>
                  </button>
                );
              })
            )}
          </Card>
        </div>

        {/* ─── 상세 / 등록 패널 ─── */}
        <div style={{ padding: '20px 24px 20px 16px', background: 'var(--bg-2)' }}>
          {editing.mode === 'view' && (
            <Card style={{ padding: 32, textAlign: 'center', color: 'var(--ink-4)', fontSize: 13 }}>
              <p style={{ margin: 0, fontSize: 30, marginBottom: 12 }}>🎓</p>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--ink-3)' }}>
                좌측 리스트에서 동아리 선택
              </p>
              <p style={{ margin: '6px 0 0', fontSize: 12 }}>
                또는 우측 상단 "+ 동아리 등록" 버튼으로 새로 추가하세요
              </p>
            </Card>
          )}

          {editing.mode === 'create' && (
            <ClubForm
              key="create"
              initial={blankForm}
              submitLabel="등록"
              onCancel={() => setEditing({ mode: 'view', club: null })}
              onSubmit={(form) => handleCreate(form)}
            />
          )}

          {editing.mode === 'edit' && (
            <ClubForm
              key={editing.club.id}
              initial={editing.club}
              submitLabel="저장"
              onCancel={() => setEditing({ mode: 'view', club: null })}
              onSubmit={(form) => handleUpdate(editing.club.id, form)}
              extraAction={
                <button
                  type="button"
                  onClick={() => handleDelete(editing.club)}
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
   ClubForm — 생성/수정 공용 폼
   ──────────────────────────────────────────────── */
type ClubFormProps = {
  initial: CreateClubRequest | Club;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (form: CreateClubRequest) => void;
  extraAction?: React.ReactNode;
};

function ClubForm({ initial, submitLabel, onCancel, onSubmit, extraAction }: ClubFormProps) {
  const [form, setForm] = useState<CreateClubRequest>({
    name: initial.name,
    category: initial.category,
    buildingId: initial.buildingId,
    buildingName: initial.buildingName,
    room: initial.room,
    status: initial.status,
    recruiting: initial.recruiting,
    instagram: initial.instagram ?? '',
    description: initial.description ?? '',
    president: initial.president ?? '',
    meeting: initial.meeting ?? '',
    fee: initial.fee ?? 0,
    logoColor: initial.logoColor ?? 'var(--primary)',
  });

  const update = <K extends keyof CreateClubRequest>(
    key: K,
    value: CreateClubRequest[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const canSubmit = form.name.trim().length >= 2;

  const onBuildingChange = (buildingId: string) => {
    const b = MOCK_BUILDINGS.find((x) => x.id === buildingId);
    setForm((f) => ({
      ...f,
      buildingId,
      buildingName: b?.name ?? f.buildingName,
    }));
  };

  return (
    <>
      <Card style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: form.logoColor,
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: '-0.04em',
            }}
          >
            {form.name[0] || '?'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>
              {form.category} · 중앙동아리
            </p>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
              {form.name || '(이름 없음)'}
            </p>
          </div>
        </div>

        <div>
          <FieldLabel>동아리명</FieldLabel>
          <Field
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="예: 사진동아리 한울"
            style={{ height: 40 }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <FieldLabel>카테고리</FieldLabel>
            <SelectField
              value={form.category}
              onChange={(e) => update('category', e.target.value as Club['category'])}
              style={{ height: 40 }}
            >
              {CLUB_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </SelectField>
          </div>
          <div>
            <FieldLabel>로고 색상</FieldLabel>
            <div style={{ display: 'flex', gap: 6, height: 40, alignItems: 'center', flexWrap: 'wrap' }}>
              {LOGO_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => update('logoColor', color)}
                  aria-label={`색상 ${color}`}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: color,
                    border: form.logoColor === color ? '3px solid var(--ink)' : '2px solid var(--bg)',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 10 }}>
          <div>
            <FieldLabel>건물</FieldLabel>
            <SelectField
              value={form.buildingId}
              onChange={(e) => onBuildingChange(e.target.value)}
              style={{ height: 40 }}
            >
              {MOCK_BUILDINGS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </SelectField>
          </div>
          <div>
            <FieldLabel>호실</FieldLabel>
            <Field
              value={form.room}
              onChange={(e) => update('room', e.target.value)}
              placeholder="예: 312"
              style={{ height: 40 }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div>
            <FieldLabel>회장</FieldLabel>
            <Field
              value={form.president ?? ''}
              onChange={(e) => update('president', e.target.value)}
              placeholder="예: 이서연 · 24"
              style={{ height: 40 }}
            />
          </div>
          <div>
            <FieldLabel>정기 모임</FieldLabel>
            <Field
              value={form.meeting ?? ''}
              onChange={(e) => update('meeting', e.target.value)}
              placeholder="매주 화 18:00"
              style={{ height: 40 }}
            />
          </div>
          <div>
            <FieldLabel>학기 회비(원)</FieldLabel>
            <Field
              mono
              type="number"
              min={0}
              value={String(form.fee ?? 0)}
              onChange={(e) => update('fee', Number(e.target.value) || 0)}
              style={{ height: 40 }}
            />
          </div>
        </div>

        <div>
          <FieldLabel>소개</FieldLabel>
          <textarea
            value={form.description ?? ''}
            onChange={(e) => update('description', e.target.value)}
            style={{
              width: '100%',
              minHeight: 76,
              padding: 12,
              fontSize: 13,
              borderRadius: 12,
              border: '1px solid var(--line)',
              background: 'var(--card)',
              resize: 'vertical',
              lineHeight: 1.55,
              color: 'var(--ink)',
              fontFamily: 'inherit',
              outline: 'none',
            }}
            placeholder="동아리 소개를 입력하세요"
          />
        </div>

        <div>
          <FieldLabel>Instagram</FieldLabel>
          <div style={{ display: 'flex', gap: 0 }}>
            <span
              style={{
                height: 40,
                padding: '0 12px',
                display: 'inline-flex',
                alignItems: 'center',
                background: 'var(--bg-3)',
                border: '1px solid var(--line)',
                borderRight: 'none',
                borderRadius: '12px 0 0 12px',
                fontSize: 13,
                color: 'var(--ink-3)',
              }}
            >
              @
            </span>
            <Field
              value={form.instagram ?? ''}
              onChange={(e) => update('instagram', e.target.value)}
              placeholder="dku_handle"
              style={{ height: 40, borderRadius: '0 12px 12px 0' }}
            />
          </div>
        </div>

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
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>모집 활성화</p>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>
              학생 앱에 "모집중" 배너 노출
            </p>
          </div>
          <Switch
            on={!!form.recruiting}
            size="sm"
            onChange={() => update('recruiting', !form.recruiting)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>공식 인증 (활성 상태)</p>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>
              학생복지팀 검증 완료 표시
            </p>
          </div>
          <Switch
            on={form.status === '활성'}
            size="sm"
            onChange={() =>
              update('status', form.status === '활성' ? '검토중' : '활성')
            }
          />
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
