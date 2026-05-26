// 환경변수 + 외부 API 키 감지 유틸.
// 키가 있을 때만 외부 API를 호출, 없으면 MSW mock 으로 fallback 되도록 분기에 사용.

const trim = (v?: string) => (v ?? '').trim();

export const ENV = {
  apiBaseUrl: trim(import.meta.env.VITE_API_BASE_URL) || 'http://localhost:3000',
  naverMapClientId: trim(import.meta.env.VITE_NAVER_MAP_CLIENT_ID),
  weatherApiKey: trim(import.meta.env.VITE_WEATHER_API_KEY),
  gbusApiKey: trim(import.meta.env.VITE_GBUS_API_KEY),
  subwayApiKey: trim(import.meta.env.VITE_SUBWAY_API_KEY),
  supabaseUrl: trim(import.meta.env.VITE_SUPABASE_URL),
  supabaseAnonKey: trim(import.meta.env.VITE_SUPABASE_ANON_KEY),
} as const;

export const hasNaverMaps = (): boolean => ENV.naverMapClientId.length > 0;
export const hasWeatherApi = (): boolean => ENV.weatherApiKey.length > 0;
export const hasGbusApi = (): boolean => ENV.gbusApiKey.length > 0;
export const hasSubwayApi = (): boolean => ENV.subwayApiKey.length > 0;
export const hasSupabase = (): boolean =>
  ENV.supabaseUrl.length > 0 && ENV.supabaseAnonKey.length > 0;

// 죽전 캠퍼스 중심 좌표 — 네이버 지도 기본 중심점.
export const JUKJEON_CAMPUS = {
  lat: 37.3217,
  lng: 127.1265,
} as const;
