// 시간표 — 주간 5일 × 9시간 그리드 + 강의 추가/수정/삭제 모달
import { useState } from 'react';
import {
  Card,
  Chip,
  Button,
  PlusIcon,
  Stat,
  Modal,
  Field,
  FieldLabel,
  SelectField,
} from '@/components/ui';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { useTimetableStore, CATEGORY_COLOR } from '@/store/timetableStore';
import { useUIStore } from '@/store/uiStore';
import type { TimetableClass } from '@/types/domain';

const DAYS = ['월', '화', '수', '목', '금'] as const;
const HOUR_START = 9;
const HOUR_END = 17;
const ROW_H = 44;
const TODAY_INDEX = 2; // 수요일 데모

// 시간 옵션 — 9:00 ~ 17:30 까지 30분 단위 (numeric: 9.0, 9.5, 10.0, …)
const TIME_OPTIONS = Array.from({ length: (HOUR_END - HOUR_START) * 2 + 1 }, (_, i) => {
  const v = HOUR_START + i * 0.5;
  const h = Math.floor(v);
  const m = v % 1 === 0 ? '00' : '30';
  return { value: v, label: `${h}:${m}` };
});

type FormState = {
  name: string;
  day: 0 | 1 | 2 | 3 | 4;
  start: number;
  end: number;
  building: string;
  room: string;
  professor: string;
  category: TimetableClass['category'];
};

const blankForm: FormState = {
  name: '',
  day: 0,
  start: 9,
  end: 10.5,
  building: '',
  room: '',
  professor: '',
  category: '전공',
};

type EditState = { mode: 'create' } | { mode: 'edit'; cls: TimetableClass } | null;

