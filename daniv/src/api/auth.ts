// 인증 API
import { apiClient } from './client';
import type { User } from '@/types/domain';

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = {
  email: string;
  password: string;
  nickname: string;
  department: string;
  studentId: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export const authApi = {
  login: async (req: LoginRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', req);
    return data;
  },

  signup: async (req: SignupRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/signup', req);
    return data;
  },

  me: async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/auth/me');
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};
