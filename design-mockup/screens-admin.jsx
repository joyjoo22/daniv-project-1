// screens-admin.jsx — DANIV Admin (desktop wireframes)
// 어드민 페이지 — 학식 메뉴/품절 관리, 동아리 관리, 대시보드 개요

// ───────────────────────────────────────────────────────────
// AdminShell — sidebar + topbar layout
// ───────────────────────────────────────────────────────────
function AdminShell({ active = "dashboard", children }) {
  const nav = [
    { id: "dashboard", l: "대시보드", i: I.home(18) },
    { id: "cafeteria", l: "학식 메뉴", i: "🍱" },
    { id: "clubs", l: "동아리", i: I.trophy(16) },
    { id: "buildings", l: "건물 / 시설", i: I.pin(16) },
    { id: "reviews", l: "리뷰 신고함", i: I.bell(16) },
    { id: "rewards", l: "리워드", i: I.gift(16) },
    { id: "users", l: "사용자", i: I.user(16) },
  ];
  return (
    <div className="daniv" style={{
      display: "flex", height: "100%", background: "var(--bg-2)",
      fontFamily: "var(--font-kr)",
    }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: "var(--card)",
        borderRight: "1px solid var(--line)",
        display: "flex", flexDirection: "column",
        padding: "18px 12px",
      }}>
        <div style={{ padding: "0 8px 8px" }}>
          <Wordmark size={18} />
          <p className="mono" style={{ margin: "8px 0 0", fontSize: 9, color: "var(--ink-4)", letterSpacing: "0.1em" }}>
            ADMIN · v0.9.2
          </p>
        </div>

        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 2 }}>
          <p style={{
            margin: "0 8px 4px", fontSize: 10,
            color: "var(--ink-4)", letterSpacing: "0.08em",
            textTransform: "uppercase", fontWeight: 600,
          }}>관리</p>
          {nav.map(n => (
            <button key={n.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 10px", borderRadius: 10,
              background: active === n.id ? "var(--primary-soft)" : "transparent",
              color: active === n.id ? "var(--primary-ink)" : "var(--ink-2)",
              fontSize: 13, fontWeight: active === n.id ? 700 : 500,
              textAlign: "left",
            }}>
              <span style={{
                width: 22, height: 22, display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 13,
              }}>{n.i}</span>
              <span style={{ flex: 1 }}>{n.l}</span>
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* admin profile */}
        <div style={{
          padding: 10, borderRadius: 12,
          background: "var(--bg-2)", border: "1px solid var(--line)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "var(--ink)", color: "#fff",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700,
          }}>관</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>관리자</p>
            <p style={{ margin: 0, fontSize: 10, color: "var(--ink-4)" }}>학생복지팀</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: "auto", minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}

