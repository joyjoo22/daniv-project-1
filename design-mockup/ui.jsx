// ui.jsx — DANIV shared primitives, icons, and the brand wordmark.
// All components live on window for cross-script access.

// ──────────────────────────────────────────────────────────────
// ICONS — minimal stroke icons (24×24, currentColor stroke 1.6)
// ──────────────────────────────────────────────────────────────
const I = {
  home: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
    </svg>
  ),
  map: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z" />
      <path d="M9 4v16M15 6v16" />
    </svg>
  ),
  pin: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  cal: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  ),
  star: (s = 22, filled) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="m12 3 2.7 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17.3 6.5 20.3l1.1-6.3L3 9.6l6.3-.9L12 3Z" />
    </svg>
  ),
  stamp: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3l-3 3v3h6V9l-3-3V3" />
      <rect x="4" y="14" width="16" height="3" rx="1" />
      <path d="M4 20h16" />
    </svg>
  ),
  user: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </svg>
  ),
  bell: (s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 2 6.5H4c.5-1 2-2.5 2-6.5Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  ),
  search: (s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  ),
  arrowR: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  chevR: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 6 6 6-6 6" />
    </svg>
  ),
  chevL: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 6-6 6 6 6" />
    </svg>
  ),
  close: (s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  ),
  plus: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  camera: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  walk: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13" cy="4.5" r="1.5" />
      <path d="M10 21l2-5 3-1-2-3 1-3 3 3h3" />
      <path d="M7 12l3-3 2 2-3 4 3 3" />
    </svg>
  ),
  cloud: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 18a4 4 0 0 1-.6-8 6 6 0 0 1 11.6 1A4 4 0 0 1 17 18H7Z" />
    </svg>
  ),
  sun: (s = 22) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
    </svg>
  ),
  bus: (s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="13" rx="2.5" />
      <path d="M4 11h16M8 17v2M16 17v2" />
      <circle cx="8" cy="14.5" r="1" fill="currentColor" />
      <circle cx="16" cy="14.5" r="1" fill="currentColor" />
    </svg>
  ),
  train: (s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="3" width="12" height="15" rx="3" />
      <path d="M6 11h12M9 21l-2 1M15 21l2 1" />
      <circle cx="9" cy="15" r="1" fill="currentColor" />
      <circle cx="15" cy="15" r="1" fill="currentColor" />
    </svg>
  ),
  heart: (s = 18, filled) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />
    </svg>
  ),
  insta: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  ),
  check: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 5 5 9-11" />
    </svg>
  ),
  qr: (s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3M21 14v0M17 17v4M14 21h3M21 17v4" />
    </svg>
  ),
  trophy: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
      <path d="M5 6H3v2a3 3 0 0 0 3 3M19 6h2v2a3 3 0 0 1-3 3" />
      <path d="M12 13v4M8 21h8M9 17h6" />
    </svg>
  ),
  gift: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="9" width="18" height="12" rx="2" />
      <path d="M3 13h18M12 9v12" />
      <path d="M12 9c-2 0-4-1.5-4-3.5S10 3 12 5c2-2 4-1.5 4 .5S14 9 12 9Z" />
    </svg>
  ),
};

// ──────────────────────────────────────────────────────────────
// BRAND — wordmark
// ──────────────────────────────────────────────────────────────
function Wordmark({ size = 28, dark = false }) {
  const ink = dark ? "#fff" : "var(--ink)";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: ink }}>
      <span style={{
        width: size * 0.9, height: size * 0.9, borderRadius: "50%",
        background: "var(--primary)", display: "inline-flex",
        alignItems: "center", justifyContent: "center", position: "relative",
      }}>
        <span style={{
          width: size * 0.32, height: size * 0.32, borderRadius: "50%",
          background: "var(--accent)", position: "absolute",
          right: -size * 0.04, bottom: -size * 0.04,
          boxShadow: "0 0 0 2px var(--bg)",
        }} />
      </span>
      <span style={{
        fontSize: size, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1,
      }}>단이브</span>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// BOTTOM TAB BAR (5 tabs)
