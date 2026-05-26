// screens-content.jsx — Restaurants, Stamps, Building, Club, MyPage

// ──────────────────────────────────────────────────────────────
// RESTAURANT LIST
// ──────────────────────────────────────────────────────────────
function RestaurantListScreen() {
  const [filter, setFilter] = React.useState("전체");
  const [tab, setTab] = React.useState("food");
  const filters = ["전체", "한식", "분식", "일식", "중식", "카페", "치킨/맥주"];
  const places = [
    { n: "단풍식당", c: "한식 · 김치찌개", r: 4.6, rc: 128, d: "도보 3분", p: "₩₩", stamp: true, hot: true, img: "한식" },
    { n: "캠퍼스 라멘", c: "일식 · 돈코츠", r: 4.4, rc: 87, d: "도보 5분", p: "₩₩", stamp: true, hot: false, img: "일식" },
    { n: "정문 김밥천국", c: "분식", r: 4.1, rc: 210, d: "도보 1분", p: "₩", stamp: false, hot: false, img: "분식" },
    { n: "STAFF COFFEE", c: "카페 · 핸드드립", r: 4.7, rc: 64, d: "도보 4분", p: "₩₩", stamp: true, hot: false, img: "카페" },
    { n: "후문 닭갈비", c: "한식 · 회식", r: 4.2, rc: 156, d: "도보 8분", p: "₩₩₩", stamp: true, hot: false, img: "한식" },
  ];
  const visible = filter === "전체" ? places : places.filter(p => p.c.startsWith(filter));

  return (
    <Phone>
      <TopBar title="맛집" action={
        <button style={{
          width: 36, height: 36, borderRadius: 12,
          background: "var(--card)", border: "1px solid var(--line)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>{I.search(18)}</button>
      } />

      <div style={{ padding: "0 16px 8px", display: "flex", gap: 6, overflowX: "auto", flexShrink: 0 }}>
        {filters.map(f => (
          <button key={f} className="chip" data-active={filter === f}
            onClick={() => setFilter(f)}
            style={filter === f ? {} : { background: "var(--card)" }}>{f}</button>
        ))}
      </div>

      {/* sort */}
      <div style={{ padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: "var(--ink-3)" }}>{visible.length}개 장소</span>
        <button style={{ fontSize: 12, color: "var(--ink-2)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
          거리순
          <svg width="10" height="10" viewBox="0 0 12 12"><path d="m2 4 4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg>
        </button>
      </div>

      <div className="scroll" style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {visible.map((p, i) => (
          <div key={i} className="card" style={{ padding: 12, display: "flex", gap: 12, alignItems: "stretch" }}>
            <div className="ph" style={{
              width: 78, height: 78, borderRadius: 14, flexShrink: 0,
            }}>{p.img}</div>
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em" }}>{p.n}</p>
                  {p.hot && <span className="tag tag-rose">🔥 HOT</span>}
                </div>
                <p style={{ margin: 0, fontSize: 12, color: "var(--ink-3)" }}>{p.c} · {p.p} · {p.d}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Stars value={p.r} size={12} />
                  <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>{p.r}</span>
                  <span style={{ fontSize: 11, color: "var(--ink-4)" }}>({p.rc})</span>
                </div>
                {p.stamp && (
                  <span className="tag tag-indigo" style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                    {I.stamp(11)} 스탬프
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <TabBar active={tab} onChange={setTab} />
    </Phone>
  );
}

// ──────────────────────────────────────────────────────────────
// RESTAURANT DETAIL
// ──────────────────────────────────────────────────────────────
function RestaurantDetailScreen() {
  return (
    <Phone>
      <div className="scroll" style={{ paddingBottom: 88 }}>
        {/* hero image */}
        <div className="ph" style={{ height: 240, borderRadius: 0, fontSize: 12 }}>
          단풍식당 대표 이미지
          <div style={{
            position: "absolute", top: 14, left: 14,
            display: "flex", gap: 8,
          }}>
            <button style={{ ...heroBtn }}>{I.chevL(20)}</button>
          </div>
          <div style={{
            position: "absolute", top: 14, right: 14,
            display: "flex", gap: 8,
          }}>
            <button style={heroBtn}>{I.heart(18)}</button>
            <button style={heroBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m9 11 6-4M9 13l6 4"/></svg>
            </button>
          </div>
          {/* photo strip indicators */}
          <div style={{
            position: "absolute", bottom: 14, left: 0, right: 0,
            display: "flex", gap: 4, justifyContent: "center",
          }}>
            {[0,1,2,3].map(i => (
              <span key={i} style={{
                width: i === 0 ? 18 : 5, height: 5, borderRadius: 999,
                background: i === 0 ? "#fff" : "rgba(255,255,255,0.5)",
              }} />
            ))}
          </div>
        </div>

        <div style={{ padding: "18px 18px 0", background: "var(--bg)", borderRadius: "24px 24px 0 0", marginTop: -22, position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>단풍식당</h2>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--ink-3)" }}>한식 · 김치찌개 · 정문 도보 3분</p>
            </div>
            <span className="tag tag-mint" style={{ alignSelf: "flex-start", marginTop: 4 }}>영업중</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
            <Stars value={4.6} size={14} />
            <span className="mono" style={{ fontSize: 13, fontWeight: 700 }}>4.6</span>
            <span style={{ fontSize: 12, color: "var(--ink-4)" }}>리뷰 128</span>
            <span style={{ fontSize: 11, color: "var(--ink-4)" }}>·</span>
            <span style={{ fontSize: 12, color: "var(--primary-ink)", fontWeight: 600 }}>스탬프 +1</span>
          </div>

          {/* meta row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, marginTop: 14, padding: 12, background: "var(--card)", borderRadius: 16, border: "1px solid var(--line)" }}>
            {[
              { l: "영업", v: "11–22시" },
              { l: "전화", v: "031-...4421" },
              { l: "가격대", v: "₩₩" },
            ].map((m, i) => (
              <div key={i} style={{ textAlign: "center", borderLeft: i ? "1px solid var(--line)" : "none" }}>
                <p style={{ margin: 0, fontSize: 10, color: "var(--ink-4)" }}>{m.l}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, fontWeight: 600 }}>{m.v}</p>
              </div>
            ))}
          </div>

          {/* tabs */}
          <div className="seg" style={{ marginTop: 16 }}>
            <button data-active="true">리뷰 128</button>
            <button>메뉴</button>
            <button>사진 64</button>
          </div>

          {/* reviews */}
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { u: "민지", k: "컴공 25학번", r: 5, t: "찌개가 매콤하고 양도 많아요. 학교에서 정말 가까워서 자주 가요!", img: true, time: "2일 전" },
              { u: "준영", k: "경영 24학번", r: 4, t: "가성비 좋고 사장님이 친절하세요. 평일 점심엔 줄 서서 대기 5분 정도.", img: false, time: "5일 전" },
            ].map((rv, i) => (
              <div key={i} style={{ paddingBottom: 12, borderBottom: i === 0 ? "1px solid var(--line)" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: i === 0 ? "var(--accent-soft)" : "var(--primary-soft)",
                    color: i === 0 ? "var(--accent-ink)" : "var(--primary-ink)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700,
                  }}>{rv.u[0]}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{rv.u}</p>
                    <p style={{ margin: 0, fontSize: 10, color: "var(--ink-4)" }}>{rv.k} · {rv.time}</p>
                  </div>
                  <Stars value={rv.r} size={11} />
                </div>
                <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55 }}>{rv.t}</p>
                {rv.img && (
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <div className="ph" style={{ width: 64, height: 64, borderRadius: 10 }}>음식 사진</div>
                    <div className="ph" style={{ width: 64, height: 64, borderRadius: 10 }}>실내 사진</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* sticky bottom CTAs */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        padding: "12px 16px 22px", background: "var(--bg)",
        display: "flex", gap: 8, borderTop: "1px solid var(--line)",
      }}>
        <button className="btn-ghost" style={{ height: 52, background: "var(--accent-soft)", color: "var(--accent-ink)", fontWeight: 700, padding: "0 18px" }}>
          {I.qr(18)} 도장 받기
        </button>
        <button className="btn-primary" style={{ flex: 1 }}>
          {I.plus(16)} 리뷰 쓰기
        </button>
      </div>
    </Phone>
  );
}

const heroBtn = {
  width: 38, height: 38, borderRadius: 12,
  background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  color: "var(--ink)",
};

// ──────────────────────────────────────────────────────────────
// WRITE REVIEW
// ──────────────────────────────────────────────────────────────
function WriteReviewScreen() {
  const [rating, setRating] = React.useState(4);
  return (
    <Phone>
      <TopBar title="리뷰 쓰기" onBack={() => {}} action={
        <button style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-4)" }}>임시저장</button>
      } />

      <div className="scroll" style={{ padding: "0 18px 20px" }}>
        <div className="card" style={{ padding: 14, display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div className="ph" style={{ width: 48, height: 48, borderRadius: 12 }}>img</div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>단풍식당</p>
            <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>한식 · 김치찌개</p>
          </div>
          <span className="tag tag-amber" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            {I.stamp(11)} +20p
          </span>
        </div>

        {/* rating */}
        <div style={{ textAlign: "center", padding: "16px 0 20px" }}>
          <p style={{ margin: 0, fontSize: 12, color: "var(--ink-3)" }}>이 가게는 어땠어요?</p>
          <div style={{ marginTop: 10, display: "inline-flex", gap: 6 }}>
            <Stars value={rating} interactive onChange={setRating} size={36} />
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 13, fontWeight: 600, color: "var(--ink-2)" }}>
            {["", "별로", "그저그래요", "괜찮아요", "맛있어요", "또 가고 싶어요!"][rating]}
          </p>
        </div>

        {/* tags */}
        <label className="field-label">어떤 점이 좋았어요? <span style={{ color: "var(--ink-4)", fontWeight: 400 }}>(선택)</span></label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {[
            ["맛있어요", true], ["가성비", true], ["양 많아요", false], ["혼밥", false],
            ["빠른 서빙", false], ["깨끗해요", true], ["분위기", false],
          ].map(([l, on], i) => (
            <button key={i} className="chip" data-active={on}>{l}</button>
          ))}
        </div>

        {/* text */}
        <label className="field-label">자유롭게 후기를 적어주세요</label>
        <textarea
          placeholder="단대 친구들에게 도움이 되는 솔직한 후기를 남겨주세요."
          defaultValue="찌개가 매콤하고 양도 많아요. 학교에서 정말 가까워서 자주 가요!"
          style={{
            width: "100%", minHeight: 110, padding: 14, fontSize: 14,
            borderRadius: 18, border: "1px solid var(--line)", background: "var(--card)",
            resize: "none", outline: "none", lineHeight: 1.55,
          }}
        />
        <p style={{ margin: "6px 2px 0", fontSize: 11, color: "var(--ink-4)", textAlign: "right" }}>32 / 1000</p>

        {/* photos */}
        <label className="field-label" style={{ marginTop: 14 }}>사진 추가 <span style={{ color: "var(--accent-ink)", fontWeight: 600 }}>+5p</span></label>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{
            width: 72, height: 72, borderRadius: 14,
            border: "1.5px dashed var(--line-2)", background: "var(--card)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
            color: "var(--ink-3)",
          }}>{I.camera(20)}<span className="mono" style={{ fontSize: 9 }}>0 / 5</span></button>
          <div className="ph" style={{ width: 72, height: 72, borderRadius: 14, fontSize: 9 }}>사진 1</div>
          <div className="ph" style={{ width: 72, height: 72, borderRadius: 14, fontSize: 9 }}>사진 2</div>
        </div>

        {/* visit verification */}
        <div className="card" style={{
          marginTop: 18, padding: 14, display: "flex", alignItems: "center", gap: 12,
          background: "var(--primary-soft)", border: "1px solid oklch(0.86 0.06 270)",
        }}>
          <span style={{
            width: 32, height: 32, borderRadius: 10, color: "var(--primary-ink)",
            background: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>{I.check(18)}</span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--primary-ink)" }}>방문 인증 완료</p>
            <p style={{ margin: 0, fontSize: 11, color: "var(--primary-ink)", opacity: 0.7 }}>GPS · 10:32 인증됨</p>
          </div>
        </div>
      </div>

      <div style={{ padding: "12px 16px 22px", borderTop: "1px solid var(--line)", background: "var(--bg)" }}>
        <button className="btn-primary">리뷰 등록 · 총 +25p</button>
      </div>
    </Phone>
  );
}

// ──────────────────────────────────────────────────────────────
// STAMP BOOK / POINTS / REWARDS
// ──────────────────────────────────────────────────────────────
function StampBookScreen({ dark = false }) {
  const [tab, setTab] = React.useState("stamp");
  const stamps = [
    { n: "단풍식당", got: true, c: "var(--primary)" },
    { n: "캠퍼스 라멘", got: true, c: "oklch(0.62 0.16 18)" },
    { n: "STAFF COFFEE", got: true, c: "oklch(0.62 0.14 60)" },
    { n: "후문 닭갈비", got: true, c: "oklch(0.62 0.16 18)" },
    { n: "정문 김밥천국", got: true, c: "oklch(0.62 0.13 165)" },
    { n: "꽃피는 분식", got: true, c: "oklch(0.62 0.16 18)" },
    { n: "단대 우동", got: true, c: "var(--primary)" },
    { n: "후문 떡볶이", got: false },
    { n: "코너 베이커리", got: false },
  ];
  const total = 7;
  const points = 320;
  const goal = 500;

  return (
    <Phone dark={dark}>
      <TopBar title="스탬프북" dark={dark} action={
        <button style={{
          fontSize: 13, fontWeight: 600, color: "var(--ink-2)",
          padding: "6px 10px", borderRadius: 10, background: "var(--card)", border: "1px solid var(--line)",
        }}>이벤트</button>
      } />

      <div className="scroll" style={{ padding: "0 16px 16px" }}>
        {/* progress hero */}
        <div style={{
          background: "var(--hero-bg)", borderRadius: 24, padding: 18, color: "var(--hero-fg)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", right: -40, bottom: -40, width: 200, height: 200,
            borderRadius: "50%", background: "var(--accent)", opacity: 0.4, filter: "blur(28px)",
          }} />
          <div style={{ position: "relative" }}>
            <p style={{ margin: 0, fontSize: 11, opacity: 0.7 }}>이번 학기 누적 포인트</p>
            <p style={{ margin: "2px 0 8px", fontSize: 38, fontWeight: 800, letterSpacing: "-0.03em" }} className="mono">
              {points}<span style={{ fontSize: 14, opacity: 0.6, marginLeft: 4 }}>p</span>
            </p>

            <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.16)", overflow: "hidden" }}>
              <div style={{ width: `${(points/goal)*100}%`, height: "100%", background: "var(--accent)", borderRadius: 999 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11 }}>
              <span style={{ opacity: 0.7 }}>{goal - points}p 더 모으면 ☕ 스타벅스</span>
              <span className="mono" style={{ opacity: 0.7 }}>{goal}p</span>
            </div>
          </div>
        </div>

        {/* mini stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12 }}>
          <Mini n={total} l="모은 스탬프" />
          <Mini n="12" l="작성한 리뷰" />
          <Mini n="3" l="교환한 리워드" />
        </div>

        {/* stamp grid */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "20px 0 10px" }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>이번 학기 스탬프</p>
          <span className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>{total} / 30</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {stamps.map((s, i) => (
            <div key={i} style={{
              aspectRatio: "1", borderRadius: 14,
              background: s.got ? "var(--card)" : "transparent",
              border: s.got ? "1px solid var(--line)" : "1.5px dashed var(--line-2)",
              padding: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
              opacity: s.got ? 1 : 0.55,
            }}>
              {s.got ? (
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: s.c, color: "#fff",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                }}>{I.check(16)}</div>
              ) : (
                <div style={{ width: 30, height: 30, borderRadius: "50%", border: "1.5px dashed var(--line-2)" }} />
              )}
              <span style={{
                fontSize: 9, fontWeight: 600, textAlign: "center", color: "var(--ink-3)",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%",
              }}>{s.n}</span>
            </div>
          ))}
        </div>

        {/* rewards */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "22px 0 10px" }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>리워드 교환</p>
          <button style={{ fontSize: 12, color: "var(--primary-ink)", fontWeight: 600 }}>전체보기 ›</button>
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, margin: "0 -16px", padding: "0 16px 4px" }}>
          {[
            { n: "스타벅스 아메리카노", p: 500, stock: 12, c: "oklch(0.62 0.12 165)" },
            { n: "BBQ 황금올리브 1/2", p: 1200, stock: 3, c: "oklch(0.66 0.18 50)" },
            { n: "GS25 5,000원권", p: 600, stock: 24, c: "oklch(0.58 0.16 235)" },
          ].map((r, i) => {
            const can = points >= r.p;
            return (
              <div key={i} style={{
                minWidth: 170, background: "var(--card)", borderRadius: 18,
                border: "1px solid var(--line)", overflow: "hidden", flexShrink: 0,
              }}>
                <div style={{
                  height: 84, background: r.c, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{I.gift(28)}</div>
                <div style={{ padding: "10px 12px 12px" }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: "-0.02em" }}>{r.n}</p>
                  <p style={{ margin: "2px 0 8px", fontSize: 10, color: "var(--ink-4)" }}>재고 {r.stock}개</p>
                  <button style={{
                    width: "100%", height: 30, borderRadius: 10,
                    background: can ? "var(--ink)" : "var(--bg-3)",
                    color: can ? "#fff" : "var(--ink-4)",
                    fontSize: 12, fontWeight: 700,
                  }}>
                    <span className="mono">{r.p}p</span> 교환
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ height: 8 }} />
      </div>

      <TabBar active={tab} onChange={setTab} />
    </Phone>
  );
}

function Mini({ n, l }) {
  return (
    <div className="card" style={{ padding: "12px 10px", textAlign: "center" }}>
      <p className="mono" style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>{n}</p>
      <p style={{ margin: "2px 0 0", fontSize: 10, color: "var(--ink-3)" }}>{l}</p>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// BUILDING DETAIL — 학생회관
// ──────────────────────────────────────────────────────────────
function BuildingScreen() {
  return (
    <Phone>
      <div className="scroll" style={{ paddingBottom: 16 }}>
        {/* hero */}
        <div style={{ position: "relative" }}>
          <div className="ph" style={{ height: 200, fontSize: 12 }}>학생회관 외관 사진</div>
          <div style={{ position: "absolute", top: 14, left: 14 }}>
            <button style={heroBtn}>{I.chevL(20)}</button>
          </div>
          <div style={{ position: "absolute", top: 14, right: 14 }}>
            <button style={heroBtn}>{I.heart(18)}</button>
          </div>
        </div>

        <div style={{ padding: "18px 18px 0", background: "var(--bg)", borderRadius: "24px 24px 0 0", marginTop: -22, position: "relative", zIndex: 2 }}>
          <p className="mono" style={{ margin: 0, fontSize: 10, color: "var(--accent-ink)", letterSpacing: "0.08em", textTransform: "uppercase" }}>B11 · 죽전캠퍼스</p>
          <h2 style={{ margin: "2px 0 0", fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em" }}>학생회관</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--ink-3)" }}>지하 1층 ~ 지상 4층 · 도보 4분</p>

          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button className="btn-ghost" style={{ height: 38, background: "var(--card)", border: "1px solid var(--line)" }}>{I.walk(16)} 길찾기</button>
            <button className="btn-ghost" style={{ height: 38, background: "var(--card)", border: "1px solid var(--line)" }}>층별 안내</button>
          </div>

          {/* today menu */}
          <div className="card" style={{ marginTop: 18, padding: 0, overflow: "hidden" }}>
            <div style={{
              padding: "14px 16px",
              background: "var(--accent-soft)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <p style={{ margin: 0, fontSize: 11, color: "var(--accent-ink)" }}>오늘의 학식 · 점심</p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>1층 학생식당</p>
              </div>
              <span style={{
                padding: "4px 10px", borderRadius: 999, background: "var(--accent)", color: "#3a1d00",
                fontSize: 11, fontWeight: 700,
              }}>11:30 — 14:00</span>
            </div>
            <div style={{ padding: "4px 16px 12px" }}>
              {[
                { c: "한식 A", m: "제육볶음 · 시금치무침 · 미역국 · 김치", p: 5500, soldout: false, hot: true },
                { c: "한식 B", m: "돈까스 · 단무지 · 양배추샐러드 · 미소국", p: 6000, soldout: true },
                { c: "양식 C", m: "스파게티 · 갈릭브레드 · 샐러드", p: 6500, soldout: false },
                { c: "분식 D", m: "라면 · 김밥 · 만두 (2pc) · 단무지", p: 4500, soldout: false },
              ].map((r, i) => (
                <div key={i} style={{
                  padding: "12px 0",
                  borderTop: i ? "1px solid var(--line)" : "none",
                  opacity: r.soldout ? 0.45 : 1,
                  display: "flex", gap: 12, alignItems: "center",
                }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: r.hot ? "var(--accent-ink)" : "var(--ink-3)",
                    minWidth: 38,
                  }}>{r.c}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      margin: 0, fontSize: 13, lineHeight: 1.4,
                      textDecoration: r.soldout ? "line-through" : "none",
                    }}>{r.m}</p>
                  </div>
                  {r.soldout ? <span className="tag tag-rose">품절</span> :
                    <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>{r.p.toLocaleString()}원</span>}
                </div>
              ))}
              <p style={{ margin: "8px 2px 0", fontSize: 10, color: "var(--ink-4)" }}>
                마지막 업데이트 · 12분 전 (식당 관리자)
              </p>
            </div>
          </div>

          {/* 입주 시설 */}
          <p style={{ margin: "22px 0 10px 4px", fontSize: 13, fontWeight: 700, color: "var(--ink-3)", letterSpacing: 0 }}>입주 시설</p>
          <div className="card" style={{ padding: 4 }}>
            {[
              { f: "1F", n: "학생식당", s: "영업중", c: "mint", i: "🍱" },
              { f: "1F", n: "CU 편의점", s: "24시간", c: "indigo", i: "🏪" },
              { f: "2F", n: "스터디 카페", s: "08–22시", c: "amber", i: "☕" },
              { f: "2F", n: "복사실", s: "09–18시", c: "indigo", i: "🖨" },
              { f: "B1", n: "샤워실/체육시설", s: "06–22시", c: "mint", i: "🚿" },
            ].map((row, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
                borderTop: i ? "1px solid var(--line)" : "none",
              }}>
                <span className="mono" style={{ fontSize: 10, fontWeight: 700, color: "var(--ink-4)", width: 20 }}>{row.f}</span>
                <span style={{
                  width: 30, height: 30, borderRadius: 10, fontSize: 16,
                  background: "var(--bg-2)", display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>{row.i}</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{row.n}</span>
                <span className={"tag tag-" + row.c}>{row.s}</span>
              </div>
            ))}
          </div>

          {/* 동아리방 */}
          <p style={{ margin: "22px 0 10px 4px", fontSize: 13, fontWeight: 700, color: "var(--ink-3)" }}>이 건물의 동아리방</p>
          <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
            {[
              { n: "한울", r: "3F · 312", c: "var(--primary)", t: "사진" },
              { n: "RUNRUN", r: "3F · 305", c: "oklch(0.62 0.16 18)", t: "러닝" },
              { n: "코드웍스", r: "4F · 411", c: "oklch(0.62 0.13 165)", t: "개발" },
            ].map((c, i) => (
              <div key={i} className="card" style={{ padding: 10, minWidth: 130, flexShrink: 0 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: c.c, color: "#fff", fontWeight: 800, fontSize: 14,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>{c.n[0]}</div>
                <p style={{ margin: "8px 0 0", fontSize: 13, fontWeight: 700 }}>{c.n}</p>
                <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>{c.t} · {c.r}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ──────────────────────────────────────────────────────────────
// CLUB DETAIL
// ──────────────────────────────────────────────────────────────
function ClubScreen() {
  return (
    <Phone>
      <TopBar title="중앙동아리" onBack={() => {}} sticky={false} />

      <div className="scroll" style={{ padding: "0 18px 20px" }}>
        {/* hero */}
        <div className="card" style={{ padding: 20, textAlign: "center", overflow: "hidden", position: "relative" }}>
          <div style={{
            position: "absolute", inset: 0, opacity: 0.4,
            background: "radial-gradient(circle at 50% 0%, oklch(0.92 0.08 270), transparent 60%)",
          }} />
          <div style={{
            width: 76, height: 76, borderRadius: 22,
            background: "var(--ink)", color: "#fff",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 900, letterSpacing: "-0.05em",
            margin: "0 auto 10px", position: "relative",
            boxShadow: "var(--sh-2)",
          }}>한울</div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>사진동아리 한울</h2>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--ink-3)", position: "relative" }}>
            중앙동아리 · 설립 1992
          </p>

          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 14, position: "relative" }}>
            <button style={{
              height: 38, padding: "0 16px", borderRadius: 12,
              background: "var(--ink)", color: "#fff", fontSize: 13, fontWeight: 700,
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>{I.plus(14)} 가입 신청</button>
            <button style={{
              height: 38, width: 38, borderRadius: 12,
              background: "var(--card)", border: "1px solid var(--line)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>{I.insta(18)}</button>
            <button style={{
              height: 38, width: 38, borderRadius: 12,
              background: "var(--card)", border: "1px solid var(--line)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>{I.heart(18)}</button>
          </div>
        </div>

        {/* meta */}
        <div className="card" style={{ marginTop: 12, padding: 0 }}>
          {[
            { l: "동아리방", v: "학생회관 312호", i: I.pin(16) },
            { l: "회장", v: "이서연 · 24학번", i: I.user(16) },
            { l: "회비", v: "학기당 30,000원", i: "₩" },
            { l: "정기 모임", v: "매주 화 18:00", i: I.cal(16) },
          ].map((m, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
              borderTop: i ? "1px solid var(--line)" : "none",
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: 9, background: "var(--bg-2)",
                color: "var(--ink-3)", display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700,
              }}>{m.i}</span>
              <span style={{ flex: 1, fontSize: 12, color: "var(--ink-3)" }}>{m.l}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{m.v}</span>
            </div>
          ))}
        </div>

        {/* description */}
        <p style={{ margin: "20px 4px 8px", fontSize: 13, fontWeight: 700, color: "var(--ink-3)" }}>소개</p>
        <p style={{ margin: 0, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6, padding: "0 4px" }}>
          한울은 단국대학교 죽전캠퍼스의 사진 중앙동아리예요. 매학기 정기 출사와 작품전을 진행하며,
          신입생 환영회와 흑백암실 워크샵을 운영합니다. 카메라가 없어도 가입할 수 있어요.
        </p>

        {/* awards */}
        <p style={{ margin: "20px 4px 10px", fontSize: 13, fontWeight: 700, color: "var(--ink-3)" }}>수상 내역</p>
        <div className="card" style={{ padding: 14 }}>
          {[
            { y: "2024", t: "전국 대학사진 공모전 금상", k: "단체전 「길 위에서」" },
            { y: "2023", t: "단국대 동아리 페스타 대상", k: "캠퍼스 다큐멘터리" },
            { y: "2022", t: "교내 학술대회 우수상", k: "사진과 기록" },
          ].map((a, i) => (
            <div key={i} style={{
              display: "flex", gap: 12, padding: "10px 0",
              borderTop: i ? "1px solid var(--line)" : "none",
            }}>
              <span className="mono" style={{ fontSize: 11, color: "var(--ink-4)", width: 36 }}>{a.y}</span>
              <span style={{ color: "var(--accent-ink)", marginTop: 2 }}>{I.trophy(14)}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{a.t}</p>
                <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>{a.k}</p>
              </div>
            </div>
          ))}
        </div>

        {/* recruit */}
        <div style={{
          marginTop: 20, borderRadius: 22, padding: 18,
          background: "var(--primary-soft)", border: "1px solid oklch(0.86 0.06 270)",
          display: "flex", gap: 14, alignItems: "center",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: "var(--primary)", color: "#fff",
            display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 24,
          }}>📸</div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--primary-ink)" }}>2025-1학기 모집 중</p>
            <p style={{ margin: 0, fontSize: 11, color: "var(--primary-ink)", opacity: 0.75 }}>~ 3/15 (토) · 신입생 환영</p>
          </div>
          <button style={{
            padding: "8px 14px", borderRadius: 12, background: "var(--ink)", color: "#fff",
            fontSize: 12, fontWeight: 700,
          }}>지원하기</button>
        </div>
      </div>
    </Phone>
  );
}

// ──────────────────────────────────────────────────────────────
// MY PAGE
// ──────────────────────────────────────────────────────────────
function MyPageScreen({ dark = false }) {
  const [tab, setTab] = React.useState("me");
  return (
    <Phone dark={dark}>
      <TopBar title="MY" dark={dark} action={
        <button style={{
          width: 36, height: 36, borderRadius: 12,
          background: "var(--card)", border: "1px solid var(--line)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>
          </svg>
        </button>
      } />

      <div className="scroll" style={{ padding: "0 16px 20px" }}>
        {/* profile card */}
        <div className="card" style={{ padding: 18, display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "var(--primary)", color: "#fff",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, fontWeight: 800,
            border: "3px solid var(--card)", boxShadow: "var(--sh-2)",
            position: "relative",
          }}>
            단
            <span style={{
              position: "absolute", right: -2, bottom: -2,
              width: 22, height: 22, borderRadius: "50%",
              background: "var(--accent)", color: "#3a1d00",
              fontSize: 11, fontWeight: 800, border: "2px solid var(--card)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>+</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em" }}>단풍이</p>
              <span className="tag tag-amber">Lv.3</span>
            </div>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--ink-3)" }}>컴퓨터공학과 · 25학번</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--ink-4)" }}>danpoong@dankook.ac.kr</p>
          </div>
        </div>

        {/* stat row */}
        <div className="card" style={{ marginTop: 10, padding: "16px 0", display: "flex" }}>
          {[
            ["320p", "포인트"], ["7", "스탬프"], ["12", "리뷰"], ["3", "리워드"],
          ].map(([n, l], i) => (
            <div key={i} style={{
              flex: 1, textAlign: "center",
              borderLeft: i ? "1px solid var(--line)" : "none",
            }}>
              <p className="mono" style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>{n}</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--ink-3)" }}>{l}</p>
            </div>
          ))}
        </div>

        {/* event banner */}
        <div style={{
          marginTop: 12, padding: "16px 18px", borderRadius: 22,
          background: "var(--hero-bg)", color: "var(--hero-fg)",
          display: "flex", alignItems: "center", gap: 14,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", right: -30, top: -30, width: 140, height: 140,
            borderRadius: "50%", background: "var(--accent)", opacity: 0.35, filter: "blur(18px)",
          }} />
          <div style={{ flex: 1, position: "relative" }}>
            <p style={{ margin: 0, fontSize: 11, opacity: 0.6 }}>3월 신입생 EVENT</p>
            <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 700, letterSpacing: "-0.02em" }}>도장 3개 모으면 추첨 응모</p>
          </div>
          <span style={{ fontSize: 30 }}>🎁</span>
        </div>

        {/* menu list */}
        <p style={{ margin: "20px 4px 8px", fontSize: 12, color: "var(--ink-4)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600 }}>활동</p>
        <div className="card" style={{ padding: 4 }}>
          {[
            ["내 리뷰", "12개"], ["즐겨찾기", "8곳"], ["포인트 내역", null], ["받은 리워드", "3개"],
          ].map(([l, v], i) => (
            <MenuRow key={i} label={l} value={v} last={i === 3} />
          ))}
        </div>

        <p style={{ margin: "20px 4px 8px", fontSize: 12, color: "var(--ink-4)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600 }}>설정</p>
        <div className="card" style={{ padding: 4 }}>
          {[
            ["알림 설정", "수업 5분 전"], ["테마", "라이트"], ["이용 약관", null], ["로그아웃", null],
          ].map(([l, v], i) => (
            <MenuRow key={i} label={l} value={v} last={i === 3} danger={l === "로그아웃"} />
          ))}
        </div>

        <p style={{ margin: "16px 0 0", fontSize: 10, color: "var(--ink-4)", textAlign: "center" }}>DANIV v0.9.2 · 죽전캠퍼스</p>
      </div>

      <TabBar active={tab} onChange={setTab} />
    </Phone>
  );
}

function MenuRow({ label, value, last, danger }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", padding: "13px 12px",
      borderTop: !last ? "1px solid var(--line)" : "none",
      color: danger ? "var(--rose)" : "var(--ink)",
    }}>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{label}</span>
      {value && <span style={{ fontSize: 12, color: "var(--ink-4)", marginRight: 6 }}>{value}</span>}
      {!danger && <span style={{ color: "var(--ink-4)" }}>{I.chevR(14)}</span>}
    </div>
  );
}

Object.assign(window, {
  RestaurantListScreen, RestaurantDetailScreen, WriteReviewScreen,
  StampBookScreen, BuildingScreen, ClubScreen, MyPageScreen,
});

// ──────────────────────────────────────────────────────────────
// SETTINGS — 다크 모드 자동 전환 토글
// ──────────────────────────────────────────────────────────────
function SettingsScreen({ dark = false }) {
  // theme: light | dark | system | schedule
  const [theme, setTheme] = React.useState("system");
  const [start, setStart] = React.useState("19:00");
  const [end, setEnd] = React.useState("07:00");
  const [notif, setNotif] = React.useState({ next: true, stamp: true, event: false, marketing: false });
  const t = (k) => () => setNotif(n => ({ ...n, [k]: !n[k] }));

  return (
    <Phone dark={dark}>
      <TopBar title="설정" dark={dark} onBack={() => {}} />

      <div className="scroll" style={{ padding: "0 16px 20px" }}>
        {/* THEME — section header */}
        <SectionHead>화면 테마</SectionHead>

        {/* visual preview */}
        <div className="card" style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <ThemeTile dark={false} active={theme === "light"} onClick={() => setTheme("light")} label="라이트" />
            <ThemeTile dark={true}  active={theme === "dark"}  onClick={() => setTheme("dark")} label="다크" />
          </div>
          <div style={{ marginTop: 10 }}>
            <ThemeRow
              active={theme === "system"} onClick={() => setTheme("system")}
              icon="📱" title="시스템 설정 따르기"
              sub="iOS / Android 설정에 맞춰 자동 전환"
            />
            <ThemeRow
              active={theme === "schedule"} onClick={() => setTheme("schedule")}
              icon="🌙" title="시간 예약 자동 전환"
              sub="해질녘부터 새벽까지 다크 모드"
              last
            />
          </div>
        </div>

        {/* schedule sub-options — only when active */}
        {theme === "schedule" && (
          <div className="card" style={{ padding: 0, marginBottom: 12, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", background: "var(--primary-soft)" }}>
              <p style={{ margin: 0, fontSize: 12, color: "var(--primary-ink)", fontWeight: 600 }}>
                매일 {start}부터 {end}까지 다크 모드가 적용됩니다
              </p>
            </div>
            <TimeRow label="다크 모드 시작" value={start} onChange={setStart} icon="🌒" />
            <TimeRow label="라이트 모드 시작" value={end} onChange={setEnd} icon="☀️" last />
          </div>
        )}

        {theme === "system" && (
          <div className="card" style={{
            padding: "12px 14px", marginBottom: 12,
            background: "var(--primary-soft)", border: "1px solid oklch(0.86 0.06 270)",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 18 }}>✨</span>
            <p style={{ margin: 0, fontSize: 12, color: "var(--primary-ink)" }}>
              현재 기기 설정: <strong>라이트</strong> · 일몰 시 자동으로 다크로 전환돼요
            </p>
          </div>
        )}

        {/* NOTIFICATIONS */}
        <SectionHead>알림</SectionHead>
        <div className="card" style={{ padding: 4, marginBottom: 12 }}>
          <ToggleRow icon="🔔" title="다음 수업 알림" sub="수업 시작 5분 전" on={notif.next} onChange={t("next")} />
          <ToggleRow icon="🏷️" title="스탬프 · 포인트" sub="획득/만료 안내" on={notif.stamp} onChange={t("stamp")} />
          <ToggleRow icon="🎉" title="학사 일정 · 축제" sub="공식 행사 공지" on={notif.event} onChange={t("event")} />
          <ToggleRow icon="📣" title="이벤트 · 마케팅" sub="리워드 충전 등 프로모션" on={notif.marketing} onChange={t("marketing")} last />
        </div>

        {/* GENERAL */}
        <SectionHead>일반</SectionHead>
        <div className="card" style={{ padding: 4, marginBottom: 12 }}>
          <SelectRow icon="🌐" title="언어" value="한국어" />
          <SelectRow icon="🏫" title="캠퍼스" value="죽전" badge="천안 곧 출시" />
          <SelectRow icon="📍" title="위치 권한" value="앱 사용 중" />
          <SelectRow icon="🔋" title="데이터 절약 모드" value="자동" last />
        </div>

        {/* PRIVACY */}
        <SectionHead>개인정보 / 약관</SectionHead>
        <div className="card" style={{ padding: 4, marginBottom: 12 }}>
          <SelectRow icon="🛡️" title="개인정보 처리방침" />
          <SelectRow icon="📄" title="이용약관" />
          <SelectRow icon="🆔" title="계정 · 데이터 다운로드" />
          <SelectRow icon="❌" title="회원 탈퇴" danger last />
        </div>

        <p style={{ margin: "16px 0 0", fontSize: 10, color: "var(--ink-4)", textAlign: "center" }}>
          DANIV v0.9.2 · build 240312
        </p>
      </div>
    </Phone>
  );
}

function SectionHead({ children }) {
  return (
    <p style={{
      margin: "20px 4px 8px", fontSize: 11,
      color: "var(--ink-4)", letterSpacing: "0.06em",
      textTransform: "uppercase", fontWeight: 700,
    }}>{children}</p>
  );
}

function ThemeTile({ dark, active, onClick, label }) {
  // mini preview of a phone screen
  const bg = dark ? "oklch(0.16 0.012 270)" : "oklch(0.985 0.005 80)";
  const card = dark ? "oklch(0.22 0.014 270)" : "#fff";
  const ink = dark ? "oklch(0.97 0.005 270)" : "oklch(0.18 0.025 270)";
  const ink2 = dark ? "oklch(0.68 0.01 270)" : "oklch(0.52 0.015 270)";
  return (
    <button onClick={onClick} style={{
      padding: 10, borderRadius: 16,
      border: active ? "2px solid var(--primary)" : "2px solid var(--line)",
      background: "var(--card)",
      display: "flex", flexDirection: "column", gap: 8,
      cursor: "pointer", transition: "all .15s ease",
    }}>
      <div style={{
        height: 86, borderRadius: 10,
        background: bg, padding: 8,
        display: "flex", flexDirection: "column", gap: 5,
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
      }}>
        <div style={{ height: 8, borderRadius: 3, background: ink, width: "50%" }} />
        <div style={{ flex: 1, borderRadius: 6, background: card, padding: 5, display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={{ height: 4, borderRadius: 2, background: ink, width: "65%" }} />
          <div style={{ height: 3, borderRadius: 2, background: ink2, width: "85%" }} />
          <div style={{ height: 3, borderRadius: 2, background: ink2, width: "70%" }} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
        <span style={{
          width: 18, height: 18, borderRadius: "50%",
          border: active ? "5px solid var(--primary)" : "1.5px solid var(--line-2)",
          background: "var(--card)",
        }} />
      </div>
    </button>
  );
}

function ThemeRow({ active, onClick, icon, title, sub, last }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12, padding: "12px 4px",
      borderTop: !last ? "1px solid var(--line)" : "none",
      width: "100%", textAlign: "left", cursor: "pointer",
    }}>
      <span style={{
        width: 36, height: 36, borderRadius: 10, background: "var(--bg-2)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontSize: 16,
      }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{title}</p>
        <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>{sub}</p>
      </div>
      <span style={{
        width: 22, height: 22, borderRadius: "50%",
        border: active ? "6px solid var(--primary)" : "1.5px solid var(--line-2)",
        background: "var(--card)", flexShrink: 0,
      }} />
    </button>
  );
}

function TimeRow({ label, value, onChange, icon, last }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
      borderTop: !last ? "1px solid var(--line)" : "none",
    }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{label}</span>
      <input
        type="time" value={value} onChange={e => onChange(e.target.value)}
        className="mono"
        style={{
          padding: "6px 10px", borderRadius: 10,
          background: "var(--bg-2)", border: "1px solid var(--line)",
          fontSize: 14, fontWeight: 600, color: "var(--ink)",
          outline: "none",
        }}
      />
    </div>
  );
}

function ToggleRow({ icon, title, sub, on, onChange, last }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: "12px 12px",
      borderTop: !last ? "1px solid var(--line)" : "none",
    }}>
      <span style={{
        width: 32, height: 32, borderRadius: 9, background: "var(--bg-2)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontSize: 15,
      }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{title}</p>
        <p style={{ margin: 0, fontSize: 11, color: "var(--ink-4)" }}>{sub}</p>
      </div>
      <div onClick={onChange} style={{ cursor: "pointer" }}>
        <SettingsSwitch on={on} />
      </div>
    </div>
  );
}

function SettingsSwitch({ on }) {
  return (
    <div style={{
      width: 42, height: 26, borderRadius: 999, padding: 3,
      background: on ? "var(--primary)" : "var(--line-2)",
      display: "flex", alignItems: "center",
      transition: "background .15s ease",
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%", background: "#fff",
        transform: on ? "translateX(16px)" : "translateX(0)",
        transition: "transform .15s ease",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </div>
  );
}

function SelectRow({ icon, title, value, badge, danger, last }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: "12px 12px",
      borderTop: !last ? "1px solid var(--line)" : "none",
      color: danger ? "var(--rose)" : "var(--ink)",
    }}>
      <span style={{
        width: 32, height: 32, borderRadius: 9, background: "var(--bg-2)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontSize: 15,
      }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{title}</span>
      {badge && <span className="tag tag-amber" style={{ marginRight: 4 }}>{badge}</span>}
      {value && <span style={{ fontSize: 12, color: "var(--ink-4)", marginRight: 4 }}>{value}</span>}
      {!danger && <span style={{ color: "var(--ink-4)" }}>{I.chevR(14)}</span>}
    </div>
  );
}

Object.assign(window, { SettingsScreen });
