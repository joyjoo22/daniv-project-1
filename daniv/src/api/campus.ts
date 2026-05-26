// 캠퍼스 정보 API — 시간표 + 날씨 + 교통.
//
// 날씨: Open-Meteo (무료/CORS) 우선 시도 → 실패 시 백엔드(MSW mock) fallback.
// 교통: 한국 공공 API 는 CORS 미지원이라 백엔드(MSW mock) 만 사용. 키는 백엔드 서버에서 사용.
import { apiClient } from './client';
import type { TimetableClass, Weather, TransitArrival } from '@/types/domain';
import { fetchOpenMeteoWeather } from '@/lib/openMeteo';
import { JUKJEON_CAMPUS } from '@/lib/env';

export const timetableApi = {
  list: async (): Promise<TimetableClass[]> => {
    const { data } = await apiClient.get<TimetableClass[]>('/timetable');
    return data;
  },
};

export const weatherApi = {
  current: async (campus: string = 'jukjeon'): Promise<Weather> => {
    // 1차 시도: Open-Meteo (무료, 키 불필요, CORS 지원).
    try {
      return await fetchOpenMeteoWeather(JUKJEON_CAMPUS.lat, JUKJEON_CAMPUS.lng);
    } catch {
      // 2차 fallback: 백엔드 (MSW mock 또는 실제 기상청 API 프록시).
      const { data } = await apiClient.get<Weather>('/weather', { params: { campus } });
      return data;
    }
  },
};

export const transitApi = {
  bus: async (route: string = '24'): Promise<TransitArrival> => {
    const { data } = await apiClient.get<TransitArrival>(`/transit/bus/${route}`);
    return data;
  },

  subway: async (station: string = 'jukjeon'): Promise<TransitArrival> => {
    const { data } = await apiClient.get<TransitArrival>(`/transit/subway/${station}`);
    return data;
  },
};
