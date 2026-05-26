// 네이버 지도 v3 SDK 동적 로더.
// 키가 있을 때만 script 태그를 head 에 삽입하고, 로드 완료 시 resolve.
// 중복 로드 방지를 위해 한 번만 로드되고 이후 호출은 기존 Promise 를 재사용.
import { ENV } from './env';

let loaderPromise: Promise<void> | null = null;

export function loadNaverMaps(): Promise<void> {
  if (typeof window !== 'undefined' && window.naver?.maps) {
    return Promise.resolve();
  }

  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise((resolve, reject) => {
    if (!ENV.naverMapClientId) {
      reject(new Error('Naver Maps client ID is not configured.'));
      loaderPromise = null;
      return;
    }

    const script = document.createElement('script');
    // NCP 신규 키 체계에서는 ncpKeyId 파라미터 사용.
    // (구 Naver Developers 의 ncpClientId 는 deprecated)
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${ENV.naverMapClientId}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loaderPromise = null;
      reject(new Error('Failed to load Naver Maps SDK.'));
    };
    document.head.appendChild(script);
  });

  return loaderPromise;
}
