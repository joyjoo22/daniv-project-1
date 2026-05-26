// 포인트 + 스탬프 + 리워드 API (관리자 리워드 CRUD 포함)
import { apiClient } from './client';
import type { Stamp, Reward } from '@/types/domain';

export type PointsSummary = {
  total: number;
  goal: number;
};

export type CreateRewardRequest = {
  name: string;
  pointsRequired: number;
  stock: number;
  color: string;
};

export type UpdateRewardRequest = Partial<CreateRewardRequest>;

export const pointsApi = {
  summary: async (): Promise<PointsSummary> => {
    const { data } = await apiClient.get<PointsSummary>('/points');
    return data;
  },

  stamps: async (): Promise<Stamp[]> => {
    const { data } = await apiClient.get<Stamp[]>('/stamps');
    return data;
  },

  earnStamp: async (restaurantId: string): Promise<Stamp> => {
    const { data } = await apiClient.post<Stamp>('/stamps', { restaurantId });
    return data;
  },

  rewards: async (): Promise<Reward[]> => {
    const { data } = await apiClient.get<Reward[]>('/rewards');
    return data;
  },

  redeemReward: async (rewardId: string): Promise<{ ok: true; remainingPoints: number }> => {
    const { data } = await apiClient.post<{ ok: true; remainingPoints: number }>(
      `/rewards/${rewardId}/redeem`,
    );
    return data;
  },

  // ─── ADMIN: REWARDS ───
  createReward: async (req: CreateRewardRequest): Promise<Reward> => {
    const { data } = await apiClient.post<Reward>('/rewards', req);
    return data;
  },

  updateReward: async (id: string, req: UpdateRewardRequest): Promise<Reward> => {
    const { data } = await apiClient.patch<Reward>(`/rewards/${id}`, req);
    return data;
  },

  removeReward: async (id: string): Promise<{ ok: true }> => {
    const { data } = await apiClient.delete<{ ok: true }>(`/rewards/${id}`);
    return data;
  },
};
