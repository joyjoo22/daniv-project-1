// 어드민 학식 — 메뉴 테이블 + 품절 토글 + 통계 카드
import { useState } from 'react';
import { Card, Switch, Segmented, SelectField, Field, FieldLabel } from '@/components/ui';
import { AdminHeader } from './AdminShell';

type Row = {
  id: number;
  corner: string;
  menu: string;
  price: number;
  soldout: boolean;
  qty: number;
  sold: number;
};

const INITIAL: Row[] = [
  { id: 1, corner: '한식 A', menu: '제육볶음 · 시금치무침 · 미역국 · 김치',    price: 5500, soldout: false, qty: 84,  sold: 21 },
  { id: 2, corner: '한식 B', menu: '돈까스 · 단무지 · 양배추샐러드 · 미소국', price: 6000, soldout: true,  qty: 60,  sold: 60 },
  { id: 3, corner: '양식 C', menu: '스파게티 · 갈릭브레드 · 샐러드',           price: 6500, soldout: false, qty: 50,  sold: 12 },
  { id: 4, corner: '분식 D', menu: '라면 · 김밥 · 만두 · 단무지',              price: 4500, soldout: false, qty: 100, sold: 38 },
  { id: 5, corner: '일품 E', menu: '비빔밥 · 된장국 · 김치',                   price: 5000, soldout: false, qty: 40,  sold: 9 },
];

export default function AdminCafeteriaPage() {
  const [items, setItems] = useState<Row[]>(INITIAL);
  const [meal, setMeal] = useState<'아침' | '점심' | '저녁'>('점심');
  const toggle = (id: number) =>
    setItems((s) => s.map((r) => (r.id === id ? { ...r, soldout: !r.soldout } : r)));

  const stats = [
    { l: '전체 메뉴',   v: items.length,                          c: 'var(--ink)' },
    { l: '판매중',     v: items.filter((i) => !i.soldout).length, c: 'oklch(0.55 0.13 165)' },
    { l: '품절',       v: items.filter((i) => i.soldout).length,  c: 'oklch(0.62 0.16 18)' },
    { l: '오늘 판매량', v: items.reduce((s, i) => s + i.sold, 0), c: 'var(--primary)' },
  ];

  return (
    <>
      <AdminHeader
        title="학식 메뉴 관리"
        sub="실시간 품절 토글 · 학생들 앱에 즉시 반영됩니다"
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              style={{
                height: 36,
                padding: '0 14px',
                borderRadius: 10,
                background: 'var(--card)',
                border: '1px solid var(--line)',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              CSV 가져오기
            </button>
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
              + 메뉴 추가
            </button>
          </div>
        }
      />

      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* 필터 행 */}
        <Card style={{ padding: 14, display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <FieldLabel>건물</FieldLabel>
            <SelectField defaultValue="학생회관" style={{ height: 36, fontSize: 13, width: 180 }}>
              <option>학생회관</option>
              <option>공대식당</option>
              <option>인문관</option>
              <option>제2학생식당</option>
            </SelectField>
          </div>
          <div>
            <FieldLabel>식사</FieldLabel>
            <Segmented
              options={[
                { value: '아침', label: '아침' },
                { value: '점심', label: '점심' },
                { value: '저녁', label: '저녁' },
              ]}
              value={meal}
              onChange={setMeal}
              style={{ width: 220 }}
            />
          </div>
          <div>
            <FieldLabel>날짜</FieldLabel>
            <Field mono defaultValue="2025-03-12" style={{ height: 36, fontSize: 13, width: 150 }} />
          </div>

          <div style={{ flex: 1 }} />

          <div
            style={{
              padding: '8px 12px',
              borderRadius: 10,
              background: 'var(--accent-soft)',
              color: 'var(--accent-ink)',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            🟡 마지막 자동 업데이트 · 12분 전
          </div>
        </Card>

        {/* 상태 카드 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {stats.map((s) => (
            <Card key={s.l} style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 8, height: 38, borderRadius: 2, background: s.c }} />
              <div>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-3)' }}>{s.l}</p>
                <p className="mono" style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{s.v}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* 테이블 */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '60px 90px 1fr 90px 110px 110px 80px',
              padding: '12px 16px',
              background: 'var(--bg-3)',
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--ink-3)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            <span />
            <span>코너</span>
            <span>메뉴 구성</span>
            <span style={{ textAlign: 'right' }}>가격</span>
            <span style={{ textAlign: 'center' }}>판매</span>
            <span style={{ textAlign: 'center' }}>품절</span>
            <span style={{ textAlign: 'right' }}>편집</span>
          </div>

          {items.map((r) => (
            <div
              key={r.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 90px 1fr 90px 110px 110px 80px',
                alignItems: 'center',
                padding: '14px 16px',
                borderTop: '1px solid var(--line)',
                opacity: r.soldout ? 0.6 : 1,
                transition: 'opacity .15s ease',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'var(--bg-2)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                }}
              >
                🍱
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-2)' }}>{r.corner}</span>
              <span style={{ fontSize: 13, textDecoration: r.soldout ? 'line-through' : 'none' }}>{r.menu}</span>
              <span className="mono" style={{ textAlign: 'right', fontSize: 13, fontWeight: 600 }}>
                {r.price.toLocaleString()}
                <span style={{ fontSize: 10, color: 'var(--ink-4)' }}>원</span>
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>
                  {r.sold} / {r.qty}
                </span>
                <div
                  style={{
                    width: 80,
                    height: 4,
                    borderRadius: 999,
                    background: 'var(--bg-3)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${(r.sold / r.qty) * 100}%`,
                      height: '100%',
                      background:
                        r.sold / r.qty >= 1 ? 'oklch(0.62 0.16 18)' : 'var(--primary)',
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: r.soldout ? 'oklch(0.62 0.16 18)' : 'var(--ink-4)',
                  }}
                >
                  {r.soldout ? '품절' : '판매중'}
                </span>
                <Switch on={r.soldout} danger size="sm" onChange={() => toggle(r.id)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                <button
                  type="button"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: 'var(--card)',
                    border: '1px solid var(--line)',
                    fontSize: 12,
                  }}
                >
                  ✏️
                </button>
                <button
                  type="button"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: 'var(--card)',
                    border: '1px solid var(--line)',
                    fontSize: 12,
                  }}
                >
                  ⋯
                </button>
              </div>
            </div>
          ))}
        </Card>

        <p style={{ margin: '0 4px', fontSize: 11, color: 'var(--ink-4)' }}>
          💡 품절 토글은 즉시 학생 앱에 푸시됩니다. 변경 이력은 자동 기록됩니다.
        </p>
      </div>
    </>
  );
}
