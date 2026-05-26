// 건물 + 학식 메뉴 API (관리자 CRUD 포함)
import { apiClient } from './client';
import type { Building, CafeteriaMenu, Campus } from '@/types/domain';

export type CreateBuildingRequest = {
  code: string;
  name: string;
  campus: Campus;
  floors: string;
  walkMin: number;
  lat?: number;
  lng?: number;
};

export type UpdateBuildingRequest = Partial<CreateBuildingRequest>;

export const buildingsApi = {
  list: async (): Promise<Building[]> => {
    const { data } = await apiClient.get<Building[]>('/buildings');
    return data;
  },

  detail: async (id: string): Promise<Building> => {
    const { data } = await apiClient.get<Building>(`/buildings/${id}`);
    return data;
  },

  cafeteria: async (id: string): Promise<CafeteriaMenu[]> => {
    const { data } = await apiClient.get<CafeteriaMenu[]>(`/buildings/${id}/cafeteria`);
    return data;
  },

  toggleSoldOut: async (buildingId: string, menuId: string): Promise<CafeteriaMenu> => {
    const { data } = await apiClient.patch<CafeteriaMenu>(
      `/buildings/${buildingId}/cafeteria/${menuId}/sold-out`,
    );
    return data;
  },

  // ─── ADMIN ───
  create: async (req: CreateBuildingRequest): Promise<Building> => {
    const { data } = await apiClient.post<Building>('/buildings', req);
    return data;
  },

  update: async (id: string, req: UpdateBuildingRequest): Promise<Building> => {
    const { data } = await apiClient.patch<Building>(`/buildings/${id}`, req);
    return data;
  },

  remove: async (id: string): Promise<{ ok: true }> => {
    const { data } = await apiClient.delete<{ ok: true }>(`/buildings/${id}`);
    return data;
  },
};
