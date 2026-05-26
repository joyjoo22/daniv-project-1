// 어드민 — 사용자 관리
//
// 좌측: 사용자 테이블 (검색 + 상태 필터)
// 우측: 선택된 사용자 상세 + 관리자 권한 / 정지 토글 / 강제 탈퇴
import { useEffect, useMemo, useState } from 'react';
import {
  Card,
  Tag,
  Switch,
  Field,
  UserIcon,
} from '@/components/ui';
import { AdminHeader } from './AdminShell';
import { usersApi } from '@/api';
import { useUIStore } from '@/store/uiStore';
import type { AdminUser } from '@/types/domain';

type StatusFilter = 'all' | 'active' | 'admin' | 'suspended';

export default function AdminUsersPage() {
  const pushToast = useUIStore((s) => s.pushToast);
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await usersApi.list();
      setItems(data);
      if (!selectedId && data.length > 0) setSelectedId(data[0].id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    let list = items;
    if (filter === 'admin') list = list.filter((u) => u.isAdmin);
    else if (filter === 'suspended') list = list.filter((u) => u.isSuspended);
    else if (filter === 'active') list = list.filter((u) => !u.isSuspended && !u.isAdmin);
    const q = search.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (u) =>
          u.nickname.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.department.toLowerCase().includes(q),
      );
    }
    return list;
  }, [items, filter, search]);

  const selected = selectedId ? items.find((u) => u.id === selectedId) ?? null : null;

  const adminCount = items.filter((u) => u.isAdmin).length;
  const suspendedCount = items.filter((u) => u.isSuspended).length;

  const handleToggleAdmin = async (u: AdminUser) => {
    const next = !u.isAdmin;
    if (next && !window.confirm(`'${u.nickname}'을(를) 관리자로 승격하시겠어요?`)) return;
    try {
      const updated = await usersApi.toggleAdmin(u.id, next);
      setItems((prev) => prev.map((x) => (x.id === u.id ? updated : x)));
      pushToast(next ? `${u.nickname} 관리자 승격` : `${u.nickname} 관리자 해제`, 'success');
    } catch {
      pushToast('변경 실패', 'error');
    }
  };

  const handleToggleSuspend = async (u: AdminUser) => {
    const next = !u.isSuspended;
    if (next && !window.confirm(`'${u.nickname}'을(를) 정지하시겠어요? 로그인이 차단됩니다.`)) return;
    try {
      const updated = await usersApi.toggleSuspend(u.id, next);
      setItems((prev) => prev.map((x) => (x.id === u.id ? updated : x)));
      pushToast(next ? `${u.nickname} 정지 처리` : `${u.nickname} 정지 해제`, 'success');
    } catch {
      pushToast('변경 실패', 'error');
    }
  };

  const handleDelete = async (u: AdminUser) => {
    if (
      !window.confirm(
        `'${u.nickname}' 계정을 삭제할까요?\n작성한 모든 리뷰/스탬프가 함께 삭제되며 복구할 수 없어요.`,
      )
    )
      return;
    try {
      await usersApi.remove(u.id);
      setItems((prev) => prev.filter((x) => x.id !== u.id));
      setSelectedId(null);
      pushToast(`${u.nickname} 삭제 완료`, 'success');
    } catch {
      pushToast('삭제 실패', 'error');
    }
  };

  return (
    <>
      <AdminHeader
        title="사용자 관리"
        sub={`총 ${items.length}명 · 관리자 ${adminCount}명 · 정지 ${suspendedCount}명`}
        action={
          <Field
            placeholder="닉네임 / 이메일 / 학과 검색…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ height: 36, fontSize: 13, width: 260 }}
          />
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', minHeight: 0 }}>
        {/* 리스트 */}
        <div style={{ padding: '20px 16px 20px 24px', borderRight: '1px solid var(--line)' }}>
          <div className="seg" style={{ marginBottom: 12, maxWidth: 420 }}>
            {(
              [
                ['all', '전체'],
                ['active', '일반'],
                ['admin', '관리자'],
                ['suspended', '정지'],
              ] as Array<[StatusFilter, string]>
            ).map(([v, l]) => (
              <button
                key={v}
                type="button"
                data-active={filter === v ? 'true' : undefined}
                onClick={() => setFilter(v)}
              >
                {l}
              </button>
            ))}
          </div>

          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '38px 1fr 80px 60px 70px',
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
              <span>닉네임 · 학과 · 이메일</span>
              <span style={{ textAlign: 'right' }}>포인트</span>
              <span style={{ textAlign: 'right' }}>리뷰</span>
              <span style={{ textAlign: 'right' }}>상태</span>
            </div>

            {loading ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--ink-4)', fontSize: 13 }}>
                불러오는 중...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--ink-4)', fontSize: 13 }}>
                해당 조건의 사용자가 없어요.
              </div>
            ) : (
              filtered.map((u) => {
                const sel = selectedId === u.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setSelectedId(u.id)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '38px 1fr 80px 60px 70px',
                      alignItems: 'center',
                      padding: '12px 14px',
                      borderTop: '1px solid var(--line)',
                      background: sel ? 'var(--primary-soft)' : 'transparent',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                      opacity: u.isSuspended ? 0.55 : 1,
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: u.isAdmin ? 'var(--ink)' : 'var(--primary-soft)',
                        color: u.isAdmin ? '#fff' : 'var(--primary-ink)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {u.nickname[0]}
                    </div>
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
                          {u.nickname}
                        </p>
                        {u.isAdmin && <Tag variant="indigo">ADMIN</Tag>}
                        {u.isSuspended && <Tag variant="rose">정지</Tag>}
                      </div>
                      <p style={{ margin: 0, fontSize: 10, color: 'var(--ink-4)' }}>
                        {u.department} · {u.studentId}학번 · {u.email}
                      </p>
                    </div>
                    <span className="mono" style={{ fontSize: 12, fontWeight: 600, textAlign: 'right' }}>
                      {u.totalPoints}p
                    </span>
                    <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)', textAlign: 'right' }}>
                      {u.reviewCount}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--ink-4)', textAlign: 'right' }} className="mono">
                      {u.lastSeenAt}
                    </span>
                  </button>
                );
              })
            )}
          </Card>
        </div>

        {/* 상세 */}
        <div style={{ padding: '20px 24px 20px 16px', background: 'var(--bg-2)' }}>
          {!selected ? (
            <Card style={{ padding: 32, textAlign: 'center', color: 'var(--ink-4)' }}>
              <p style={{ margin: 0, fontSize: 30, marginBottom: 12 }}>👤</p>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--ink-3)' }}>사용자 선택</p>
            </Card>
          ) : (
            <>
              {/* 프로필 헤더 */}
              <Card
                style={{
                  padding: 18,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: selected.isAdmin ? 'var(--ink)' : 'var(--primary)',
                    color: '#fff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    fontWeight: 800,
                  }}
                >
                  {selected.nickname[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <p style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>{selected.nickname}</p>
                    {selected.isAdmin && <Tag variant="indigo">ADMIN</Tag>}
                    {selected.isSuspended && <Tag variant="rose">정지</Tag>}
                    <Tag variant="amber">Lv.{selected.level}</Tag>
                  </div>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--ink-3)' }}>
                    {selected.department} · {selected.studentId}학번
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--ink-4)' }}>
                    {selected.email}
                  </p>
                </div>
              </Card>

              {/* 활동 통계 */}
              <Card
                style={{
                  marginTop: 12,
                  padding: '16px 0',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr',
                }}
              >
                {[
                  [`${selected.totalPoints}p`, '포인트'],
                  [selected.stampCount, '스탬프'],
                  [selected.reviewCount, '리뷰'],
                  [selected.lastSeenAt, '마지막 접속'],
                ].map(([n, l], i) => (
                  <div
                    key={l as string}
                    style={{
                      textAlign: 'center',
                      borderLeft: i ? '1px solid var(--line)' : 'none',
                    }}
                  >
                    <p
                      className="mono"
                      style={{
                        margin: 0,
                        fontSize: i === 3 ? 13 : 18,
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {n}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 10, color: 'var(--ink-4)' }}>{l as string}</p>
                  </div>
                ))}
              </Card>

              {/* 가입 정보 */}
              <Card
                style={{
                  marginTop: 12,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: 'var(--ink-3)' }}>
                  계정 정보
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--ink-3)' }}>가입일</span>
                  <span className="mono">{selected.joinedAt}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--ink-3)' }}>캠퍼스</span>
                  <span>{selected.campus === 'jukjeon' ? '죽전' : '천안'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--ink-3)' }}>User ID</span>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>
                    {selected.id}
                  </span>
                </div>
              </Card>

              {/* 권한 / 정지 토글 */}
              <Card style={{ marginTop: 12, padding: 16 }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: 'var(--ink-3)', marginBottom: 8 }}>
                  권한 관리
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderTop: '1px solid var(--line)',
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>관리자 권한</p>
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>
                      /admin 페이지 접근 + DB RLS is_admin = true
                    </p>
                  </div>
                  <Switch on={selected.isAdmin} size="sm" onChange={() => handleToggleAdmin(selected)} />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderTop: '1px solid var(--line)',
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>계정 정지</p>
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>
                      로그인 차단 + 모든 작성 권한 회수
                    </p>
                  </div>
                  <Switch
                    on={selected.isSuspended}
                    size="sm"
                    danger
                    onChange={() => handleToggleSuspend(selected)}
                  />
                </div>
              </Card>

              {/* 위험 영역 */}
              <Card
                style={{
                  marginTop: 12,
                  padding: 16,
                  borderColor: 'oklch(0.85 0.08 18)',
                  background: 'oklch(0.97 0.02 18)',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'oklch(0.42 0.14 18)',
                    marginBottom: 8,
                  }}
                >
                  위험한 작업
                </p>
                <p style={{ margin: '0 0 10px', fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.5 }}>
                  이 사용자가 작성한 모든 리뷰, 스탬프, 포인트 내역이 영구 삭제됩니다.
                  복구 불가능합니다.
                </p>
                <button
                  type="button"
                  onClick={() => handleDelete(selected)}
                  style={{
                    width: '100%',
                    height: 40,
                    borderRadius: 10,
                    background: 'oklch(0.62 0.16 18)',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  <UserIcon size={14} /> 계정 영구 삭제
                </button>
              </Card>
            </>
          )}
        </div>
      </div>
    </>
  );
}
