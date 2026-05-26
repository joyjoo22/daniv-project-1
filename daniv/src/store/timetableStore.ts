// 시간표 스토어 — 사용자별 강의 일정 관리.
// localStorage 영속화 → 새로고침해도 유지.
// 초기값은 MOCK_TIMETABLE 시드.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TimetableClass } from '@/types/domain';
import { MOCK_TIMETABLE } from '@/data/mock';

type ClassDraft = Omit<TimetableClass, 'id' | 'isNext'>;

type TimetableState = {
  classes: TimetableClass[];

  add: (draft: ClassDraft) => TimetableClass;
  update: (id: string, patch: Partial<ClassDraft>) => void;
  remove: (id: string) => void;

  /** 모든 강의 삭제 (학기 초기화) */
  clear: () => void;

  /** 시드 데이터로 리셋 */
  resetToSeed: () => void;
};

// 카테고리별 기본 색상 — 시안 토큰과 일치.
export const CATEGORY_COLOR: Record<TimetableClass['category'], string> = {
  전공: 'var(--primary)',
  교양: 'oklch(0.74 0.16 55)',
  체육: 'oklch(0.62 0.13 165)',
};

export const useTimetableStore = create<TimetableState>()(
  persist(
    (set, get) => ({
      classes: MOCK_TIMETABLE,

      add: (draft) => {
        const newClass: TimetableClass = {
          id: `tt-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
          ...draft,
        };
        set({ classes: [...get().classes, newClass] });
        return newClass;
      },

      update: (id, patch) => {
        set({
          classes: get().classes.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        });
      },

      remove: (id) => {
        set({ classes: get().classes.filter((c) => c.id !== id) });
      },

      clear: () => set({ classes: [] }),

      resetToSeed: () => set({ classes: MOCK_TIMETABLE }),
    }),
    {
      name: 'daniv:timetable',
      version: 1,
    },
  ),
);