// ──────────────────────────────────────────────────────────────
function TabBar({ active, onChange }) {
  const tabs = [
    { id: "home", label: "홈", icon: I.home },
    { id: "map", label: "지도", icon: I.map },
    { id: "stamp", label: "스탬프", icon: I.stamp },
    { id: "food", label: "맛집", icon: I.heart },
    { id: "me", label: "MY", icon: I.user },
  ];
  return (
    <div style={{
      display: "flex", padding: "8px 8px 22px",
      background: "var(--card)",
      borderTop: "1px solid var(--line)",
      flexShrink: 0,
    }}>
      {tabs.map(t => {
        const on = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange && onChange(t.id)} style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 3, padding: "6px 0",
            color: on ? "var(--ink)" : "var(--ink-4)",
            transition: "color .15s ease",
          }}>
            <div style={{
              padding: "4px 12px", borderRadius: 999,
              background: on ? "var(--primary-soft)" : "transparent",
              color: on ? "var(--primary-ink)" : "inherit",
              transition: "background .15s ease",
            }}>
              {t.icon(22)}
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "-0.02em" }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// STATUS BAR — minimal iOS-style
// ──────────────────────────────────────────────────────────────
function StatusBar({ dark = false, time = "9:41" }) {
  const c = dark ? "#fff" : "#000";
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "14px 24px 6px", flexShrink: 0, fontFamily: '-apple-system, system-ui',
    }}>
      <span style={{ fontWeight: 600, fontSize: 15, color: c, letterSpacing: 0 }}>{time}</span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <svg width="17" height="11" viewBox="0 0 17 11"><path d="M1 8h2v2H1zM5 6h2v4H5zM9 4h2v6H9zM13 1h2v9h-2z" fill={c}/></svg>
        <svg width="16" height="11" viewBox="0 0 16 11"><path d="M8 2.5c2 0 3.8.7 5.1 2L14 3.4A8 8 0 0 0 2 3.4l.9 1.1A7 7 0 0 1 8 2.5Z" fill={c}/><path d="M8 6c1.2 0 2.3.5 3.1 1.2l.9-.9A5.6 5.6 0 0 0 8 4.8c-1.5 0-2.8.6-4 1.5l.9.9A4.5 4.5 0 0 1 8 6Z" fill={c}/><circle cx="8" cy="9.3" r="1.3" fill={c}/></svg>
        <svg width="25" height="11" viewBox="0 0 25 11"><rect x="0.5" y="0.5" width="21" height="10" rx="2.5" fill="none" stroke={c} strokeOpacity="0.4"/><rect x="2" y="2" width="18" height="7" rx="1.5" fill={c}/><rect x="22.5" y="4" width="1.5" height="3" rx="0.5" fill={c} fillOpacity="0.4"/></svg>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// TOP BAR — back + title + action
// ──────────────────────────────────────────────────────────────
function TopBar({ title, onBack, action, dark = false, sticky = true }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "8px 16px 12px",
      background: dark ? "transparent" : "var(--bg)",
      position: sticky ? "sticky" : "static", top: 0, zIndex: 4,
      flexShrink: 0,
    }}>
      {onBack && (
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 12,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          background: "var(--card)", border: "1px solid var(--line)",
        }}>{I.chevL(18)}</button>
      )}
      <h1 style={{
        flex: 1, fontSize: 17, fontWeight: 700, margin: 0,
        color: dark ? "#fff" : "var(--ink)",
      }}>{title}</h1>
      {action}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// STAR ROW
