/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_NAVER_MAP_CLIENT_ID: string;
  readonly VITE_WEATHER_API_KEY: string;
  readonly VITE_GBUS_API_KEY: string;
  readonly VITE_SUBWAY_API_KEY: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 네이버 지도 v3 전역 객체 — naver-maps SDK 로드 후 사용 가능.
declare global {
  interface Window {
    naver?: {
      maps: {
        Map: new (el: HTMLElement, opts: NaverMapOptions) => NaverMapInstance;
        LatLng: new (lat: number, lng: number) => NaverLatLng;
        Marker: new (opts: NaverMarkerOptions) => NaverMarker;
        Polyline: new (opts: NaverPolylineOptions) => NaverPolyline;
        Event: {
          addListener: (target: unknown, eventName: string, fn: (e: NaverMapEvent) => void) => void;
        };
      };
    };
    /** 네이버 지도 SDK 가 인증 실패 시 호출하는 전역 콜백 */
    navermap_authFailure?: () => void;
  }
}

type NaverLatLng = { lat(): number; lng(): number };
type NaverMapTypeId = 'normal' | 'satellite' | 'hybrid' | 'terrain';

type NaverMapOptions = {
  center: NaverLatLng;
  zoom: number;
  zoomControl?: boolean;
  mapTypeControl?: boolean;
  logoControl?: boolean;
  mapDataControl?: boolean;
  scaleControl?: boolean;
  mapTypeId?: NaverMapTypeId;
};
type NaverMapInstance = {
  setCenter(latlng: NaverLatLng): void;
  setZoom(zoom: number): void;
  destroy?(): void;
};
type NaverMarkerOptions = {
  position: NaverLatLng;
  map: NaverMapInstance;
  title?: string;
  icon?: { content: string; anchor?: unknown };
};
type NaverMarker = {
  setMap(map: NaverMapInstance | null): void;
  setPosition(latlng: NaverLatLng): void;
};
type NaverPolylineOptions = {
  path: NaverLatLng[];
  map: NaverMapInstance;
  strokeColor?: string;
  strokeWeight?: number;
  strokeStyle?: 'solid' | 'shortdash' | 'longdash';
};
type NaverPolyline = { setMap(map: NaverMapInstance | null): void };

// Naver Maps Event payload — click 이벤트에 coord 가 NaverLatLng 로 들어옴
type NaverMapEvent = {
  coord: NaverLatLng;
  point?: { x: number; y: number };
  pointerEvent?: PointerEvent;
};

export {};
