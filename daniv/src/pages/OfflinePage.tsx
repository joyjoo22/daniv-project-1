// 오프라인 폴백 페이지 — 네트워크 단절 시 표시.
//
// App 전체에서 `online` 이벤트를 감지해 자동으로 보여주는 것은 RouterProvider 외부에서
// 처리 (App.tsx). 이 페이지는 직접 라우팅(/offline)으로도 접근 가능.
import { useNavigate } from 'react-router-dom';
import { Button, Wordmark, ArrowRightIcon } from '@/components/ui';

export default function OfflinePage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        flex: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        background: 'var(--bg)',
        textAlign: 'center',
      }}
    >
      <div style={{ marginBottom: 32 }}>
        <Wordmark size={32} />
      </div>

      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: '50%',
          background: 'var(--bg-2)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}
        aria-hidden
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 1l22 22" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
          <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <circle cx="12" cy="20" r="0.5" fill="currentColor" />
        </svg>
      </div>

      <h1
        style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: '-0.03em',
        }}
      >
        오프라인 상태예요
      </h1>
      <p
        style={{
          margin: '10px 0 0',
          fontSize: 14,
          color: 'var(--ink-3)',
          lineHeight: 1.6,
          maxWidth: 320,
        }}
      >
        인터넷 연결을 확인해주세요. 일부 화면은 캐시된 데이터로 계속 볼 수 있어요.
      </p>

      <div style={{ marginTop: 32, width: '100%', maxWidth: 280, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Button variant="primary" onClick={() => window.location.reload()}>
          다시 시도
          <ArrowRightIcon size={16} />
        </Button>
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            height: 44,
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--ink-3)',
            background: 'transparent',
          }}
        >
          홈으로 가기
        </button>
      </div>
    </div>
  );
}
