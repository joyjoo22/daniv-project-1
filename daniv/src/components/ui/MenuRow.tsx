// 메뉴 행 — 시안 MyPageScreen 의 MenuRow / SettingsScreen 의 SelectRow / ToggleRow.
// 세 변형을 하나의 파일로 묶고, 사용처에 맞는 export 를 제공.
import type { ReactNode } from 'react';
import { ChevronRightIcon } from './Icon';
import { Switch } from './Switch';
import { Tag } from './Tag';

/* ───────── MenuRow ─────────
   MY 페이지의 "내 리뷰 / 즐겨찾기 / 포인트 내역" 같은 단순 네비게이션 행 */
type MenuRowProps = {
  label: string;
  value?: ReactNode;
  last?: boolean;
  danger?: boolean;
  onClick?: () => void;
};

export function MenuRow({ label, value, last = false, danger = false, onClick }: MenuRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '13px 12px',
        borderTop: !last ? '1px solid var(--line)' : 'none',
        color: danger ? 'var(--rose)' : 'var(--ink)',
        width: '100%',
        textAlign: 'left',
        background: 'transparent',
      }}
    >
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{label}</span>
      {value && <span style={{ fontSize: 12, color: 'var(--ink-4)', marginRight: 6 }}>{value}</span>}
      {!danger && (
        <span style={{ color: 'var(--ink-4)' }}>
          <ChevronRightIcon size={14} />
        </span>
      )}
    </button>
  );
}

/* ───────── SelectRow ─────────
   설정 화면의 "언어 / 캠퍼스 / 위치 권한" 등 — icon + 제목 + 값 + chevron */
type SelectRowProps = {
  icon: ReactNode;
  title: string;
  value?: ReactNode;
  badge?: ReactNode;
  danger?: boolean;
  last?: boolean;
  onClick?: () => void;
};

export function SelectRow({ icon, title, value, badge, danger = false, last = false, onClick }: SelectRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 12px',
        borderTop: !last ? '1px solid var(--line)' : 'none',
        color: danger ? 'var(--rose)' : 'var(--ink)',
        width: '100%',
        textAlign: 'left',
        background: 'transparent',
      }}
    >
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          background: 'var(--bg-2)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 15,
        }}
      >
        {icon}
      </span>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{title}</span>
      {badge && (
        <Tag variant="amber" style={{ marginRight: 4 }}>
          {badge}
        </Tag>
      )}
      {value && <span style={{ fontSize: 12, color: 'var(--ink-4)', marginRight: 4 }}>{value}</span>}
      {!danger && (
        <span style={{ color: 'var(--ink-4)' }}>
          <ChevronRightIcon size={14} />
        </span>
      )}
    </button>
  );
}

/* ───────── ToggleRow ─────────
   설정 화면의 알림 토글 행들 — icon + 제목/부제 + Switch */
type ToggleRowProps = {
  icon: ReactNode;
  title: string;
  sub?: string;
  on: boolean;
  onChange?: () => void;
  last?: boolean;
};

export function ToggleRow({ icon, title, sub, on, onChange, last = false }: ToggleRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 12px',
        borderTop: !last ? '1px solid var(--line)' : 'none',
      }}
    >
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          background: 'var(--bg-2)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 15,
        }}
      >
        {icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{title}</p>
        {sub && <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>{sub}</p>}
      </div>
      <Switch on={on} onChange={onChange} />
    </div>
  );
}
