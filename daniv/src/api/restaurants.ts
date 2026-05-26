// 음식점 + 리뷰 API (관리자 CRUD 포함)
import { apiClient } from './client';
import type { Restaurant, Review } from '@/types/domain';

export type ListRestaurantsParams = {
  category?: string;
  sort?: 'distance' | 'rating' | 'reviews';
};

export type CreateReviewRequest = {
  restaurantId: string;
  rating: number;
  body: string;
  tags?: string[];
  photos?: string[];
};

// 관리자용 — 신규 음식점 등록 시 필요한 필드.
export type CreateRestaurantRequest = {
  name: string;
  category: string;
  price: Restaurant['price'];
  walkMin: number;
  hours: string;
  phone: string;
  imageLabel: string;
  hasStamp: boolean;
  hot?: boolean;
};

export type UpdateRestaurantRequest = Partial<CreateRestaurantRequest>;

export const restaurantsApi = {
  list: async (params?: ListRestaurantsParams): Promise<Restaurant[]> => {
    const { data } = await apiClient.get<Restaurant[]>('/restaurants', { params });
    return data;
  },

  detail: async (id: string): Promise<Restaurant> => {
    const { data } = await apiClient.get<Restaurant>(`/restaurants/${id}`);
    return data;
  },

  reviews: async (restaurantId: string): Promise<Review[]> => {
    const { data } = await apiClient.get<Review[]>(`/restaurants/${restaurantId}/reviews`);
    return data;
  },

  createReview: async (req: CreateReviewRequest): Promise<Review> => {
    const { data } = await apiClient.post<Review>(`/restaurants/${req.restaurantId}/reviews`, req);
    return data;
  },

  // ─── ADMIN ───
  create: async (req: CreateRestaurantRequest): Promise<Restaurant> => {
    const { data } = await apiClient.post<Restaurant>('/restaurants', req);
    return data;
  },

  update: async (id: string, req: UpdateRestaurantRequest): Promise<Restaurant> => {
    const { data } = await apiClient.patch<Restaurant>(`/restaurants/${id}`, req);
    return data;
  },

  remove: async (id: string): Promise<{ ok: true }> => {
    const { data } = await apiClient.delete<{ ok: true }>(`/restaurants/${id}`);
    return data;
  },
};
