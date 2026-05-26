// 동아리 API (관리자 CRUD 포함)
import { apiClient } from './client';
import type { Club } from '@/types/domain';

export type ListClubsParams = {
  category?: string;
  recruiting?: boolean;
};

export type CreateClubRequest = {
  name: string;
  category: Club['category'];
  buildingId: string;
  buildingName: string;
  room: string;
  status?: Club['status'];
  recruiting?: boolean;
  instagram?: string;
  description?: string;
  president?: string;
  meeting?: string;
  fee?: number;
  logoColor?: string;
};

export type UpdateClubRequest = Partial<CreateClubRequest>;

export const clubsApi = {
  list: async (params?: ListClubsParams): Promise<Club[]> => {
    const { data } = await apiClient.get<Club[]>('/clubs', { params });
    return data;
  },

  detail: async (id: string): Promise<Club> => {
    const { data } = await apiClient.get<Club>(`/clubs/${id}`);
    return data;
  },

  apply: async (id: string): Promise<{ ok: true }> => {
    const { data } = await apiClient.post<{ ok: true }>(`/clubs/${id}/apply`);
    return data;
  },

  // ─── ADMIN ───
  create: async (req: CreateClubRequest): Promise<Club> => {
    const { data } = await apiClient.post<Club>('/clubs', req);
    return data;
  },

  update: async (id: string, req: UpdateClubRequest): Promise<Club> => {
    const { data } = await apiClient.patch<Club>(`/clubs/${id}`, req);
    return data;
  },

  remove: async (id: string): Promise<{ ok: true }> => {
    const { data } = await apiClient.delete<{ ok: true }>(`/clubs/${id}`);
    return data;
  },
};
