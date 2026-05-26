// 어드민 대시보드 — KPI 4개 + 라인 차트 + 핫 토픽 + 처리대기 + 최근활동
import { Card, Tag, Segmented, BellIcon } from '@/components/ui';
import { AdminHeader } from './AdminShell';
import { useState } from 'react';

const KPI = [
  { l: '활성 사용자 (DAU)', v: '1,284', d: '+8.2%',     pos: true,  k: 'vs 어제', warn: false },
  { l: '오늘 작성 리뷰',     v: '47',    d: '+12',       pos: true,  k: 'vs 어제', warn: false },
  { l: '리워드 교환',        v: '23',    d: '-3',        pos: false, k: 'vs 어제', warn: false },
  { l: '리뷰 신고',          v: '2',     d: '처리 필요', pos: false, k: '긴급',    warn: true  },
] as const;

const HOT = [
  { r: 1, n: '단풍식당',           k: '검색 +124% · 리뷰 8건',   c: 'var(--primary)' },
  { r: 2, n: '학생회관 학식',       k: "검색 +67% · '품절' 11건", c: 'var(--accent)' },
  { r: 3, n: '사진동아리 한울',     k: '조회 +52% · 가입 4건',    c: 'oklch(0.62 0.13 165)' },
  { r: 4, n: 'STAFF COFFEE',       k: '리뷰 +5건',                c: 'oklch(0.62 0.16 18)' },
] as const;

const PENDING = [
  { t: '리뷰 신고 (명예훼손 의심)', k: '단풍식당 · 5분 전',     action: '검토' },
  { t: '동아리 정보 수정 요청',     k: 'RUNRUN · 1시간 전',      action: '확인' },
  { t: '학식 메뉴 업로드 누락',     k: '공대식당 · 오늘 11시',   action: '입력' },
] as const;

const RECENT = [
  { u: '단풍이', a: '리뷰 작성',   t: '단풍식당 · ★5',    time: '2분 전' },
  { u: '준영',   a: '스탬프 획득', t: '캠퍼스 라멘',      time: '8분 전' },
  { u: '민지',   a: '리워드 교환', t: '스타벅스 500p',    time: '12분 전' },
  { u: '수아',   a: '회원가입',   t: '경영학과 25',      time: '26분 전' },
] as const;

export default function AdminDashboardPage() {
  const [range, setRange] = useState<'7' | '30' | 'sem'>('7');

  return (
    <>
      <AdminHeader
        title="안녕하세요, 학생복지팀님 👋"
        sub="2025년 3월 12일 (수) · 오늘의 캠퍼스 현황"
        action={
          <button
            type="button"
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
            + 공지 작성
          </button>
        }
      />

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* KPI */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
          }}
        >
          {KPI.map((s) => (
            <Card key={s.l} style={{ padding: 16 }}>
              <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-3)' }}>{s.l}</p>
              <p
                className="mono"
                style={{
                  margin: '6px 0 4px',
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                }}
              >
                {s.v}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Tag variant={s.warn ? 'rose' : s.pos ? 'mint' : 'amber'}>{s.d}</Tag>
                <span style={{ fontSize: 10, color: 'var(--ink-4)' }}>{s.k}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* 메인 그리드 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
            gap: 18,
          }}
        >
          {/* 차트 */}
          <Card style={{ padding: 18 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>주간 추이</p>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>일일 활성 사용자</p>
              </div>
              <Segmented
                options={[
                  { value: '7',   label: '7일' },
                  { value: '30',  label: '30일' },
                  { value: 'sem', label: '학기' },
                ]}
                value={range}
                onChange={setRange}
                style={{ width: 200 }}
              />
            </div>

            <DailyChart />
          </Card>

          {/* 핫 토픽 */}
          <Card style={{ padding: 18 }}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>오늘의 핫 토픽</p>
            <p style={{ margin: '2px 0 14px', fontSize: 11, color: 'var(--ink-4)' }}>
              리뷰·검색량 기준
            </p>

            {HOT.map((h) => (
              <div
                key={h.r}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 0',
                  borderTop: h.r > 1 ? '1px solid var(--line)' : 'none',
                }}
              >
                <span
                  className="mono"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: h.c,
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {h.r}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{h.n}</p>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>{h.k}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* 처리 대기 + 최근 활동 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <Card style={{ padding: 18, borderColor: 'oklch(0.85 0.08 18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 10,
                  background: 'oklch(0.94 0.04 18)',
                  color: 'oklch(0.42 0.14 18)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BellIcon size={16} />
              </span>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>처리 대기</p>
            </div>
            {PENDING.map((a, i) => (
              <div
                key={a.t}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 0',
                  borderTop: i ? '1px solid var(--line)' : 'none',
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13 }}>{a.t}</p>
                  <p style={{ margin: 0, fontSize: 10, color: 'var(--ink-4)' }}>{a.k}</p>
                </div>
                <button
                  type="button"
                  style={{
                    padding: '5px 12px',
                    borderRadius: 8,
                    background: 'var(--ink)',
                    color: 'var(--bg)',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {a.action}
                </button>
              </div>
            ))}
          </Card>

          <Card style={{ padding: 18 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, marginBottom: 14 }}>최근 활동</p>
            {RECENT.map((r, i) => (
              <div
                key={r.u + r.time}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 0',
                  borderTop: i ? '1px solid var(--line)' : 'none',
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: 'var(--bg-2)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--ink-2)',
                  }}
                >
                  {r.u[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 12 }}>
                    <strong>{r.u}</strong> · {r.a}
                  </p>
                  <p style={{ margin: 0, fontSize: 10, color: 'var(--ink-4)' }}>{r.t}</p>
                </div>
                <span className="mono" style={{ fontSize: 10, color: 'var(--ink-4)' }}>{r.time}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}

function DailyChart() {
  const pts = [62, 68, 81, 75, 92, 78, 96];
  const w = 480;
  const h = 140;
  const pad = 20;
  const max = 100;
  const xStep = (w - pad * 2) / (pts.length - 1);
  const toXY = (v: number, i: number): [number, number] => [pad + i * xStep, h - pad - (v / max) * (h - pad * 2)];
  const line = pts.map((v, i) => `${i ? 'L' : 'M'}${toXY(v, i).join(',')}`).join(' ');
  const area = line + ` L ${pad + (pts.length - 1) * xStep},${h - pad} L ${pad},${h - pad} Z`;
  const labels = ['3/6', '3/7', '3/8', '3/9', '3/10', '3/11', '3/12'];

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
        <defs>
          <linearGradient id="adm-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="oklch(0.42 0.18 270)" stopOpacity="0.25" />
            <stop offset="1" stopColor="oklch(0.42 0.18 270)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={pad}
            x2={w - pad}
            y1={pad + i * 30}
            y2={pad + i * 30}
            stroke="var(--line)"
            strokeWidth="1"
          />
        ))}
        <path d={area} fill="url(#adm-grad)" />
        <path d={line} stroke="var(--primary)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((v, i) => {
          const [x, y] = toXY(v, i);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i === pts.length - 1 ? 5 : 3}
              fill={i === pts.length - 1 ? 'var(--accent)' : 'var(--primary)'}
              stroke="#fff"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>
      <div
        className="mono"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0 20px',
          fontSize: 10,
          color: 'var(--ink-4)',
        }}
      >
        {labels.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </div>
  );
}
