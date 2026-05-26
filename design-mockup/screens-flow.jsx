// screens-flow.jsx — Onboarding & Auth screens for DANIV

// ──────────────────────────────────────────────────────────────
// 1. ONBOARDING (3 steps + start)
// ──────────────────────────────────────────────────────────────
function OnboardingScreen() {
  const [step, setStep] = React.useState(0);
  const steps = [
    {
      tag: "01 / 캠퍼스 가이드",
      title: "입학 첫날부터\n캠퍼스가 익숙해져요",
      body: "지도 위에 다음 강의 동선이 그려지고, 다음 수업 5분 전 알림이 울려요.",
      art: <ArtMap />,
    },
    {
      tag: "02 / 학식부터 카페까지",
      title: "오늘의 학식,\n지금 품절일까?",
      body: "건물 안 학식·카페·편의점의 실시간 운영 현황을 한눈에 볼 수 있어요.",
      art: <ArtCafeteria />,
    },
    {
      tag: "03 / 모으면 진짜 받는다",
      title: "방문하고, 리뷰하고,\n기프티콘으로 교환",
      body: "주변 가게에서 도장을 모아 포인트로 바꾸고, 진짜 기프티콘을 받아가세요.",
      art: <ArtStamp />,
    },
  ];
  const s = steps[step];
  const last = step === steps.length - 1;

  return (
    <Phone>
      {/* skip */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 20px" }}>
        <button style={{ fontSize: 14, color: "var(--ink-3)", padding: "8px 4px" }}>
          건너뛰기
        </button>
      </div>

      <div className="scroll" style={{ padding: "12px 28px 0" }} key={step}>
        <div className="daniv-enter" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{
            height: 240, borderRadius: 24,
            background: "var(--bg-2)", border: "1px solid var(--line)",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", position: "relative",
          }}>{s.art}</div>

          <div className="mono" style={{
            fontSize: 11, color: "var(--primary-ink)", letterSpacing: "0.08em",
            textTransform: "uppercase", fontWeight: 600,
          }}>{s.tag}</div>

          <h1 style={{
            fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1.2,
            letterSpacing: "-0.03em", whiteSpace: "pre-line",
          }}>{s.title}</h1>

          <p style={{
            fontSize: 15, color: "var(--ink-3)", lineHeight: 1.55,
            margin: 0, maxWidth: 320,
          }}>{s.body}</p>
        </div>
      </div>

      <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* progress dots */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 22 : 6, height: 6, borderRadius: 999,
              background: i === step ? "var(--ink)" : "var(--line-2)",
              transition: "width .2s ease, background .2s ease",
            }} />
          ))}
        </div>

        <button className="btn-primary" onClick={() => setStep(s => last ? 0 : s + 1)}>
          {last ? "단이브 시작하기" : "다음"}
          {I.arrowR(18)}
        </button>
      </div>
    </Phone>
  );
}

