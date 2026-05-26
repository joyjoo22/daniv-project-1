// 단이브 도메인 타입 — 의뢰서 §데이터 모델 기반.
// PHASE 5 에서 백엔드 API 응답과 일치하도록 정리 예정.

export type Campus = 'jukjeon' | 'cheonan';

export type User = {
  id: string;
  email: string;
  nickname: string;
  department: string;
  studentId: string;
  avatar?: string;
  level: number;
  joinedAt: string;
};

export type TimetableClass = {
  id: string;
  day: 0 | 1 | 2 | 3 | 4;
  start: number;  // 09.0 ~ 17.5 (0.5 단위)
  end: number;
  name: string;
  professor?: string;
  building: string;
  room: string;
  color: string;
  category: '전공' | '교양' | '체육';
  isNext?: boolean;
};

export type Restaurant = {
  id: string;
  name: string;
  category: string;          // "한식 · 김치찌개"
  price: '₩' | '₩₩' | '₩₩₩';
  walkMin: number;
  rating: number;
  reviewCount: number;
  hot?: boolean;
  hasStamp: boolean;
  imageLabel: string;
  hours: string;
  phone: string;
};

export type Review = {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  userTag: string;            // "컴공 25학번"
  rating: number;
  body: string;
  photos?: string[];
  tags?: string[];            // ["맛있어요", "가성비"] 등
  createdAt: string;          // "2일 전" 등 표시 문자열 (PHASE 5 에서 ISO로 교체)
};

export type Stamp = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  earnedAt: string;
  color: string;
  obtained: boolean;
};

export type Reward = {
  id: string;
  name: string;
  pointsRequired: number;
  stock: number;
  color: string;
};

export type Club = {
  id: string;
  name: string;
  category: '문화/예술' | '체육' | '학술' | '봉사' | '취미';
  buildingId: string;
  buildingName: string;
  room: string;
  members: number;
  status: '활성' | '검토중' | '비활성';
  recruiting: boolean;
  awards: number;
  instagram?: string;
  description?: string;
  president?: string;
  meeting?: string;
  fee?: number;
  logoColor?: string;
};

export type Building = {
  id: string;
  code: string;          // "B11"
  name: string;
  campus: Campus;
  walkMin: number;
  floors: string;        // "지하 1층 ~ 지상 4층"
  lat?: number;          // GPS 위도
  lng?: number;          // GPS 경도
};

export type CafeteriaMenu = {
  id: string;
  buildingId: string;
  corner: string;        // "한식 A"
  menu: string;
  price: number;
  soldOut: boolean;
  quantity: number;
  sold: number;
  hot?: boolean;
};

export type WeatherForecast = {
  hour: string;
  temp: number;
};

export type Weather = {
  campus: Campus;
  temp: number;
  description: string;
  precipitation: number;
  hourly: WeatherForecast[];
};

export type EventCategory = '축제' | '학사' | '공지' | '동아리' | '기타';

export type CampusEvent = {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  campus?: Campus;
  startAt: string;        // 표시용 문자열 — "2025-05-21 (수)" 또는 ISO
  endAt?: string;
  location?: string;
  coverEmoji?: string;
  linkUrl?: string;
  isPinned?: boolean;
};

export type TransitArrival = {
  route: string;
  destination: string;
  minutes: number[];
};

// 어드민용 — 리뷰 신고
export type ReportReason = '명예훼손' | '욕설/혐오' | '광고/스팸' | '허위 정보' | '기타';
export type ReportStatus = 'pending' | 'hidden' | 'rejected';

export type ReviewReport = {
  id: string;
  reviewId: string;
  reporterId: string;
  reporterName: string;
  reason: ReportReason;
  detail?: string;
  createdAt: string;
  status: ReportStatus;
  /** 신고 시점의 리뷰 스냅샷 (원본 변경/삭제 시 컨텍스트 보존) */
  reviewSnapshot: {
    restaurantId: string;
    restaurantName: string;
    userName: string;
    rating: number;
    body: string;
  };
};

// MY — 즐겨찾기
export type FavoriteTarget = 'restaurant' | 'club' | 'building';
export type Favorite = {
  id: string;
  userId: string;
  targetType: FavoriteTarget;
  targetId: string;
  targetName: string;
  targetMeta?: string;            // 카테고리/위치 같은 부가 설명
  imageLabel?: string;
  createdAt: string;
};

// MY — 리워드 보관함 (교환 내역)
export type RewardRedemption = {
  id: string;
  rewardId: string;
  rewardName: string;
  rewardColor: string;
  pointsSpent: number;
  redeemedAt: string;             // "2일 전" 등 표시 문자열
  couponCode: string;
  expiresAt: string;              // "2025-05-21 까지"
  isUsed: boolean;
};

// 어드민용 — 사용자 (auth.users + profiles 조인 시뮬레이션)
export type AdminUser = {
  id: string;
  email: string;
  nickname: string;
  department: string;
  studentId: string;
  level: number;
  campus: Campus;
  isAdmin: boolean;
  isSuspended: boolean;
  joinedAt: string;
  lastSeenAt: string;
  // 활동 요약
  totalPoints: number;
  reviewCount: number;
  stampCount: number;
};
