// 어드민 — 건물 / 시설 관리
import { useEffect, useState } from 'react';
import { Card, Field, FieldLabel, SelectField, Tag, MapPicker } from '@/components/ui';
import { AdminHeader } from './AdminShell';
import { buildingsApi, type CreateBuildingRequest } from '@/api';
import { useUIStore } from '@/store/uiStore';
import type { Building, Campus } from '@/types/domain';
import { JUKJEON_CAMPUS } from '@/lib/env';

type EditingState =
  | { mode: 'view'; building: Building | null }
  | { mode: 'create' }
  | { mode: 'edit'; building: Building };

const blankForm: CreateBuildingRequest = {
  code: '',
  name: '',
  campus: 'jukjeon',
  floors: '지상 5층',
  walkMin: 5,
  lat: JUKJEON_CAMPUS.lat,
  lng: JUKJEON_CAMPUS.lng,
};

export default function AdminBuildingsPage() {
  const pushToast = useUIStore((s) => s.pushToast);
  const [items, setItems] = useState<Building[]>([]);
  const [editing, setEditing] = useState<EditingState>({ mode: 'view', building: null });
  const [loading, setLoading] = useState(true);
  const [campusFilter, setCampusFilter] = useState<'all' | Campus>('all');

  const load = async () => {
    setLoading(true);
    try {
      const data = await buildingsApi.list();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = campusFilter === 'all' ? items : items.filter((b) => b.campus === campusFilter);
  const jukjeonCount = items.filter((b) => b.campus === 'jukjeon').length;
  const cheonanCount = items.filter((b) => b.campus === 'cheonan').length;

  const handleCreate = async (form: CreateBuildingRequest) => {
    try {
      const created = await buildingsApi.create(form);
      setItems((prev) => [created, ...prev]);
      setEditing({ mode: 'edit', building: created });
      pushToast(`${created.name} 등록 완료`, 'success');
    } catch {
      pushToast('등록 실패', 'error');
    }
  };

  const handleUpdate = async (id: string, patch: Partial<Building>) => {
    try {
      const updated = await buildingsApi.update(id, patch);
      setItems((prev) => prev.map((b) => (b.id === id ? updated : b)));
      setEditing({ mode: 'edit', building: updated });
      pushToast('저장 완료', 'success');
    } catch {
      pushToast('저장 실패', 'error');
    }
  };

  const handleDelete = async (b: Building) => {
    if (!window.confirm(`'${b.name}'을(를) 삭제할까요? 연결된 학식 메뉴도 함께 삭제됩니다.`)) return;
    try {
      await buildingsApi.remove(b.id);
      setItems((prev) => prev.filter((x) => x.id !== b.id));
      setEditing({ mode: 'view', building: null });
      pushToast(`${b.name} 삭제 완료`, 'success');
    } catch {
      pushToast('삭제 실패', 'error');
    }
  };

  return (
    <>
      <AdminHeader
        title="건물 / 시설 관리"
        sub={`총 ${items.length}개 · 죽전 ${jukjeonCount}개 / 천안 ${cheonanCount}개`}
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
            + 건물 등록
          </button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', minHeight: 0 }}>
        {/* 리스트 */}
        <div style={{ padding: '20px 16px 20px 24px', borderRight: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <div className="seg" style={{ width: 240 }}>
              <button
                type="button"
                data-active={campusFilter === 'all' ? 'true' : undefined}
                onClick={() => setCampusFilter('all')}
              >
                전체
              </button>
              <button
                type="button"
                data-active={campusFilter === 'jukjeon' ? 'true' : undefined}
                onClick={() => setCampusFilter('jukjeon')}
              >
                죽전
              </button>
              <button
                type="button"
                data-active={campusFilter === 'cheonan' ? 'true' : undefined}
                onClick={() => setCampusFilter('cheonan')}
              >
                천안
              </button>
            </div>
          </div>

          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr 100px 80px 80px',
                padding: '10px 14px',
                background: 'var(--bg-3)',
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--ink-3)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <span>코드</span>
              <span>이름 · 층수</span>
              <span>캠퍼스</span>
              <span style={{ textAlign: 'right' }}>도보</span>
              <span style={{ textAlign: 'right' }}>좌표</span>
            </div>

            {loading ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--ink-4)', fontSize: 13 }}>
                불러오는 중...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--ink-4)', fontSize: 13 }}>
                등록된 건물이 없어요.
              </div>
            ) : (
              filtered.map((b) => {
                const selected = editing.mode === 'edit' && editing.building.id === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setEditing({ mode: 'edit', building: b })}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60px 1fr 100px 80px 80px',
                      alignItems: 'center',
                      padding: '12px 14px',
                      borderTop: '1px solid var(--line)',
                      background: selected ? 'var(--primary-soft)' : 'transparent',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <Tag variant="indigo">{b.code}</Tag>
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
                        {b.name}
                      </p>
                      <p style={{ margin: 0, fontSize: 10, color: 'var(--ink-4)' }}>{b.floors}</p>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                      {b.campus === 'jukjeon' ? '죽전' : '천안'}
                    </span>
                    <span
                      className="mono"
                      style={{ fontSize: 12, fontWeight: 600, textAlign: 'right' }}
                    >
                      {b.walkMin}분
                    </span>
                    <span
                      className="mono"
                      style={{ fontSize: 9, color: 'var(--ink-4)', textAlign: 'right' }}
                    >
                      {typeof b.lat === 'number' && typeof b.lng === 'number' ? (
                        <>
                          {b.lat.toFixed(4)}
                          <br />
                          {b.lng.toFixed(4)}
                        </>
                      ) : (
                        '미설정'
                      )}
                    </span>
                  </button>
                );
              })
            )}
          </Card>
        </div>

        {/* 상세 / 등록 */}
        <div style={{ padding: '20px 24px 20px 16px', background: 'var(--bg-2)' }}>
          {editing.mode === 'view' && (
            <Card style={{ padding: 32, textAlign: 'center', color: 'var(--ink-4)', fontSize: 13 }}>
              <p style={{ margin: 0, fontSize: 30, marginBottom: 12 }}>🏛</p>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--ink-3)' }}>
                좌측에서 건물 선택
              </p>
            </Card>
          )}
          {editing.mode === 'create' && (
            <BuildingForm
              key="create"
              initial={blankForm}
              submitLabel="등록"
              onCancel={() => setEditing({ mode: 'view', building: null })}
              onSubmit={handleCreate}
            />
          )}
          {editing.mode === 'edit' && (
            <BuildingForm
              key={editing.building.id}
              initial={editing.building}
              submitLabel="저장"
              onCancel={() => setEditing({ mode: 'view', building: null })}
              onSubmit={(form) => handleUpdate(editing.building.id, form)}
              extraAction={
                <button
                  type="button"
                  onClick={() => handleDelete(editing.building)}
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

type BuildingFormProps = {
  initial: CreateBuildingRequest | Building;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (form: CreateBuildingRequest) => void;
  extraAction?: React.ReactNode;
};

function BuildingForm({ initial, submitLabel, onCancel, onSubmit, extraAction }: BuildingFormProps) {
  const [form, setForm] = useState<CreateBuildingRequest>({
    code: initial.code,
    name: initial.name,
    campus: initial.campus,
    floors: initial.floors,
    walkMin: initial.walkMin,
    lat: initial.lat ?? JUKJEON_CAMPUS.lat,
    lng: initial.lng ?? JUKJEON_CAMPUS.lng,
  });
  const update = <K extends keyof CreateBuildingRequest>(k: K, v: CreateBuildingRequest[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  // 지도 클릭 → 좌표 동시 업데이트.
  const handleMapPick = (lat: number, lng: number) => {
    setForm((f) => ({ ...f, lat, lng }));
  };

  // 캠퍼스 변경 시 해당 캠퍼스 중심으로 좌표 리셋 (사용자가 좌표를 명시 변경 안 한 경우).
  const handleCampusChange = (campus: Campus) => {
    setForm((f) => ({ ...f, campus }));
  };

  const canSubmit = form.code.trim().length >= 1 && form.name.trim().length >= 2;

  return (
    <>
      <Card style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <Tag variant="indigo">{form.code || '?'}</Tag>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{form.name || '(이름 없음)'}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10 }}>
          <div>
            <FieldLabel>코드</FieldLabel>
            <Field
              value={form.code}
              onChange={(e) => update('code', e.target.value.toUpperCase())}
              placeholder="B11"
              style={{ height: 40 }}
            />
          </div>
          <div>
            <FieldLabel>이름</FieldLabel>
            <Field
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="학생회관"
              style={{ height: 40 }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div>
            <FieldLabel>캠퍼스</FieldLabel>
            <SelectField
              value={form.campus}
              onChange={(e) => handleCampusChange(e.target.value as Campus)}
              style={{ height: 40 }}
            >
              <option value="jukjeon">죽전</option>
              <option value="cheonan">천안</option>
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
            <FieldLabel>층 구성</FieldLabel>
            <Field
              value={form.floors}
              onChange={(e) => update('floors', e.target.value)}
              placeholder="지하 1층 ~ 지상 4층"
              style={{ height: 40 }}
            />
          </div>
        </div>

        {/* ─── GPS 좌표 픽킹 ─── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 4,
            paddingTop: 12,
            borderTop: '1px solid var(--line)',
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--ink-2)' }}>
              GPS 좌표
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--ink-4)' }}>
              지도를 클릭해서 위치 선택 · 학생 앱 지도/길찾기에 사용됨
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const fallback =
                form.campus === 'jukjeon'
                  ? JUKJEON_CAMPUS
                  : { lat: JUKJEON_CAMPUS.lat, lng: JUKJEON_CAMPUS.lng }; // 천안 좌표는 향후 추가
              setForm((f) => ({ ...f, lat: fallback.lat, lng: fallback.lng }));
            }}
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--primary-ink)',
              padding: '6px 10px',
              borderRadius: 8,
              background: 'var(--primary-soft)',
            }}
          >
            ↺ 캠퍼스 중심으로
          </button>
        </div>

        <MapPicker lat={form.lat} lng={form.lng} onChange={handleMapPick} height={220} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <FieldLabel>위도 (lat)</FieldLabel>
            <Field
              mono
              type="number"
              step="0.0001"
              value={String(form.lat ?? '')}
              onChange={(e) => update('lat', Number(e.target.value) || undefined)}
              placeholder="37.3215"
              style={{ height: 40 }}
            />
          </div>
          <div>
            <FieldLabel>경도 (lng)</FieldLabel>
            <Field
              mono
              type="number"
              step="0.0001"
              value={String(form.lng ?? '')}
              onChange={(e) => update('lng', Number(e.target.value) || undefined)}
              placeholder="127.1262"
              style={{ height: 40 }}
            />
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
