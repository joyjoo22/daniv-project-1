// 단이브 워드마크 — 시안 ui.jsx 의 Wordmark 그대로 이식.
// 인디고 큰 원 + 우하단 앰버 도트 + "단이브" 한글 워드마크.
type WordmarkProps = {
  size?: number;
  dark?: boolean;
};

export function Wordmark({ size = 28, dark = false }: WordmarkProps) {
  const ink = dark ? '#fff' : 'var(--ink)';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: ink }}>
      <span
        style={{
          width: size * 0.9,
          height: size * 0.9,
          borderRadius: '50%',
          background: 'var(--primary)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <span
          style={{
            width: size * 0.32,
            height: size * 0.32,
            borderRadius: '50%',
            background: 'var(--accent)',
            position: 'absolute',
            right: -size * 0.04,
            bottom: -size * 0.04,
            boxShadow: '0 0 0 2px var(--bg)',
          }}
        />
      </span>
      <span
        style={{
          fontSize: size,
          fontWeight: 800,
          letterSpacing: '-0.04em',
          lineHeight: 1,
        }}
      >
        단이브
      </span>
    </div>
  );
}
