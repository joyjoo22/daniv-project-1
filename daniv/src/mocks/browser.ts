// MSW 브라우저 워커 — 개발 모드에서만 사용.
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