export default function TimetablePage() {
  const { classes, add, update, remove } = useTimetableStore();
  const pushToast = useUIStore((s) => s.pushToast);
  const [editing, setEditing] = useState<EditState>(null);

  const handleOpenNew = (day?: number, start?: number) => {
    setEditing({
      mode: 'create',
    });
    // start/day 가 주어지면 사용 (그리드 빈 영역 클릭 시 활용 가능)
    void day;
    void start;
  };

  const handleSubmit = (form: FormState) => {
    if (form.end <= form.start) {
      pushToast('종료 시간은 시작 시간보다 늦어야 해요', 'error');
      return;
    }
    if (form.name.trim().length === 0) {
      pushToast('강의명을 입력해주세요', 'error');
      return;
    }
    const data = {
      ...form,
      color: CATEGORY_COLOR[form.category] ?? 'var(--primary)',
    };
    if (editing?.mode === 'create') {
      add(data);
      pushToast(`'${form.name}' 추가 완료`, 'success');
    } else if (editing?.mode === 'edit') {
      update(editing.cls.id, data);
      pushToast(`'${form.name}' 수정 완료`, 'success');
    }
    setEditing(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`'${name}' 강의를 삭제할까요?`)) return;
    remove(id);
    pushToast('삭제 완료', 'success');
    setEditing(null);
  };

  // 통계
  const totalCount = classes.length;
  const totalHours = classes.reduce((s, c) => s + (c.end - c.start), 0);
  const usedDays = new Set(classes.map((c) => c.day)).size;
  const freeDays = 5 - usedDays;

  return (
    <>
      <TopBar
        title="시간표"
        action={
          <Button variant="icon" aria-label="강의 추가" onClick={() => handleOpenNew()}>
            <PlusIcon size={18} />
          </Button>
        }
      />
      <PageContainer variant="default" style={{ padding: '0 16px 24px' }}>
        {/* 칩 행 */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto' }}>
          <Chip active>이번 주</Chip>
          <Chip onCard>2025-1학기</Chip>
          <Chip onCard>시간표 공유</Chip>
        </div>

        {/* 범례 */}
        <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--ink-3)', marginBottom: 10 }}>
          {(Object.keys(CATEGORY_COLOR) as Array<TimetableClass['category']>).map((cat) => (
            <span key={cat} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: CATEGORY_COLOR[cat] }} />
              {cat}
            </span>
          ))}
        </div>

        {/* 그리드 */}
        <Card style={{ padding: 12, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '32px repeat(5, 1fr)', gap: 4, marginBottom: 6 }}>
            <span />
            {DAYS.map((d, i) => (
              <div
                key={d}
                style={{
                  textAlign: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  color: i === TODAY_INDEX ? 'var(--primary-ink)' : 'var(--ink-3)',
                }}
              >
                <p style={{ margin: 0 }}>{d}</p>
                <p
                  className="mono"
                  style={{
                    margin: 0,
                    fontSize: 14,
                    color: i === TODAY_INDEX ? 'var(--primary-ink)' : 'var(--ink)',
                  }}
                >
                  {17 + i}
                </p>
              </div>
            ))}
          </div>

          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '32px repeat(5, 1fr)', gap: 4 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {Array.from({ length: HOUR_END - HOUR_START }).map((_, i) => (
                <div
                  key={i}
                  className="mono"
                  style={{ height: ROW_H, fontSize: 9, color: 'var(--ink-4)', paddingTop: 2 }}
                >
                  {HOUR_START + i}
                </div>
              ))}
            </div>

            {DAYS.map((_, di) => (
              <div
                key={di}
                style={{
                  position: 'relative',
                  height: (HOUR_END - HOUR_START) * ROW_H,
                  background: di === TODAY_INDEX ? 'oklch(0.97 0.015 270)' : 'transparent',
                  borderRadius: 8,
                  border: '1px solid var(--line)',
                }}
              >
                {Array.from({ length: HOUR_END - HOUR_START - 1 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: (i + 1) * ROW_H,
                      height: 1,
                      background: 'var(--line)',
                      opacity: 0.6,
                    }}
                  />
                ))}
                {classes
                  .filter((c) => c.day === di)
                  .map((c) => {
                    const top = (c.start - HOUR_START) * ROW_H;
                    const h = (c.end - c.start) * ROW_H;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setEditing({ mode: 'edit', cls: c })}
                        style={{
                          position: 'absolute',
                          top: top + 2,
                          left: 2,
                          right: 2,
                          height: h - 4,
                          borderRadius: 8,
                          background: c.color,
                          color: '#fff',
                          padding: '6px',
                          overflow: 'hidden',
                          boxShadow: c.isNext
                            ? '0 0 0 2px var(--accent), 0 4px 10px rgba(0,0,0,0.18)'
                            : 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          border: 0,
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                            lineHeight: 1.15,
                          }}
                        >
                          {c.name}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: 8, opacity: 0.85, lineHeight: 1.15 }}>
                          {c.building} {c.room}
                        </p>
                      </button>
                    );
                  })}
              </div>
            ))}
          </div>
        </Card>

        {/* 주간 요약 */}
        <Card style={{ marginTop: 14, padding: 14 }}>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>이번 주 요약</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 8 }}>
            <Stat n={String(totalCount)} l="총 강의" />
            <Stat n={`${totalHours}h`} l="수업 시간" />
            <Stat n={String(freeDays)} l="공강일" />
          </div>
        </Card>

        {/* 빈 상태 안내 */}
        {classes.length === 0 && (
          <Card style={{ marginTop: 14, padding: 24, textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 26, marginBottom: 8 }}>📅</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--ink-2)' }}>
              아직 등록된 강의가 없어요
            </p>
            <p style={{ margin: '6px 0 16px', fontSize: 12, color: 'var(--ink-4)' }}>
              우측 상단 + 버튼으로 강의를 추가하세요
            </p>
          </Card>
        )}
      </PageContainer>

      {/* 강의 추가/수정 모달 */}
      <TimetableClassModal
        editing={editing}
        onClose={() => setEditing(null)}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </>
  );
}

/* ────────────────────────────────────────────────
   TimetableClassModal — 강의 추가/수정 폼 모달
   ──────────────────────────────────────────────── */
type ModalProps = {
  editing: EditState;
  onClose: () => void;
  onSubmit: (form: FormState) => void;
  onDelete: (id: string, name: string) => void;
};

