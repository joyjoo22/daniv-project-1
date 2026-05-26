// OAuth 소셜 로그인 버튼 — 시안 LoginScreen의 OAuthBtn 이식.
// 카카오/구글 등 외부 OAuth 진입 버튼.
import type { ReactNode } from 'react';

type OAuthButtonProps = {
  name: string;
  color: string;
  ink: string;
  border?: boolean;
  emoji?: ReactNode;
  onClick?: () => void;
};

export function OAuthButton({ name, color, ink, border = false, emoji, onClick }: OAuthButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        height: 52,
        borderRadius: 18,
        background: color,
        color: ink,
        border: border ? '1px solid var(--line)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        fontSize: 15,
        fontWeight: 600,
      }}
    >
      {emoji}
      {name}
    </button>
  );
}

/** Google 멀티컬러 로고 (시안 그대로) */
export function GoogleEmoji() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.3c1.9-1.8 3-4.4 3-7.4Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 5-1 6.7-2.4l-3.3-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.5-4.1H3v2.6A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path d="M6.5 13.9a6 6 0 0 1 0-3.8V7.5H3a10 10 0 0 0 0 9l3.5-2.6Z" fill="#FBBC05" />
      <path
        d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9C16.9 2.9 14.7 2 12 2A10 10 0 0 0 3 7.5l3.5 2.6C7.2 7.7 9.4 6 12 6Z"
        fill="#EA4335"
      />
    </svg>
  );
}
