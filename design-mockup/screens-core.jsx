// screens-core.jsx — Home, Map, Timetable

// ──────────────────────────────────────────────────────────────
// HOME
// ──────────────────────────────────────────────────────────────
function HomeScreen({ dark = false }) {
  const [tab, setTab] = React.useState("home");
  return (
    <Phone dark={dark}>
      {/* greeting header */}
      <div style={{ padding: "8px 20px 4px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: "var(--ink-3)" }}>안녕 단풍이님 👋</p>
          <p style={{ margin: 0, fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em" }}>오늘도 화이팅!</p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button style={iconBtn}>{I.search(18)}</button>
          <button style={{ ...iconBtn, position: "relative" }}>
            {I.bell(18)}
            <span style={{
              position: "absolute", top: 6, right: 6, width: 8, height: 8,
              borderRadius: 999, background: "var(--accent)", border: "2px solid var(--card)",
            }} />
          </button>
        </div>
      </div>

      <div className="scroll" style={{ padding: "12px 16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* NEXT CLASS — hero card */}
        <div style={{
          background: "var(--hero-bg)", color: "var(--hero-fg)",
          borderRadius: 24, padding: 18,
          boxShadow: "var(--sh-2)", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -30, right: -20, width: 160, height: 160,
            borderRadius: "50%", background: "var(--primary)", opacity: 0.6, filter: "blur(20px)",
          }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span className="tag tag-amber" style={{ background: "var(--accent)", color: "#3a1d00" }}>다음 수업 · 18분 후</span>
              <span className="mono" style={{ fontSize: 11, opacity: 0.7 }}>10:30 — 11:45</span>
            </div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>자료구조와 알고리즘</h2>
            <p style={{ margin: "4px 0 14px", fontSize: 13, opacity: 0.7 }}>김교수 · 전공 3학점</p>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                padding: "8px 12px", borderRadius: 14,
                background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", gap: 6, fontSize: 12,
              }}>{I.pin(14)} 죽전 IT관 403호</div>
              <div style={{
                padding: "8px 12px", borderRadius: 14,
                background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 6, fontSize: 12,
              }}>{I.walk(14)} 7분</div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {[
            { i: I.cal(20), l: "시간표", c: "var(--primary-soft)", k: "var(--primary-ink)" },
            { i: I.stamp(20), l: "스탬프", c: "var(--accent-soft)", k: "var(--accent-ink)" },
            { i: I.heart(20), l: "맛집", c: "oklch(0.94 0.04 18)", k: "oklch(0.42 0.14 18)" },
            { i: I.trophy(20), l: "동아리", c: "oklch(0.94 0.04 165)", k: "oklch(0.42 0.12 165)" },
          ].map((q, i) => (
            <button key={i} style={{
              background: "var(--card)", borderRadius: 18,
              padding: "14px 8px", border: "1px solid var(--line)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            }}>
              <span style={{
                width: 38, height: 38, borderRadius: 12,
                background: q.c, color: q.k,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>{q.i}</span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{q.l}</span>
            </button>
          ))}
        </div>

        {/* MAP PREVIEW */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.04em" }}>오늘의 동선</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>IT관 → 학생회관 → 도서관</p>
            </div>
            <button style={{ fontSize: 12, color: "var(--primary-ink)", fontWeight: 600 }}>전체보기 ›</button>
          </div>
          <CampusMap height={150} pins={[
            { x: 25, y: 24, label: "지금", color: "var(--accent)" },
            { x: 67, y: 70, label: "IT관", color: "var(--primary)" },
          ]} />
        </div>

        {/* WEATHER + TRANSIT row */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 10 }}>
          <div className="card" style={{ padding: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>죽전캠퍼스</p>
                <p style={{ margin: "2px 0 0", fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>
                  17<span style={{ fontSize: 14, color: "var(--ink-3)" }}>°C</span>
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--ink-3)" }}>흐림 · 강수 20%</p>
              </div>
              <span style={{ color: "var(--ink-3)" }}>{I.cloud(28)}</span>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              {[
                ["12시", "18°"], ["15시", "19°"], ["18시", "16°"], ["21시", "14°"],
              ].map(([t, deg], i) => (
                <div key={i} style={{ flex: 1, textAlign: "center" }}>
                  <p className="mono" style={{ margin: 0, fontSize: 9, color: "var(--ink-4)" }}>{t}</p>
                  <p className="mono" style={{ margin: "2px 0 0", fontSize: 11, fontWeight: 600 }}>{deg}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                width: 28, height: 28, borderRadius: 8,
                background: "oklch(0.94 0.05 235)", color: "oklch(0.42 0.16 235)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>{I.bus(16)}</span>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>24번</p>
                <p style={{ margin: 0, fontSize: 10, color: "var(--ink-4)" }}>죽전역 → 단국대</p>
              </div>
            </div>
            <div className="mono" style={{
              fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em",
              color: "var(--primary-ink)",
            }}>
              3<span style={{ fontSize: 11, color: "var(--ink-3)" }}>분</span>
              <span style={{ fontSize: 13, color: "var(--ink-4)", marginLeft: 8 }}>· 11분</span>
            </div>
          </div>
        </div>

        {/* TODAY'S CAFETERIA */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.04em" }}>오늘의 학식 · 학생회관</p>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>점심 메뉴</p>
            </div>
            <span className="tag tag-mint">영업중</span>
          </div>
          {[
            { c: "한식 A", m: "제육볶음 · 시금치무침 · 미역국", p: "5,500", soldout: false },
            { c: "한식 B", m: "돈까스 · 단무지 · 양배추샐러드", p: "6,000", soldout: true },
            { c: "분식 C", m: "라면 · 김밥 · 만두 (2pc)", p: "4,500", soldout: false },
          ].map((r, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 0",
              borderTop: i ? "1px solid var(--line)" : "none",
              opacity: r.soldout ? 0.5 : 1,
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", width: 40 }}>{r.c}</span>
              <span style={{ flex: 1, fontSize: 13, textDecoration: r.soldout ? "line-through" : "none" }}>{r.m}</span>
              {r.soldout ? <span className="tag tag-rose">품절</span> :
                <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>{r.p}원</span>}
            </div>
          ))}
        </div>

        <div style={{ height: 4 }} />
      </div>

      <TabBar active={tab} onChange={setTab} />
    </Phone>
  );
}

const iconBtn = {
  width: 38, height: 38, borderRadius: 12,
  background: "var(--card)", border: "1px solid var(--line)",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  color: "var(--ink-2)",
};

// ──────────────────────────────────────────────────────────────
// MAP (full screen)
// ──────────────────────────────────────────────────────────────
function MapScreen({ dark = false }) {
  const [tab, setTab] = React.useState("map");
  return (
    <Phone dark={dark}>
      {/* search overlay */}
      <div style={{ position: "absolute", top: 60, left: 16, right: 16, zIndex: 5 }}>
        <div style={{
          height: 48, borderRadius: 16, background: "var(--card)",
          boxShadow: "var(--sh-2)", display: "flex", alignItems: "center", padding: "0 14px", gap: 10,
        }}>
          <span style={{ color: "var(--ink-3)" }}>{I.search(18)}</span>
          <span style={{ flex: 1, fontSize: 14, color: "var(--ink-4)" }}>건물, 음식점, 동아리방 검색</span>
          <span style={{
            width: 28, height: 28, borderRadius: 8,
            background: "var(--primary-soft)", color: "var(--primary-ink)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>{I.qr(16)}</span>
        </div>

        {/* filter row */}
        <div style={{ display: "flex", gap: 6, marginTop: 10, overflowX: "auto" }}>
          {[
            ["전체", true], ["내 동선", false], ["학식", false], ["카페", false], ["편의점", false], ["동아리방", false],
          ].map(([l, on], i) => (
            <div key={i} className="chip" data-active={on} style={{ background: on ? undefined : "var(--card)" }}>{l}</div>
          ))}
        </div>
      </div>

      {/* full map */}
      <div style={{ flex: 1, position: "relative" }}>
        <CampusMap height="100%" pins={[
          { x: 25, y: 22, label: "지금", color: "var(--accent)" },
          { x: 70, y: 28, label: "도서관", color: "var(--ink)" },
          { x: 35, y: 60, label: "학생회관", color: "var(--primary)" },
          { x: 65, y: 70, label: "IT관 · 다음 수업", color: "var(--primary)" },
          { x: 86, y: 82, label: "스탬프 3", color: "var(--accent)" },
        ]} />

        {/* recenter / layers */}
        <div style={{ position: "absolute", right: 16, bottom: 220, display: "flex", flexDirection: "column", gap: 8 }}>
          <button style={fab}>{I.pin(18)}</button>
          <button style={fab}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><path d="M12 3l9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5M3 18l9 5 9-5"/></svg>
          </button>
        </div>
      </div>

      {/* bottom sheet — next step */}
      <div style={{
        background: "var(--card)", borderRadius: "24px 24px 0 0",
        padding: "12px 18px 14px", boxShadow: "0 -8px 24px rgba(20,16,40,0.08)",
        flexShrink: 0, position: "relative", zIndex: 3,
      }}>
        <div style={{
          width: 36, height: 4, borderRadius: 999, background: "var(--line-2)",
          margin: "0 auto 12px",
        }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: "var(--primary)", color: "#fff",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>{I.walk(22)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>다음 강의까지</p>
            <p style={{ margin: "2px 0 0", fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em" }}>
              IT관 403호 · <span style={{ color: "var(--primary-ink)" }}>도보 7분</span>
            </p>
          </div>
          <button style={{
            padding: "8px 14px", borderRadius: 12,
            background: "var(--ink)", color: "#fff", fontSize: 13, fontWeight: 600,
          }}>안내 시작</button>
        </div>
      </div>

      <TabBar active={tab} onChange={setTab} />
    </Phone>
  );
}

const fab = {
  width: 44, height: 44, borderRadius: 14,
  background: "var(--card)", color: "var(--ink-2)",
  boxShadow: "var(--sh-2)",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
};

// ──────────────────────────────────────────────────────────────
// TIMETABLE
// ──────────────────────────────────────────────────────────────
function TimetableScreen({ dark = false }) {
  // 30min rows × 5 days
  const days = ["월", "화", "수", "목", "금"];
  const classes = [
    { d: 0, start: 9, end: 10.5, name: "자료구조", room: "IT관 403", color: "var(--primary)", next: false },
    { d: 0, start: 13, end: 14.5, name: "교양 영어", room: "사회과학관 201", color: "oklch(0.74 0.16 55)", next: false },
    { d: 1, start: 10.5, end: 12, name: "선형대수", room: "공학관 305", color: "oklch(0.62 0.16 18)", next: false },
    { d: 1, start: 14.5, end: 16, name: "확률통계", room: "IT관 502", color: "var(--primary)", next: false },
    { d: 2, start: 9, end: 10.5, name: "자료구조", room: "IT관 403", color: "var(--primary)", next: true },
    { d: 2, start: 13, end: 15, name: "체육", room: "체육관", color: "oklch(0.62 0.13 165)", next: false },
    { d: 3, start: 10.5, end: 12, name: "선형대수", room: "공학관 305", color: "oklch(0.62 0.16 18)", next: false },
    { d: 4, start: 9, end: 10.5, name: "자료구조", room: "IT관 403", color: "var(--primary)", next: false },
    { d: 4, start: 13, end: 14.5, name: "교양 영어", room: "사회과학관 201", color: "oklch(0.74 0.16 55)", next: false },
  ];
  const hourStart = 9; const hourEnd = 17;
  const rowH = 38; // px per hour
  return (
    <Phone dark={dark}>
      <TopBar title="시간표" dark={dark} action={
        <button style={iconBtn}>{I.plus(18)}</button>
      } />

      <div className="scroll" style={{ padding: "0 16px 20px" }}>
        {/* week summary chip row */}
        <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto" }}>
          <div className="chip" data-active="true">이번 주</div>
          <div className="chip">2025-1학기</div>
          <div className="chip">시간표 공유</div>
        </div>

        {/* legend */}
        <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--ink-3)", marginBottom: 10 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--primary)" }} /> 전공
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: "oklch(0.74 0.16 55)" }} /> 교양
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: "oklch(0.62 0.13 165)" }} /> 체육
          </span>
        </div>

        {/* grid */}
        <div className="card" style={{ padding: 12, overflow: "hidden" }}>
          {/* header */}
          <div style={{ display: "grid", gridTemplateColumns: "28px repeat(5, 1fr)", gap: 4, marginBottom: 6 }}>
            <span />
            {days.map((d, i) => (
              <div key={i} style={{
                textAlign: "center", fontSize: 11, fontWeight: 700,
                color: i === 2 ? "var(--primary-ink)" : "var(--ink-3)",
              }}>
                <p style={{ margin: 0 }}>{d}</p>
                <p className="mono" style={{ margin: 0, fontSize: 14, color: i === 2 ? "var(--primary-ink)" : "var(--ink)" }}>
                  {17 + i}
                </p>
              </div>
            ))}
          </div>

          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "28px repeat(5, 1fr)", gap: 4 }}>
            {/* hour labels + lanes */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {Array.from({ length: hourEnd - hourStart }).map((_, i) => (
                <div key={i} style={{ height: rowH, fontSize: 9, color: "var(--ink-4)", paddingTop: 2 }} className="mono">
                  {hourStart + i}
                </div>
              ))}
            </div>
            {days.map((_, di) => (
              <div key={di} style={{
                position: "relative", height: (hourEnd - hourStart) * rowH,
                background: di === 2 ? "oklch(0.97 0.015 270)" : "transparent",
                borderRadius: 8, border: "1px solid var(--line)",
              }}>
                {/* hour rules */}
                {Array.from({ length: hourEnd - hourStart - 1 }).map((_, i) => (
                  <div key={i} style={{
                    position: "absolute", left: 0, right: 0,
                    top: (i + 1) * rowH,
                    height: 1, background: "var(--line)", opacity: 0.6,
                  }} />
                ))}
                {classes.filter(c => c.d === di).map((c, i) => {
                  const top = (c.start - hourStart) * rowH;
                  const h = (c.end - c.start) * rowH;
                  return (
                    <div key={i} style={{
                      position: "absolute", top: top + 2, left: 2, right: 2,
                      height: h - 4, borderRadius: 8,
                      background: c.color, color: "#fff",
                      padding: "6px 6px", overflow: "hidden",
                      boxShadow: c.next ? "0 0 0 2px var(--accent), 0 4px 10px rgba(0,0,0,0.18)" : "none",
                    }}>
                      <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15 }}>{c.name}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 8, opacity: 0.85, lineHeight: 1.15 }}>{c.room}</p>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* this week summary */}
        <div className="card" style={{ marginTop: 14, padding: 14 }}>
          <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>이번 주 요약</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 8 }}>
            <Stat n="9" l="총 강의" />
            <Stat n="18h" l="수업 시간" />
            <Stat n="3" l="공강일" />
          </div>
        </div>
      </div>
    </Phone>
  );
}

function Stat({ n, l }) {
  return (
    <div>
      <p className="mono" style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>{n}</p>
      <p style={{ margin: 0, fontSize: 11, color: "var(--ink-3)" }}>{l}</p>
    </div>
  );
}

Object.assign(window, { HomeScreen, MapScreen, TimetableScreen });