// ──────────────────────────────────────────────────────────────
function Stars({ value = 0, size = 14, max = 5, interactive, onChange }) {
  return (
    <div style={{ display: "inline-flex", gap: 2, color: "var(--accent-ink)" }}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.round(value);
        return (
          <button key={i} disabled={!interactive} onClick={() => onChange && onChange(i + 1)} style={{
            color: filled ? "var(--accent)" : "var(--line-2)",
            display: "inline-flex", padding: interactive ? 2 : 0,
            cursor: interactive ? "pointer" : "default",
          }}>{I.star(size, filled)}</button>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Mock map illustration (campus tile)
// ──────────────────────────────────────────────────────────────
function CampusMap({ height = 220, showRoute = true, pins = [], focusPin }) {
  return (
    <div className="map-canvas" style={{ width: "100%", height, position: "relative" }}>
      <div className="map-grid" />
      {/* roads */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <path d="M-5 35 Q 30 28, 55 45 T 110 60" stroke="rgba(0,0,0,0.18)" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M-5 35 Q 30 28, 55 45 T 110 60" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M40 -5 Q 45 35, 60 55 T 70 110" stroke="rgba(0,0,0,0.13)" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M40 -5 Q 45 35, 60 55 T 70 110" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* buildings */}
        <rect x="15" y="20" width="14" height="10" rx="1.5" fill="oklch(0.88 0.02 270)" stroke="rgba(0,0,0,0.1)" strokeWidth="0.4"/>
        <rect x="62" y="22" width="10" height="14" rx="1.5" fill="oklch(0.9 0.025 55)" stroke="rgba(0,0,0,0.1)" strokeWidth="0.4"/>
        <rect x="48" y="62" width="18" height="12" rx="1.5" fill="oklch(0.88 0.02 165)" stroke="rgba(0,0,0,0.1)" strokeWidth="0.4"/>
        <rect x="22" y="70" width="12" height="10" rx="1.5" fill="oklch(0.9 0.018 270)" stroke="rgba(0,0,0,0.1)" strokeWidth="0.4"/>
        <rect x="78" y="78" width="14" height="10" rx="1.5" fill="oklch(0.9 0.02 90)" stroke="rgba(0,0,0,0.1)" strokeWidth="0.4"/>
        {/* route dashed */}
        {showRoute && (
          <path d="M22 25 Q 35 35, 45 50 T 67 72" stroke="var(--primary)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeDasharray="3 2.5" />
        )}
      </svg>
      {/* pins */}
      {pins.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
          transform: "translate(-50%, -100%)",
        }}>
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          }}>
            <div style={{
              padding: "4px 9px", borderRadius: 999,
              background: p.color || "var(--ink)",
              color: "#fff", fontSize: 10.5, fontWeight: 700, whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
            }}>{p.label}</div>
            <div style={{
              width: 0, height: 0,
              borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
              borderTop: `6px solid ${p.color || "var(--ink)"}`,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
            }} />
          </div>
        </div>
      ))}
      {/* you-are-here */}
      <div style={{
        position: "absolute", left: "22%", top: "26%",
        transform: "translate(-50%, -50%)",
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "var(--accent)", opacity: 0.25,
          position: "absolute", inset: -6,
          animation: "daniv-pulse 1.6s ease-out infinite",
        }} />
        <div style={{
          width: 14, height: 14, borderRadius: "50%",
          background: "var(--accent)",
          border: "3px solid #fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }} />
      </div>
    </div>
  );
}

// pulse keyframes (injected once)
if (typeof document !== "undefined" && !document.getElementById("daniv-anims")) {
  const s = document.createElement("style");
  s.id = "daniv-anims";
  s.textContent = `
    @keyframes daniv-pulse { 0%{transform:scale(.6);opacity:.5} 100%{transform:scale(1.6);opacity:0} }
    @keyframes daniv-fade { from{opacity:0; transform:translateY(6px)} to{opacity:1; transform:none} }
    .daniv-enter > * { animation: daniv-fade .35s ease both; }
    .daniv-enter > *:nth-child(2){ animation-delay:.05s }
    .daniv-enter > *:nth-child(3){ animation-delay:.1s }
    .daniv-enter > *:nth-child(4){ animation-delay:.15s }
    .daniv-enter > *:nth-child(5){ animation-delay:.2s }
    .daniv-enter > *:nth-child(6){ animation-delay:.25s }
  `;
  document.head.appendChild(s);
}

// ──────────────────────────────────────────────────────────────
// PHONE SHELL — replaces full iOS bezel with simple frame wrapper
// (uses real bezel from ios-frame.jsx separately when needed)
// ──────────────────────────────────────────────────────────────
function Phone({ children, dark = false }) {
  return (
    <div className={"daniv" + (dark ? " dark" : "")} style={{
      width: "100%", height: "100%",
      position: "relative", overflow: "hidden",
    }}>
      <StatusBar dark={dark} />
      {children}
    </div>
  );
}

Object.assign(window, { I, Wordmark, TabBar, StatusBar, TopBar, Stars, CampusMap, Phone });
