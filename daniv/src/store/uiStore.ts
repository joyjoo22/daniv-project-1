// UI 스토어 — 글로벌 토스트/모달 등의 휘발성 UI 상태.
import { create } from 'zustand';

type Toast = {
  id: string;
  message: string;
  variant?: 'success' | 'error' | 'info';
};

type UIState = {
  toasts: Toast[];
  pushToast: (message: string, variant?: Toast['variant']) => void;
  dismissToast: (id: string) => void;
};

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  pushToast: (message, variant = 'info') => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    set((s) => ({ toasts: [...s.toasts, { id, message, variant }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 2800);
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
