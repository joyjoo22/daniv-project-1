// 포인트/스탬프 스토어 — 사용자 누적 포인트, 스탬프 목록.
import { create } from 'zustand';
import type { Stamp, Reward } from '@/types/domain';
import { pointsApi } from '@/api';

type PointsState = {
  total: number;
  goal: number;
  stamps: Stamp[];
  rewards: Reward[];
  isLoading: boolean;
  error: string | null;

  load: () => Promise<void>;
  earnStamp: (restaurantId: string) => Promise<void>;
  redeemReward: (rewardId: string) => Promise<void>;
};

export const usePointsStore = create<PointsState>((set, get) => ({
  total: 0,
  goal: 500,
  stamps: [],
  rewards: [],
  isLoading: false,
  error: null,

  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const [summary, stamps, rewards] = await Promise.all([
        pointsApi.summary(),
        pointsApi.stamps(),
        pointsApi.rewards(),
      ]);
      set({
        total: summary.total,
        goal: summary.goal,
        stamps,
        rewards,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false, error: '포인트 정보를 불러오지 못했어요.' });
    }
  },

  earnStamp: async (restaurantId) => {
    const stamp = await pointsApi.earnStamp(restaurantId);
    set({ stamps: [...get().stamps, stamp] });
  },

  redeemReward: async (rewardId) => {
    const { remainingPoints } = await pointsApi.redeemReward(rewardId);
    set({ total: remainingPoints });
  },
}));
