// MY 페이지 전용 API — 내 리뷰 / 즐겨찾기 / 리워드 보관함.
import { apiClient } from './client';
import type { Review, Favorite, FavoriteTarget, RewardRedemption } from '@/types/domain';

export type AddFavoriteRequest = {
  targetType: FavoriteTarget;
  targetId: string;
  targetName: string;
  targetMeta?: string;
  imageLabel?: string;
};

export const meApi = {
  // 내가 작성한 리뷰 (식당명 포함)
  reviews: async (): Promise<Array<Review & { restaurantName: string }>> => {
    const { data } = await apiClient.get<Array<Review & { restaurantName: string }>>('/me/reviews');
    return data;
  },

  // 즐겨찾기
  favorites: async (): Promise<Favorite[]> => {
    const { data } = await apiClient.get<Favorite[]>('/me/favorites');
    return data;
  },

  addFavorite: async (req: AddFavoriteRequest): Promise<Favorite> => {
    const { data } = await apiClient.post<Favorite>('/me/favorites', req);
    return data;
  },

  removeFavorite: async (id: string): Promise<{ ok: true }> => {
    const { data } = await apiClient.delete<{ ok: true }>(`/me/favorites/${id}`);
    return data;
  },

  // 리워드 교환 내역
  redemptions: async (): Promise<RewardRedemption[]> => {
    const { data } = await apiClient.get<RewardRedemption[]>('/me/redemptions');
    return data;
  },

  useRedemption: async (id: string): Promise<RewardRedemption> => {
    const { data } = await apiClient.patch<RewardRedemption>(`/me/redemptions/${id}/use`);
    return data;
  },
};