// onboarding illustrations (geometric placeholders)
function ArtMap() {
  return (
    <svg viewBox="0 0 240 240" width="100%" height="100%">
      <defs>
        <linearGradient id="o-map" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="oklch(0.94 0.04 270)" />
          <stop offset="1" stopColor="oklch(0.92 0.03 145)" />
        </linearGradient>
      </defs>
      <rect x="20" y="40" width="200" height="160" rx="20" fill="url(#o-map)" />
      <path d="M40 90 Q 80 70, 120 110 T 200 150" stroke="oklch(0.42 0.18 270)" strokeWidth="3" fill="none" strokeDasharray="6 5" strokeLinecap="round" />
      <rect x="50" y="60" width="22" height="18" rx="3" fill="#fff" />
      <rect x="160" y="170" width="28" height="18" rx="3" fill="#fff" />
      <circle cx="61" cy="69" r="6" fill="oklch(0.74 0.16 55)" />
      <circle cx="174" cy="179" r="10" fill="oklch(0.42 0.18 270)" />
      <circle cx="174" cy="179" r="4" fill="#fff" />
    </svg>
  );
}
function ArtCafeteria() {
  return (
    <svg viewBox="0 0 240 240" width="100%" height="100%">
      <rect x="40" y="50" width="160" height="140" rx="18" fill="oklch(0.96 0.025 60)" />
      <rect x="56" y="68" width="60" height="48" rx="8" fill="#fff" />
      <rect x="124" y="68" width="60" height="48" rx="8" fill="#fff" />
      <rect x="56" y="124" width="60" height="48" rx="8" fill="#fff" />
      <rect x="124" y="124" width="60" height="48" rx="8" fill="oklch(0.74 0.16 55)" />
      <circle cx="86" cy="92" r="10" fill="oklch(0.74 0.16 55)" />
      <circle cx="154" cy="92" r="10" fill="oklch(0.42 0.18 270)" />
      <circle cx="86" cy="148" r="10" fill="oklch(0.78 0.13 165)" />
      <rect x="138" y="140" width="32" height="16" rx="3" fill="#fff" />
      <text x="154" y="153" fontSize="11" fontWeight="700" fill="oklch(0.42 0.18 270)" textAnchor="middle" fontFamily="system-ui">SOLD</text>
    </svg>
  );
}
function ArtStamp() {
  return (
    <svg viewBox="0 0 240 240" width="100%" height="100%">
      <rect x="40" y="50" width="160" height="140" rx="18" fill="oklch(0.94 0.05 60)" />
      {[0,1,2].map(r => [0,1,2,3].map(c => {
        const i = r * 4 + c;
        const filled = i < 7;
        const cx = 70 + c * 32;
        const cy = 82 + r * 32;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r="13" fill={filled ? "oklch(0.42 0.18 270)" : "#fff"} stroke={filled ? "none" : "oklch(0.88 0.01 80)"} strokeWidth="1.5" strokeDasharray={filled ? "0" : "2 2"} />
            {filled && <path d={`M${cx-4},${cy} l3,3 l5,-6`} stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
          </g>
        );
      }))}
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────
// 2. LOGIN / SIGNUP
// ──────────────────────────────────────────────────────────────
function LoginScreen() {
  const [mode, setMode] = React.useState("login");
  return (
    <Phone>
      <div style={{ padding: "20px 24px 0", flexShrink: 0 }}>
        <Wordmark size={24} />
      </div>

      <div className="scroll" style={{ padding: "32px 24px 0" }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: "-0.03em", lineHeight: 1.25 }}>
          {mode === "login" ? "다시 만나서\n반가워요" : "환영해요,\n신입생 👋"}
        </h1>
        <p style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 10, marginBottom: 28 }}>
          {mode === "login" ? "단국대학교 메일로 로그인하세요." : "단국대학교 이메일로 가입해주세요."}
        </p>

        <div className="seg" style={{ marginBottom: 22 }}>
          <button data-active={mode === "login"} onClick={() => setMode("login")}>로그인</button>
          <button data-active={mode === "signup"} onClick={() => setMode("signup")}>회원가입</button>
        </div>

        {mode === "signup" && (
          <div style={{ marginBottom: 14 }}>
            <label className="field-label">닉네임</label>
            <input className="field" placeholder="예: 단풍이" />
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label className="field-label">학교 이메일</label>
          <input className="field" placeholder="32250000@dankook.ac.kr" />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label className="field-label">비밀번호</label>
          <input className="field" type="password" placeholder="••••••••" />
        </div>

        {mode === "signup" && (
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label className="field-label">학과</label>
              <select className="field" defaultValue="">
                <option value="" disabled>선택</option>
                <option>컴퓨터공학과</option>
                <option>경영학과</option>
                <option>국어국문학과</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="field-label">학번</label>
              <input className="field mono" placeholder="2025" />
            </div>
          </div>
        )}

        <div style={{ height: 8 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
          <span style={{ fontSize: 12, color: "var(--ink-4)" }}>또는</span>
          <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
        </div>

        <OAuthBtn name="카카오로 계속하기" color="#FEE500" ink="#181600" emoji={<span style={{fontWeight:900, fontSize:18}}>K</span>} />
        <div style={{ height: 10 }} />
        <OAuthBtn name="Google로 계속하기" color="#fff" ink="var(--ink)" border emoji={
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.3c1.9-1.8 3-4.4 3-7.4Z" fill="#4285F4"/><path d="M12 22c2.7 0 5-1 6.7-2.4l-3.3-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.5-4.1H3v2.6A10 10 0 0 0 12 22Z" fill="#34A853"/><path d="M6.5 13.9a6 6 0 0 1 0-3.8V7.5H3a10 10 0 0 0 0 9l3.5-2.6Z" fill="#FBBC05"/><path d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9C16.9 2.9 14.7 2 12 2A10 10 0 0 0 3 7.5l3.5 2.6C7.2 7.7 9.4 6 12 6Z" fill="#EA4335"/></svg>
        } />

        <p style={{ fontSize: 11, color: "var(--ink-4)", textAlign: "center", marginTop: 22, lineHeight: 1.5 }}>
          계속하면 <span style={{ textDecoration: "underline" }}>이용약관</span>과 <span style={{ textDecoration: "underline" }}>개인정보처리방침</span>에 동의하게 됩니다.
        </p>
      </div>

      <div style={{ padding: "16px 24px 24px" }}>
        <button className="btn-primary">{mode === "login" ? "로그인" : "가입 완료"}</button>
      </div>
    </Phone>
  );
}

function OAuthBtn({ name, color, ink, border, emoji }) {
  return (
    <button style={{
      width: "100%", height: 52, borderRadius: 18,
      background: color, color: ink,
      border: border ? "1px solid var(--line)" : "none",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      fontSize: 15, fontWeight: 600,
    }}>
      {emoji}{name}
    </button>
  );
}

Object.assign(window, { OnboardingScreen, LoginScreen });