function AdminHeader({ title, sub, action }) {
  return (
    <div style={{
      padding: "20px 28px 18px",
      borderBottom: "1px solid var(--line)",
      background: "var(--bg-2)",
      display: "flex", alignItems: "center", gap: 16,
      position: "sticky", top: 0, zIndex: 4,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>{title}</h1>
        {sub && <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--ink-3)" }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// reusable toggle
function Switch({ on, danger }) {
  return (
    <div style={{
      width: 36, height: 22, borderRadius: 999, padding: 2,
      background: on ? (danger ? "oklch(0.65 0.18 18)" : "var(--primary)") : "var(--line-2)",
      display: "flex", alignItems: "center",
      transition: "background .15s ease",
      cursor: "pointer",
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: "50%", background: "#fff",
        transform: on ? "translateX(14px)" : "translateX(0)",
        transition: "transform .15s ease",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// 1. DASHBOARD
// ───────────────────────────────────────────────────────────
function AdminDashboard() {
  return (
    <AdminShell active="dashboard">
      <AdminHeader
        title="안녕하세요, 학생복지팀님 👋"
        sub="2025년 3월 12일 (수) · 오늘의 캠퍼스 현황"
        action={
          <button style={{
            height: 36, padding: "0 14px", borderRadius: 10,
            background: "var(--ink)", color: "var(--bg)", fontSize: 13, fontWeight: 600,
          }}>+ 공지 작성</button>
        }
      />

      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
        {/* stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {[
            { l: "활성 사용자 (DAU)", v: "1,284", d: "+8.2%", pos: true, k: "vs 어제" },
            { l: "오늘 작성 리뷰", v: "47", d: "+12", pos: true, k: "vs 어제" },
            { l: "리워드 교환", v: "23", d: "-3", pos: false, k: "vs 어제" },
            { l: "리뷰 신고", v: "2", d: "처리 필요", pos: false, k: "긴급", warn: true },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: 16 }}>
              <p style={{ margin: 0, fontSize: 11, color: "var(--ink-3)" }}>{s.l}</p>
              <p className="mono" style={{ margin: "6px 0 4px", fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em" }}>{s.v}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className={"tag " + (s.warn ? "tag-rose" : s.pos ? "tag-mint" : "tag-amber")}>{s.d}</span>
                <span style={{ fontSize: 10, color: "var(--ink-4)" }}>{s.k}</span>
              </div>
            </div>
          ))}
        </div>

        {/* main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>
          {/* chart */}
          <div className="card" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>주간 추이</p>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>일일 활성 사용자</p>
              </div>
              <div className="seg" style={{ width: 200 }}>
                <button data-active="true">7일</button>
                <button>30일</button>
                <button>학기</button>
              </div>
            </div>

            <FakeChart />
          </div>

          {/* hot items */}
          <div className="card" style={{ padding: 18 }}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>오늘의 핫 토픽</p>
            <p style={{ margin: "2px 0 14px", fontSize: 11, color: "var(--ink-4)" }}>리뷰·검색량 기준</p>

            {[
              { r: 1, n: "단풍식당", k: "검색 +124% · 리뷰 8건", c: "var(--primary)" },
              { r: 2, n: "학생회관 학식", k: "검색 +67% · '품절' 11건", c: "var(--accent)" },
              { r: 3, n: "사진동아리 한울", k: "조회 +52% · 가입 4건", c: "oklch(0.62 0.13 165)" },
              { r: 4, n: "STAFF COFFEE", k: "리뷰 +5건", c: "oklch(0.62 0.16 18)" },
            ].map(h => (
              <div key={h.r} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderTop: h.r > 1 ? "1px solid var(--line)" : "none" }}>
                <span className="mono" style={{
                  width: 22, height: 22, borderRadius: 6,
                  background: h.c, color: "#fff", fontSize: 11, fontWeight: 700,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>{h.r}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{h.n}</p>
                  <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>{h.k}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* alert + recent */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div className="card" style={{ padding: 18, borderColor: "oklch(0.85 0.08 18)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{
                width: 30, height: 30, borderRadius: 10, background: "oklch(0.94 0.04 18)",
                color: "oklch(0.42 0.14 18)", display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>{I.bell(16)}</span>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>처리 대기</p>
            </div>
            {[
              { t: "리뷰 신고 (명예훼손 의심)", k: "단풍식당 · 5분 전", action: "검토" },
              { t: "동아리 정보 수정 요청", k: "RUNRUN · 1시간 전", action: "확인" },
              { t: "학식 메뉴 업로드 누락", k: "공대식당 · 오늘 11시", action: "입력" },
            ].map((a, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
                borderTop: i ? "1px solid var(--line)" : "none",
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13 }}>{a.t}</p>
                  <p style={{ margin: 0, fontSize: 10, color: "var(--ink-4)" }}>{a.k}</p>
                </div>
                <button style={{
                  padding: "5px 12px", borderRadius: 8,
                  background: "var(--ink)", color: "var(--bg)", fontSize: 11, fontWeight: 600,
                }}>{a.action}</button>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 18 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, marginBottom: 14 }}>최근 활동</p>
            {[
              { u: "단풍이", a: "리뷰 작성", t: "단풍식당 · ★5", time: "2분 전" },
              { u: "준영", a: "스탬프 획득", t: "캠퍼스 라멘", time: "8분 전" },
              { u: "민지", a: "리워드 교환", t: "스타벅스 500p", time: "12분 전" },
              { u: "수아", a: "회원가입", t: "경영학과 25", time: "26분 전" },
            ].map((r, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
                borderTop: i ? "1px solid var(--line)" : "none",
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%", background: "var(--bg-2)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: "var(--ink-2)",
                }}>{r.u[0]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 12 }}>
                    <strong>{r.u}</strong> · {r.a}
                  </p>
                  <p style={{ margin: 0, fontSize: 10, color: "var(--ink-4)" }}>{r.t}</p>
                </div>
                <span className="mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>{r.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function FakeChart() {
  // Simple SVG line chart
  const pts = [62, 68, 81, 75, 92, 78, 96];
  const w = 480, h = 140, pad = 20;
  const max = 100;
  const xStep = (w - pad * 2) / (pts.length - 1);
  const toXY = (v, i) => [pad + i * xStep, h - pad - (v / max) * (h - pad * 2)];
  const line = pts.map((v, i) => `${i ? "L" : "M"}${toXY(v, i).join(",")}`).join(" ");
  const area = line + ` L ${pad + (pts.length - 1) * xStep},${h - pad} L ${pad},${h - pad} Z`;
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
        <defs>
          <linearGradient id="adm-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="oklch(0.42 0.18 270)" stopOpacity="0.25" />
            <stop offset="1" stopColor="oklch(0.42 0.18 270)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* grid */}
        {[0, 1, 2, 3].map(i => (
          <line key={i} x1={pad} x2={w - pad} y1={pad + i * 30} y2={pad + i * 30} stroke="var(--line)" strokeWidth="1" />
        ))}
        <path d={area} fill="url(#adm-grad)" />
        <path d={line} stroke="var(--primary)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((v, i) => {
          const [x, y] = toXY(v, i);
          return <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 5 : 3} fill={i === pts.length - 1 ? "var(--accent)" : "var(--primary)"} stroke="#fff" strokeWidth="1.5" />;
        })}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 20px", fontSize: 10, color: "var(--ink-4)" }} className="mono">
        {["3/6", "3/7", "3/8", "3/9", "3/10", "3/11", "3/12"].map(d => <span key={d}>{d}</span>)}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// 2. CAFETERIA — 학식 메뉴 / 품절 관리
// ───────────────────────────────────────────────────────────
function AdminCafeteria() {
  const [items, setItems] = React.useState([
    { id: 1, corner: "한식 A", menu: "제육볶음 · 시금치무침 · 미역국 · 김치", price: 5500, soldout: false, qty: 84, sold: 21 },
    { id: 2, corner: "한식 B", menu: "돈까스 · 단무지 · 양배추샐러드 · 미소국", price: 6000, soldout: true, qty: 60, sold: 60 },
    { id: 3, corner: "양식 C", menu: "스파게티 · 갈릭브레드 · 샐러드", price: 6500, soldout: false, qty: 50, sold: 12 },
    { id: 4, corner: "분식 D", menu: "라면 · 김밥 · 만두 · 단무지", price: 4500, soldout: false, qty: 100, sold: 38 },
    { id: 5, corner: "일품 E", menu: "비빔밥 · 된장국 · 김치", price: 5000, soldout: false, qty: 40, sold: 9 },
  ]);
  const toggle = (id) => setItems(s => s.map(r => r.id === id ? { ...r, soldout: !r.soldout } : r));

  return (
    <AdminShell active="cafeteria">
      <AdminHeader
        title="학식 메뉴 관리"
        sub="실시간 품절 토글 · 학생들 앱에 즉시 반영됩니다"
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{
              height: 36, padding: "0 14px", borderRadius: 10,
              background: "var(--card)", border: "1px solid var(--line)",
              fontSize: 13, fontWeight: 600,
            }}>CSV 가져오기</button>
            <button style={{
              height: 36, padding: "0 14px", borderRadius: 10,
              background: "var(--ink)", color: "var(--bg)", fontSize: 13, fontWeight: 600,
            }}>+ 메뉴 추가</button>
          </div>
        }
      />

      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* filter row */}
        <div className="card" style={{ padding: 14, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: "0 0 auto" }}>
            <p className="field-label" style={{ marginBottom: 4 }}>건물</p>
            <select className="field" style={{ height: 36, fontSize: 13, width: 180 }} defaultValue="학생회관">
              <option>학생회관</option>
              <option>공대식당</option>
              <option>인문관</option>
              <option>제2학생식당</option>
            </select>
          </div>
          <div style={{ flex: "0 0 auto" }}>
            <p className="field-label" style={{ marginBottom: 4 }}>식사</p>
            <div className="seg" style={{ width: 200 }}>
              <button>아침</button>
              <button data-active="true">점심</button>
              <button>저녁</button>
            </div>
          </div>
          <div style={{ flex: "0 0 auto" }}>
            <p className="field-label" style={{ marginBottom: 4 }}>날짜</p>
            <input className="field mono" style={{ height: 36, fontSize: 13, width: 150 }} defaultValue="2025-03-12" />
          </div>

          <div style={{ flex: 1 }} />

          <div style={{
            padding: "8px 12px", borderRadius: 10,
            background: "var(--accent-soft)", color: "var(--accent-ink)",
            fontSize: 11, fontWeight: 600, alignSelf: "flex-end",
          }}>
            🟡 마지막 자동 업데이트 · 12분 전
          </div>
        </div>

        {/* status row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {[
            { l: "전체 메뉴", v: items.length, c: "var(--ink)" },
            { l: "판매중", v: items.filter(i => !i.soldout).length, c: "oklch(0.55 0.13 165)" },
            { l: "품절", v: items.filter(i => i.soldout).length, c: "oklch(0.62 0.16 18)" },
            { l: "오늘 판매량", v: items.reduce((s, i) => s + i.sold, 0), c: "var(--primary)" },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 8, height: 38, borderRadius: 2, background: s.c }} />
              <div>
                <p style={{ margin: 0, fontSize: 11, color: "var(--ink-3)" }}>{s.l}</p>
                <p className="mono" style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{s.v}</p>
              </div>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "60px 90px 1fr 90px 110px 110px 80px",
            padding: "12px 16px", background: "var(--bg-3)",
            fontSize: 11, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}>
            <span></span><span>코너</span><span>메뉴 구성</span><span style={{ textAlign: "right" }}>가격</span><span style={{ textAlign: "center" }}>판매</span><span style={{ textAlign: "center" }}>품절</span><span style={{ textAlign: "right" }}>편집</span>
          </div>

          {items.map(r => (
            <div key={r.id} style={{
              display: "grid", gridTemplateColumns: "60px 90px 1fr 90px 110px 110px 80px",
              alignItems: "center", padding: "14px 16px",
              borderTop: "1px solid var(--line)",
              opacity: r.soldout ? 0.6 : 1,
              transition: "opacity .15s ease",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "var(--bg-2)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}>🍱</div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-2)" }}>{r.corner}</span>
              <span style={{
                fontSize: 13,
                textDecoration: r.soldout ? "line-through" : "none",
              }}>{r.menu}</span>
              <span className="mono" style={{ textAlign: "right", fontSize: 13, fontWeight: 600 }}>
                {r.price.toLocaleString()}<span style={{ fontSize: 10, color: "var(--ink-4)" }}>원</span>
              </span>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>{r.sold} / {r.qty}</span>
                <div style={{ width: 80, height: 4, borderRadius: 999, background: "var(--bg-3)", overflow: "hidden" }}>
                  <div style={{
                    width: `${(r.sold / r.qty) * 100}%`, height: "100%",
                    background: r.sold / r.qty >= 1 ? "oklch(0.62 0.16 18)" : "var(--primary)",
                  }} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: r.soldout ? "oklch(0.62 0.16 18)" : "var(--ink-4)" }}>
                  {r.soldout ? "품절" : "판매중"}
                </span>
                <div onClick={() => toggle(r.id)}>
                  <Switch on={r.soldout} danger />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 4 }}>
                <button style={iconBtnSm}>✏️</button>
                <button style={iconBtnSm}>⋯</button>
              </div>
            </div>
          ))}
        </div>

        <p style={{ margin: "0 4px", fontSize: 11, color: "var(--ink-4)" }}>
          💡 품절 토글은 즉시 학생 앱에 푸시됩니다. 변경 이력은 자동 기록됩니다.
        </p>
      </div>
    </AdminShell>
  );
}

const iconBtnSm = {
  width: 28, height: 28, borderRadius: 8,
  background: "var(--card)", border: "1px solid var(--line)",
  fontSize: 12,
  display: "inline-flex", alignItems: "center", justifyContent: "center",
};

// ───────────────────────────────────────────────────────────
// 3. CLUBS — 동아리 관리
// ───────────────────────────────────────────────────────────
function AdminClubs() {
  const [selected, setSelected] = React.useState(0);
  const clubs = [
    { id: 1, n: "사진동아리 한울", cat: "문화/예술", b: "학생회관 312", m: 48, status: "활성", recruit: true, awards: 3, last: "오늘" },
    { id: 2, n: "RUNRUN", cat: "체육", b: "체육관 102", m: 31, status: "활성", recruit: true, awards: 1, last: "3일 전" },
    { id: 3, n: "코드웍스", cat: "학술", b: "IT관 411", m: 62, status: "활성", recruit: true, awards: 5, last: "어제" },
    { id: 4, n: "푸드챌린저", cat: "취미", b: "학생회관 218", m: 19, status: "검토중", recruit: false, awards: 0, last: "7일 전" },
    { id: 5, n: "단대 합창단", cat: "문화/예술", b: "음대관 105", m: 24, status: "활성", recruit: false, awards: 2, last: "12일 전" },
    { id: 6, n: "사회봉사회", cat: "봉사", b: "사회과학관 B1", m: 41, status: "활성", recruit: true, awards: 4, last: "2일 전" },
    { id: 7, n: "보드게임", cat: "취미", b: "학생회관 215", m: 27, status: "비활성", recruit: false, awards: 0, last: "62일 전" },
  ];
  const sel = clubs[selected];

  return (
    <AdminShell active="clubs">
      <AdminHeader
        title="동아리 관리"
        sub={`총 ${clubs.length}개 등록 · 모집중 ${clubs.filter(c => c.recruit).length}개`}
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <input className="field" placeholder="동아리 검색…" style={{ height: 36, fontSize: 13, width: 200 }} />
            <button style={{
              height: 36, padding: "0 14px", borderRadius: 10,
              background: "var(--ink)", color: "var(--bg)", fontSize: 13, fontWeight: 600,
            }}>+ 동아리 등록</button>
          </div>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 0, minHeight: 0 }}>
        {/* LIST */}
        <div style={{ padding: "20px 16px 20px 24px", borderRight: "1px solid var(--line)" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 12, overflowX: "auto" }}>
            {["전체", "문화/예술", "체육", "학술", "봉사", "취미", "검토중"].map((f, i) => (
              <div key={i} className="chip" data-active={i === 0}>{f}</div>
            ))}
          </div>

          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "1.5fr 90px 60px 80px 80px",
              padding: "10px 14px", background: "var(--bg-3)",
              fontSize: 10, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.04em", textTransform: "uppercase",
            }}>
              <span>동아리</span><span>위치</span><span style={{textAlign:"right"}}>회원</span><span style={{textAlign:"center"}}>모집</span><span style={{textAlign:"right"}}>상태</span>
            </div>
            {clubs.map((c, i) => (
              <button key={c.id} onClick={() => setSelected(i)} style={{
                display: "grid", gridTemplateColumns: "1.5fr 90px 60px 80px 80px",
                alignItems: "center", padding: "12px 14px",
                borderTop: "1px solid var(--line)",
                background: selected === i ? "var(--primary-soft)" : "transparent",
                width: "100%", textAlign: "left", cursor: "pointer",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 9,
                    background: ["var(--primary)", "oklch(0.62 0.16 18)", "oklch(0.62 0.13 165)", "var(--accent)", "oklch(0.58 0.16 235)", "oklch(0.62 0.14 60)", "oklch(0.5 0.05 270)"][i % 7],
                    color: "#fff", fontSize: 12, fontWeight: 800,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                  }}>{c.n[0]}</div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.n}</p>
                    <p style={{ margin: 0, fontSize: 10, color: "var(--ink-4)" }}>{c.cat} · 수정 {c.last}</p>
                  </div>
                </div>
                <span style={{ fontSize: 11, color: "var(--ink-3)" }}>{c.b}</span>
                <span className="mono" style={{ fontSize: 12, fontWeight: 600, textAlign: "right" }}>{c.m}</span>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Switch on={c.recruit} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <span className={"tag " + (c.status === "활성" ? "tag-mint" : c.status === "검토중" ? "tag-amber" : "tag-rose")}>{c.status}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* DETAIL PANEL */}
        <div style={{ padding: "20px 24px 20px 16px", background: "var(--bg-2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: "var(--ink)", color: "#fff",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 800, letterSpacing: "-0.04em",
            }}>{sel.n[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>{sel.cat} · 중앙동아리</p>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{sel.n}</p>
            </div>
            <button style={{
              height: 32, padding: "0 12px", borderRadius: 9,
              background: "var(--card)", border: "1px solid var(--line)",
              fontSize: 12, fontWeight: 600,
            }}>앱에서 미리보기 ↗</button>
          </div>

          <div className="card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "var(--ink-3)", letterSpacing: 0 }}>기본 정보</p>

            <div>
              <label className="field-label">동아리명</label>
              <input className="field" style={{ height: 40 }} defaultValue={sel.n} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label className="field-label">카테고리</label>
                <select className="field" style={{ height: 40 }} defaultValue={sel.cat}>
                  <option>문화/예술</option><option>체육</option><option>학술</option>
                  <option>봉사</option><option>취미</option>
                </select>
              </div>
              <div>
                <label className="field-label">위치 (건물 · 호실)</label>
                <input className="field" style={{ height: 40 }} defaultValue={sel.b} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <div>
                <label className="field-label">회장</label>
                <input className="field" style={{ height: 40 }} defaultValue="이서연 · 24" />
              </div>
              <div>
                <label className="field-label">정기 모임</label>
                <input className="field" style={{ height: 40 }} defaultValue="매주 화 18:00" />
              </div>
              <div>
                <label className="field-label">학기 회비</label>
                <input className="field mono" style={{ height: 40 }} defaultValue="30000" />
              </div>
            </div>

            <div>
              <label className="field-label">소개</label>
              <textarea
                style={{
                  width: "100%", minHeight: 76, padding: 12, fontSize: 13,
                  borderRadius: 12, border: "1px solid var(--line)", background: "var(--card)",
                  resize: "vertical", lineHeight: 1.55,
                }}
                defaultValue="한울은 단국대학교 죽전캠퍼스의 사진 중앙동아리예요. 매학기 정기 출사와 작품전을 진행합니다."
              />
            </div>

            <div>
              <label className="field-label">Instagram</label>
              <div style={{ display: "flex", gap: 0 }}>
                <span style={{
                  height: 40, padding: "0 12px", display: "inline-flex", alignItems: "center",
                  background: "var(--bg-3)", border: "1px solid var(--line)", borderRight: "none",
                  borderRadius: "12px 0 0 12px", fontSize: 13, color: "var(--ink-3)",
                }}>@</span>
                <input className="field" style={{ height: 40, borderRadius: "0 12px 12px 0" }} defaultValue="dku_hanwool" />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--line)", marginTop: 4 }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>모집 활성화</p>
                <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>학생 앱에 "모집중" 배너 노출</p>
              </div>
              <Switch on={sel.recruit} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>공식 인증</p>
                <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>학생복지팀 검증 완료 표시</p>
              </div>
              <Switch on={sel.status === "활성"} />
            </div>
          </div>

          <div className="card" style={{ marginTop: 12, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "var(--ink-3)" }}>수상 내역 ({sel.awards})</p>
              <button style={{ fontSize: 12, color: "var(--primary-ink)", fontWeight: 600 }}>+ 추가</button>
            </div>
            {[
              { y: "2024", t: "전국 대학사진 공모전 금상" },
              { y: "2023", t: "단국대 동아리 페스타 대상" },
              { y: "2022", t: "교내 학술대회 우수상" },
            ].slice(0, sel.awards).map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: i ? "1px solid var(--line)" : "none" }}>
                <span className="mono" style={{ fontSize: 11, color: "var(--ink-4)", width: 36 }}>{a.y}</span>
                <span style={{ flex: 1, fontSize: 13 }}>{a.t}</span>
                <button style={iconBtnSm}>✕</button>
              </div>
            ))}
            {sel.awards === 0 && (
              <p style={{ margin: 0, padding: 14, fontSize: 12, color: "var(--ink-4)", textAlign: "center", background: "var(--bg-3)", borderRadius: 10 }}>
                등록된 수상 내역이 없습니다
              </p>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button style={{
              flex: 1, height: 44, borderRadius: 12,
              background: "var(--card)", border: "1px solid var(--line)",
              fontSize: 13, fontWeight: 600,
            }}>변경 취소</button>
            <button style={{
              flex: 2, height: 44, borderRadius: 12,
              background: "var(--ink)", color: "var(--bg)",
              fontSize: 13, fontWeight: 700,
            }}>저장 · 앱에 반영</button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

Object.assign(window, { AdminShell, AdminDashboard, AdminCafeteria, AdminClubs });

// ───────────────────────────────────────────────────────────
// 4. MOBILE ADMIN — 식당 사장님용 간소화 토글 뷰
//    (글랜저블, 큰 탭 타겟, 한 손 사용 최적화)
// ───────────────────────────────────────────────────────────
function MobileVendorAdmin() {
  const [items, setItems] = React.useState([
    { id: 1, c: "한식 A", m: "제육볶음 정식", p: 5500, q: 84, s: 21, soldout: false },
    { id: 2, c: "한식 B", m: "돈까스 정식", p: 6000, q: 60, s: 60, soldout: true },
    { id: 3, c: "양식 C", m: "스파게티", p: 6500, q: 50, s: 12, soldout: false },
    { id: 4, c: "분식 D", m: "라면 · 김밥 세트", p: 4500, q: 100, s: 38, soldout: false },
    { id: 5, c: "일품 E", m: "비빔밥", p: 5000, q: 40, s: 9, soldout: false },
  ]);
  const toggle = (id) => setItems(s => s.map(r => r.id === id ? { ...r, soldout: !r.soldout } : r));
  const soldoutN = items.filter(i => i.soldout).length;
  const totalSold = items.reduce((s, i) => s + i.s, 0);
  const totalQty = items.reduce((s, i) => s + i.q, 0);
  const pct = Math.round((totalSold / totalQty) * 100);

  return (
    <Phone>
      {/* vendor topbar */}
      <div style={{
        padding: "8px 16px 12px",
        background: "var(--card)",
        borderBottom: "1px solid var(--line)",
        display: "flex", alignItems: "center", gap: 12,
        flexShrink: 0,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "var(--ink)", color: "#fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 800,
        }}>학</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>학생회관 1F</p>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, letterSpacing: "-0.02em" }}>학생식당 사장님 모드</p>
        </div>
        <div style={{
          padding: "5px 10px", borderRadius: 999,
          background: "oklch(0.94 0.04 165)", color: "oklch(0.42 0.12 165)",
          fontSize: 10, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "oklch(0.62 0.13 165)", animation: "daniv-pulse 1.6s ease-out infinite" }} />
          실시간
        </div>
      </div>

      {/* progress hero */}
      <div style={{ padding: "14px 16px 0", flexShrink: 0 }}>
        <div style={{
          background: "var(--hero-bg)", color: "var(--hero-fg)",
          borderRadius: 20, padding: 16,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", right: -30, top: -30, width: 140, height: 140,
            borderRadius: "50%", background: "var(--accent)", opacity: 0.3, filter: "blur(20px)",
          }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 11, opacity: 0.7 }}>오늘 점심 · 11:30 — 14:00</span>
              <span className="mono" style={{ fontSize: 11, opacity: 0.7 }}>03/12 (수)</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
              <p className="mono" style={{ margin: 0, fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em" }}>{pct}%</p>
              <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>{totalSold} / {totalQty}식 판매</p>
            </div>
            <div style={{ height: 6, borderRadius: 999, background: "rgba(255,255,255,0.16)", overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: "var(--accent)", borderRadius: 999 }} />
            </div>
          </div>
        </div>
      </div>

      {/* big SOLD OUT ALL button (panic mode) */}
      <div style={{ padding: "12px 16px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{
            flex: 1, height: 44, borderRadius: 14,
            background: "var(--card)", border: "1px solid var(--line)",
            fontSize: 13, fontWeight: 600,
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>📣 공지 푸시</button>
          <button style={{
            flex: 1, height: 44, borderRadius: 14,
            background: "oklch(0.94 0.04 18)", color: "oklch(0.42 0.14 18)",
            fontSize: 13, fontWeight: 700,
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>전체 품절</button>
        </div>
      </div>

      <div className="scroll" style={{ padding: "14px 16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>오늘의 메뉴</p>
          <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>
            <span className="mono" style={{ color: "oklch(0.62 0.16 18)", fontWeight: 700 }}>{soldoutN}</span> / {items.length} 품절
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map(r => {
            const remain = r.q - r.s;
            return (
              <button key={r.id} onClick={() => toggle(r.id)} style={{
                background: "var(--card)", borderRadius: 18,
                border: "1px solid " + (r.soldout ? "oklch(0.85 0.08 18)" : "var(--line)"),
                padding: 14, textAlign: "left", width: "100%",
                opacity: r.soldout ? 0.7 : 1,
                transition: "all .15s ease",
                position: "relative", overflow: "hidden",
              }}>
                {r.soldout && (
                  <div style={{
                    position: "absolute", top: 0, right: 0,
                    padding: "4px 10px", borderRadius: "0 16px 0 12px",
                    background: "oklch(0.62 0.16 18)", color: "#fff",
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
                  }}>SOLD OUT</div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: "var(--bg-2)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24, flexShrink: 0,
                  }}>🍱</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span className="tag tag-indigo">{r.c}</span>
                      <span className="mono" style={{ fontSize: 11, fontWeight: 600 }}>{r.p.toLocaleString()}원</span>
                    </div>
                    <p style={{
                      margin: "4px 0 0", fontSize: 14, fontWeight: 600,
                      textDecoration: r.soldout ? "line-through" : "none",
                    }}>{r.m}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                      <div style={{ flex: 1, height: 4, borderRadius: 999, background: "var(--bg-3)", overflow: "hidden" }}>
                        <div style={{
                          width: `${(r.s / r.q) * 100}%`, height: "100%",
                          background: r.soldout ? "oklch(0.62 0.16 18)" : "var(--primary)",
                        }} />
                      </div>
                      <span className="mono" style={{ fontSize: 10, color: "var(--ink-4)", minWidth: 64, textAlign: "right" }}>
                        남은 {remain}식
                      </span>
                    </div>
                  </div>
                  {/* big toggle */}
                  <div style={{
                    width: 52, height: 30, borderRadius: 999, padding: 3,
                    background: r.soldout ? "oklch(0.62 0.16 18)" : "var(--line-2)",
                    display: "flex", alignItems: "center", flexShrink: 0,
                  }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%", background: "#fff",
                      transform: r.soldout ? "translateX(22px)" : "translateX(0)",
                      transition: "transform .15s ease",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {r.soldout && <span style={{ fontSize: 12 }}>✕</span>}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <p style={{ margin: "16px 4px 0", fontSize: 11, color: "var(--ink-4)", textAlign: "center", lineHeight: 1.5 }}>
          품절 토글은 즉시 학생 앱에 반영됩니다.<br />
          마지막 동기화 · 방금 전
        </p>
      </div>

      {/* sticky footer — close meal */}
      <div style={{
        padding: "10px 16px 20px",
        background: "var(--card)",
        borderTop: "1px solid var(--line)",
        flexShrink: 0,
      }}>
        <button className="btn-primary" style={{ height: 48 }}>점심 영업 마감</button>
      </div>
    </Phone>
  );
}

Object.assign(window, { MobileVendorAdmin });

