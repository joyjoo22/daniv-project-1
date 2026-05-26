/** @type {import('tailwindcss').Config} */
// 시안 tokens.css의 CSS 변수를 Tailwind 토큰으로 매핑.
// 다크 모드는 <html class="dark"> 토글로 동작.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: 'var(--ink)',
          2: 'var(--ink-2)',
          3: 'var(--ink-3)',
          4: 'var(--ink-4)',
        },
        bg: {
          DEFAULT: 'var(--bg)',
          2: 'var(--bg-2)',
          3: 'var(--bg-3)',
        },
        card: 'var(--card)',
        primary: {
          DEFAULT: 'var(--primary)',
          soft: 'var(--primary-soft)',
          ink: 'var(--primary-ink)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          soft: 'var(--accent-soft)',
          ink: 'var(--accent-ink)',
        },
        mint: 'var(--mint)',
        rose: 'var(--rose)',
        sky: 'var(--sky)',
        line: {
          DEFAULT: 'var(--line)',
          2: 'var(--line-2)',
        },
        hero: {
          bg: 'var(--hero-bg)',
          bg2: 'var(--hero-bg-2)',
          fg: 'var(--hero-fg)',
        },
      },
      borderRadius: {
        xs: '8px',
        sm: '12px',
        md: '18px',
        lg: '22px',
        xl: '28px',
        pill: '9999px',
      },
      boxShadow: {
        sh1: 'var(--sh-1)',
        sh2: 'var(--sh-2)',
        sh3: 'var(--sh-3)',
      },
      fontFamily: {
        kr: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Apple SD Gothic Neo',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      letterSpacing: {
        tightest: '-0.03em',
        tighter: '-0.02em',
        tight: '-0.015em',
      },
      keyframes: {
        'daniv-pulse': {
          '0%': { transform: 'scale(0.6)', opacity: '0.5' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'daniv-fade': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'daniv-pulse': 'daniv-pulse 1.6s ease-out infinite',
        'daniv-fade': 'daniv-fade 0.35s ease both',
      },
    },
  },
  plugins: [],
};
