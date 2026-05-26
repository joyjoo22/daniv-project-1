// 어드민 전용 API — 리뷰 신고 + 사용자 관리.
import { apiClient } from './client';
import type { ReviewReport, ReportStatus, AdminUser } from '@/types/domain';

export const reportsApi = {
  list: async (status?: ReportStatus): Promise<ReviewReport[]> => {
    const { data } = await apiClient.get<ReviewReport[]>('/admin/reports', {
      params: status ? { status } : undefined,
    });
    return data;
  },

  resolve: async (id: string, status: Exclude<ReportStatus, 'pending'>): Promise<ReviewReport> => {
    const { data } = await apiClient.patch<ReviewReport>(`/admin/reports/${id}`, { status });
    return data;
  },

  remove: async (id: string): Promise<{ ok: true }> => {
    const { data } = await apiClient.delete<{ ok: true }>(`/admin/reports/${id}`);
    return data;
  },
};

export const usersApi = {
  list: async (q?: string): Promise<AdminUser[]> => {
    const { data } = await apiClient.get<AdminUser[]>('/admin/users', {
      params: q ? { q } : undefined,
    });
    return data;
  },

  toggleAdmin: async (id: string, isAdmin: boolean): Promise<AdminUser> => {
    const { data } = await apiClient.patch<AdminUser>(`/admin/users/${id}`, { isAdmin });
    return data;
  },

  toggleSuspend: async (id: string, isSuspended: boolean): Promise<AdminUser> => {
    const { data } = await apiClient.patch<AdminUser>(`/admin/users/${id}`, { isSuspended });
    return data;
  },

  remove: async (id: string): Promise<{ ok: true }> => {
    const { data } = await apiClient.delete<{ ok: true }>(`/admin/users/${id}`);
    return data;
  },
};
