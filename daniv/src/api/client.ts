// Axios 인스턴스 — 모든 API 요청의 기본 클라이언트.
// JWT 자동 첨부 + 401 발생 시 로그아웃 처리.
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터 — localStorage 의 JWT 토큰 자동 첨부.
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('daniv:token') : null;
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// Response 인터셉터 — 401 발생 시 토큰 폐기.
// 리프레시 토큰 플로우는 PHASE 5 에서 추가.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.localStorage.removeItem('daniv:token');
    }
    return Promise.reject(error);
  },
);

export type ApiError = AxiosError<{ message?: string; code?: string }>;
