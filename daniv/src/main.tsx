import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

const RELOAD_FLAG = 'daniv:reloaded-after-sw-cleanup';

/**
 * 1단계 — Stale PWA Service Worker 정리.
 *
 * 이전에 production 빌드를 한번 실행한 적이 있으면 (npm run preview),
 * PWA SW (sw.js) 가 브라우저에 등록되어 현재 페이지의 fetch 를 가로채고 있음.
 * 이 상태에서 MSW SW 를 register 해도 현재 페이지의 controller 는 안 바뀜
 * → fetch 가 stale PWA SW 로 가서 :3000 으로 빠져나감 → ERR_CONNECTION_REFUSED.
 *
 * 해결: stale SW 를 unregister 한 다음 1회 새로고침 → 새 페이지 로드부터 MSW 가 활성.
 * sessionStorage 플래그로 무한 reload 방지.
 *
 * @returns true 면 reload 가 트리거됨 → 호출자는 더 이상 진행 안 해야 함
 */
async function cleanStaleServiceWorkersAndReloadIfNeeded(): Promise<boolean> {
  if (import.meta.env.MODE !== 'development') return false;
  if (typeof navigator === 'undefined' || !navigator.serviceWorker) return false;

  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    let removedAny = false;

    for (const reg of regs) {
      const scriptUrl =
        reg.active?.scriptURL ||
        reg.installing?.scriptURL ||
        reg.waiting?.scriptURL ||
        '';
      // MSW worker 는 보존, 그 외 (PWA SW 등) 제거.
      if (scriptUrl.includes('mockServiceWorker.js')) continue;
      await reg.unregister();
      removedAny = true;
      console.warn('[Daniv] stale service worker unregistered:', scriptUrl);
    }

    if (removedAny && !sessionStorage.getItem(RELOAD_FLAG)) {
      sessionStorage.setItem(RELOAD_FLAG, '1');
      console.log('%c[Daniv] Stale SW 정리 완료 — MSW 활성화를 위해 자동 새로고침합니다.', 'color:#c14a3c;font-weight:bold');
      window.location.reload();
      return true;
    }
  } catch (err) {
    console.warn('[Daniv] SW 정리 중 오류 (무시 가능):', err);
  }
  return false;
}

/**
 * 2단계 — MSW 시작.
 */
async function enableMocking() {
  if (import.meta.env.MODE !== 'development') return;
  try {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest(req, print) {
        const url = new URL(req.url);
        if (url.origin === window.location.origin) return;
        const KNOWN_HOST_SUFFIXES = [
          '.naver.com',
          '.naver.net',
          '.pstatic.net',
          '.open-meteo.com',
          '.jsdelivr.net',
          '.googleapis.com',
          '.gstatic.com',
          '.supabase.co',
          '.supabase.in',
        ];
        if (KNOWN_HOST_SUFFIXES.some((suffix) => url.hostname.endsWith(suffix))) return;
        print.warning();
      },
      quiet: false,
    });
    console.log(
      '%c[Daniv]%c MSW 모킹 서버 활성화',
      'background:#2a1f5c;color:#fff;padding:2px 6px;border-radius:4px',
      'color:inherit',
    );
  } catch (err) {
    console.error(
      '[Daniv] ❌ MSW 시작 실패. /admin/* 같은 페이지의 API 호출이 실패할 수 있어요.',
      err,
    );
  }
}

/**
 * 3단계 — React 렌더링.
 */
function render() {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

/**
 * App 부트스트랩 — 순서대로 실행.
 * SW 정리 후 reload 되는 경우엔 함수 자체가 중단되므로 enableMocking/render 가 호출되지 않음.
 */
(async function bootstrap() {
  const willReload = await cleanStaleServiceWorkersAndReloadIfNeeded();
  if (willReload) return;
  await enableMocking();
  render();
})();
