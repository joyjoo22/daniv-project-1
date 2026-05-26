// PWA 설치 프롬프트 — beforeinstallprompt 이벤트 캡처 후 사용자 액션으로 설치.
//
// 동작:
//   1. 앱 마운트 시 window.addEventListener('beforeinstallprompt') 등록.
//   2. 브라우저가 설치 가능 판단 시 이벤트 발생 → e.preventDefault() 로 자동 표시 차단.
//   3. 우리 UI(하단 토스트형 카드)로 사용자에게 설치 권유.
//   4. "설치" 클릭 시 deferred event.prompt() 호출.
//   5. 사용자가 거부했거나 이미 설치된 경우 sessionStorage 에 기록해 같은 세션에서 재표시 X.
import { useEffect, useState } from 'react';
import { useUIStore } from '@/store/uiStore';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const DISMISS_KEY = 'daniv:installPromptDismissed';

function useViewportDesktop() {
  const [d, setD] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setD(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return d;
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const pushToast = useUIStore((s) => s.pushToast);
  const isDesktop = useViewportDesktop();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // 이번 세션 동안 dismiss 했다면 다시 띄우지 않음.
    if (sessionStorage.getItem(DISMISS_KEY)) return;
    // 이미 설치된 경우 (display-mode: standalone) 표시 안 함.
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!visible || !deferred) return null;

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(DISMISS_KEY, '1');
  };

  const install = async () => {
    try {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === 'accepted') {
        pushToast('단이브가 설치되었어요! 🎉', 'success');
      }
    } catch {
      pushToast('설치를 시작할 수 없어요.', 'error');
    } finally {
      setVisible(false);
      setDeferred(null);
    }
  };

  return (
    <div
      role="dialog"
      aria-label="앱 설치 안내"
      style={{
        position: 'fixed',
        zIndex: 90,
        // 모바일은 탭바 바로 위, 데스크탑은 우하단.
        bottom: isDesktop ? 20 : 'calc(var(--bottom-tab-h) + 12px)',
        right: isDesktop ? 20 : 12,
        left: isDesktop ? 'auto' : 12,
        maxWidth: isDesktop ? 380 : '100%',
        padding: 14,
        borderRadius: 18,
        background: 'var(--card)',
        boxShadow: 'var(--sh-3)',
        border: '1px solid var(--line)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        animation: 'daniv-fade .25s ease both',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: 'var(--primary)',
          color: '#fff',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          flexShrink: 0,
        }}
      >
        📲
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>단이브를 홈 화면에 설치</p>
        <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--ink-3)' }}>
          앱처럼 빠르게 실행하고 오프라인에서도 사용해요.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button
          type="button"
          onClick={dismiss}
          style={{
            padding: '8px 10px',
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--ink-4)',
            background: 'transparent',
          }}
        >
          나중에
        </button>
        <button
          type="button"
          onClick={install}
          style={{
            padding: '8px 14px',
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--bg)',
            background: 'var(--ink)',
          }}
        >
          설치
        </button>
      </div>
    </div>
  );
}
