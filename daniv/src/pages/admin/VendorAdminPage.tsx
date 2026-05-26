// 사장님 모바일 모드 — 한 손 사용, 큰 토글 카드 + 진행률 헤로
import { useState } from 'react';
import { Button, Tag, Switch } from '@/components/ui';

type Row = {
  id: number;
  c: string;
  m: string;
  p: number;
  q: number;
  s: number;
  soldout: boolean;
};

const INITIAL: Row[] = [
  { id: 1, c: '한식 A', m: '제육볶음 정식',    p: 5500, q: 84,  s: 21, soldout: false },
  { id: 2, c: '한식 B', m: '돈까스 정식',      p: 6000, q: 60,  s: 60, soldout: true  },
  { id: 3, c: '양식 C', m: '스파게티',         p: 6500, q: 50,  s: 12, soldout: false },
  { id: 4, c: '분식 D', m: '라면 · 김밥 세트', p: 4500, q: 100, s: 38, soldout: false },
  { id: 5, c: '일품 E', m: '비빔밥',           p: 5000, q: 40,  s: 9,  soldout: false },
];

export default function VendorAdminPage() {
  const [items, setItems] = useState<Row[]>(INITIAL);
  const toggle = (id: number) =>
    setItems((s) => s.map((r) => (r.id === id ? { ...r, soldout: !r.soldout } : r)));

  const soldoutN = items.filter((i) => i.soldout).length;
  const totalSold = items.reduce((s, i) => s + i.s, 0);
  const totalQty = items.reduce((s, i) => s + i.q, 0);
  const pct = Math.round((totalSold / totalQty) * 100);

  return (
    <div
      style={{
        maxWidth: 480,
        width: '100%',
        margin: '0 auto',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
      }}
    >
      {/* 상단 */}
      <div
        style={{
          padding: '12px 16px',
          background: 'var(--card)',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'var(--ink)',
            color: '#fff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 800,
          }}
        >
          학
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>학생회관 1F</p>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            학생식당 사장님 모드
          </p>
        </div>
        <div
          style={{
            padding: '5px 10px',
            borderRadius: 999,
            background: 'oklch(0.94 0.04 165)',
            color: 'oklch(0.42 0.12 165)',
            fontSize: 10,
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <span
            className="animate-daniv-pulse"
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: 'oklch(0.62 0.13 165)',
            }}
          />
          실시간
        </div>
      </div>

      {/* 진행률 헤로 */}
      <div style={{ padding: '14px 16px 0', flexShrink: 0 }}>
        <div
          style={{
            background: 'var(--hero-bg)',
            color: 'var(--hero-fg)',
            borderRadius: 20,
            padding: 16,
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
              opacity: 0.3,
              filter: 'blur(20px)',
            }}
          />
          <div style={{ position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 11, opacity: 0.7 }}>오늘 점심 · 11:30 — 14:00</span>
              <span className="mono" style={{ fontSize: 11, opacity: 0.7 }}>03/12 (수)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
              <p
                className="mono"
                style={{
                  margin: 0,
                  fontSize: 32,
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                }}
              >
                {pct}%
              </p>
              <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>
                {totalSold} / {totalQty}식 판매
              </p>
            </div>
            <div
              style={{
                height: 6,
                borderRadius: 999,
                background: 'rgba(255,255,255,0.16)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: 'var(--accent)',
                  borderRadius: 999,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 빠른 액션 */}
      <div style={{ padding: '12px 16px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            style={{
              flex: 1,
              height: 44,
              borderRadius: 14,
              background: 'var(--card)',
              border: '1px solid var(--line)',
              fontSize: 13,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            📣 공지 푸시
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              height: 44,
              borderRadius: 14,
              background: 'oklch(0.94 0.04 18)',
              color: 'oklch(0.42 0.14 18)',
              fontSize: 13,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            전체 품절
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>오늘의 메뉴</p>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>
            <span className="mono" style={{ color: 'oklch(0.62 0.16 18)', fontWeight: 700 }}>
              {soldoutN}
            </span>{' '}
            / {items.length} 품절
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((r) => {
            const remain = r.q - r.s;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => toggle(r.id)}
                style={{
                  background: 'var(--card)',
                  borderRadius: 18,
                  border:
                    '1px solid ' + (r.soldout ? 'oklch(0.85 0.08 18)' : 'var(--line)'),
                  padding: 14,
                  textAlign: 'left',
                  width: '100%',
                  opacity: r.soldout ? 0.7 : 1,
                  transition: 'all .15s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {r.soldout && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      padding: '4px 10px',
                      borderRadius: '0 16px 0 12px',
                      background: 'oklch(0.62 0.16 18)',
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                    }}
                  >
                    SOLD OUT
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: 'var(--bg-2)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      flexShrink: 0,
                    }}
                  >
                    🍱
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Tag variant="indigo">{r.c}</Tag>
                      <span className="mono" style={{ fontSize: 11, fontWeight: 600 }}>
                        {r.p.toLocaleString()}원
                      </span>
                    </div>
                    <p
                      style={{
                        margin: '4px 0 0',
                        fontSize: 14,
                        fontWeight: 600,
                        textDecoration: r.soldout ? 'line-through' : 'none',
                      }}
                    >
                      {r.m}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                      <div
                        style={{
                          flex: 1,
                          height: 4,
                          borderRadius: 999,
                          background: 'var(--bg-3)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${(r.s / r.q) * 100}%`,
                            height: '100%',
                            background: r.soldout ? 'oklch(0.62 0.16 18)' : 'var(--primary)',
                          }}
                        />
                      </div>
                      <span
                        className="mono"
                        style={{
                          fontSize: 10,
                          color: 'var(--ink-4)',
                          minWidth: 64,
                          textAlign: 'right',
                        }}
                      >
                        남은 {remain}식
                      </span>
                    </div>
                  </div>
                  <Switch on={r.soldout} size="lg" danger showCross />
                </div>
              </button>
            );
          })}
        </div>

        <p
          style={{
            margin: '16px 4px 0',
            fontSize: 11,
            color: 'var(--ink-4)',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          품절 토글은 즉시 학생 앱에 반영됩니다.<br />
          마지막 동기화 · 방금 전
        </p>
      </div>

      {/* 마감 CTA */}
      <div
        style={{
          padding: '10px 16px 20px',
          background: 'var(--card)',
          borderTop: '1px solid var(--line)',
          flexShrink: 0,
        }}
      >
        <Button variant="primary" style={{ height: 48 }}>
          점심 영업 마감
        </Button>
      </div>
    </div>
  );
}