function TimetableClassModal({ editing, onClose, onSubmit, onDelete }: ModalProps) {
  const isEdit = editing?.mode === 'edit';
  const initialForm: FormState = isEdit
    ? {
        name: editing.cls.name,
        day: editing.cls.day,
        start: editing.cls.start,
        end: editing.cls.end,
        building: editing.cls.building,
        room: editing.cls.room,
        professor: editing.cls.professor ?? '',
        category: editing.cls.category,
      }
    : blankForm;

  const [form, setForm] = useState<FormState>(initialForm);

  // editing 변경 시 form 리셋
  // (key prop 대신 — Modal 내부 컴포넌트는 매번 다시 렌더되므로 OK)
  if (editing && form.name === blankForm.name && form.building === blankForm.building && isEdit) {
    setForm(initialForm);
  }

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  if (!editing) return null;

  return (
    <Modal
      open={!!editing}
      onClose={onClose}
      title={isEdit ? '강의 수정' : '강의 추가'}
      footer={
        <div style={{ display: 'flex', gap: 8 }}>
          {isEdit && (
            <button
              type="button"
              onClick={() => onDelete(editing.cls.id, form.name)}
              style={{
                height: 44,
                padding: '0 14px',
                borderRadius: 12,
                background: 'oklch(0.94 0.04 18)',
                color: 'oklch(0.42 0.14 18)',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              삭제
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
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
          <button
            type="button"
            onClick={() => onSubmit(form)}
            style={{
              flex: 2,
              height: 44,
              borderRadius: 12,
              background: 'var(--ink)',
              color: 'var(--bg)',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {isEdit ? '저장' : '추가'}
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* 미리보기 */}
        <div
          style={{
            padding: 12,
            borderRadius: 12,
            background: form.category ? CATEGORY_COLOR[form.category] : 'var(--primary)',
            color: '#fff',
          }}
        >
          <p style={{ margin: 0, fontSize: 14, fontWeight: 800, letterSpacing: '-0.02em' }}>
            {form.name || '(강의명 없음)'}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 11, opacity: 0.85 }}>
            {DAYS[form.day]}요일 · {timeLabel(form.start)} ~ {timeLabel(form.end)} ·{' '}
            {form.building || '?'} {form.room}
          </p>
        </div>

        <div>
          <FieldLabel>강의명</FieldLabel>
          <Field
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="예: 자료구조와 알고리즘"
            style={{ height: 42 }}
            autoFocus
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <FieldLabel>요일</FieldLabel>
            <SelectField
              value={String(form.day)}
              onChange={(e) => update('day', Number(e.target.value) as FormState['day'])}
              style={{ height: 42 }}
            >
              {DAYS.map((d, i) => (
                <option key={d} value={i}>
                  {d}요일
                </option>
              ))}
            </SelectField>
          </div>
          <div>
            <FieldLabel>구분</FieldLabel>
            <SelectField
              value={form.category}
              onChange={(e) => update('category', e.target.value as FormState['category'])}
              style={{ height: 42 }}
            >
              <option value="전공">전공</option>
              <option value="교양">교양</option>
              <option value="체육">체육</option>
            </SelectField>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <FieldLabel>시작 시간</FieldLabel>
            <SelectField
              value={String(form.start)}
              onChange={(e) => update('start', Number(e.target.value))}
              style={{ height: 42 }}
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </SelectField>
          </div>
          <div>
            <FieldLabel>종료 시간</FieldLabel>
            <SelectField
              value={String(form.end)}
              onChange={(e) => update('end', Number(e.target.value))}
              style={{ height: 42 }}
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </SelectField>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <FieldLabel>건물</FieldLabel>
            <Field
              value={form.building}
              onChange={(e) => update('building', e.target.value)}
              placeholder="예: IT관"
              style={{ height: 42 }}
            />
          </div>
          <div>
            <FieldLabel>강의실</FieldLabel>
            <Field
              value={form.room}
              onChange={(e) => update('room', e.target.value)}
              placeholder="예: 403"
              style={{ height: 42 }}
            />
          </div>
        </div>

        <div>
          <FieldLabel>교수님 (선택)</FieldLabel>
          <Field
            value={form.professor}
            onChange={(e) => update('professor', e.target.value)}
            placeholder="예: 김교수"
            style={{ height: 42 }}
          />
        </div>
      </div>
    </Modal>
  );
}

function timeLabel(v: number): string {
  const h = Math.floor(v);
  const m = v % 1 === 0 ? '00' : '30';
  return `${h}:${m}`;
}
