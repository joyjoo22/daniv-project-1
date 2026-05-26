// Open-Meteo — 무료, 키 불필요, CORS 지원하는 공개 날씨 API.
// 기상청 단기예보 API 는 한국 공공 API 라 CORS 가 없어 백엔드 프록시 필요.
// 그 사이의 stop-gap 으로 Open-Meteo 를 클라이언트에서 직접 호출.
//
// 사용처: weatherApi.current() 에서 백엔드(MSW mock) 응답이 mock 마커를 가질 때만 fallback.
import axios from 'axios';
import type { Weather } from '@/types/domain';
import { JUKJEON_CAMPUS } from './env';

type OpenMeteoResponse = {
  current?: {
    temperature_2m: number;
    weather_code: number;
    precipitation: number;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
  };
};

// WMO weather code → 간단한 한국어 설명
function describe(code: number): string {
  if (code === 0) return '맑음';
  if (code <= 3) return '구름조금';
  if (code <= 48) return '안개';
  if (code <= 67) return '비';
  if (code <= 77) return '눈';
  if (code <= 82) return '소나기';
  if (code <= 99) return '뇌우';
  return '흐림';
}

export async function fetchOpenMeteoWeather(
  lat: number = JUKJEON_CAMPUS.lat,
  lng: number = JUKJEON_CAMPUS.lng,
): Promise<Weather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,precipitation&hourly=temperature_2m&timezone=Asia%2FSeoul&forecast_days=1`;
  const { data } = await axios.get<OpenMeteoResponse>(url, { timeout: 6000 });

  const current = data.current;
  const hourlyTimes = data.hourly?.time ?? [];
  const hourlyTemps = data.hourly?.temperature_2m ?? [];

  // 현재 시각 이후 3,6,9,12시간 뒤 샘플링
  const now = new Date();
  const offsets = [3, 6, 9, 12];
  const hourly = offsets.flatMap((off) => {
    const target = new Date(now.getTime() + off * 3600 * 1000);
    const idx = hourlyTimes.findIndex((t) => {
      const time = new Date(t);
      return Math.abs(time.getTime() - target.getTime()) < 30 * 60 * 1000;
    });
    if (idx < 0) return [];
    const date = new Date(hourlyTimes[idx]);
    return [{ hour: `${date.getHours()}시`, temp: Math.round(hourlyTemps[idx]) }];
  });

  return {
    campus: 'jukjeon',
    temp: Math.round(current?.temperature_2m ?? 0),
    description: describe(current?.weather_code ?? 0),
    precipitation: Math.round(current?.precipitation ?? 0),
    hourly,
  };
}
