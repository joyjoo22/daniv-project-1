// "준비 중" 토스트 헬퍼 — 백엔드 / 기능이 아직 없는 버튼에 일관된 피드백을 제공.
//
// 사용:
//   const comingSoon = useComingSoon();
//   <button onClick={comingSoon}>...</button>
//
//   // 또는 커스텀 메시지:
//   <button onClick={() => comingSoon('이 기능은 곧 추가될 예정이에요')}>...</button>
import { useCallback } from 'react';
import { useUIStore } from '@/store/uiStore';

export function useComingSoon() {
  const pushToast = useUIStore((s) => s.pushToast);
  return useCallback(
    (message: string = '아직 준비 중인 기능이에요 🛠') => {
      pushToast(message, 'info');
    },
    [pushToast],
  );
}
