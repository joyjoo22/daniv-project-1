// 단이브 더미 시드 데이터 — 콜드스타트 문제 해결을 위해 풍부하게 작성.
// PHASE 5 에서 실제 API 응답으로 교체될 때 동일한 타입 시그니처를 유지.
import type {
  User,
  Restaurant,
  Review,
  Stamp,
  Reward,
  Club,
  Building,
  CafeteriaMenu,
  Weather,
  TransitArrival,
  TimetableClass,
  ReviewReport,
  AdminUser,
  Favorite,
  RewardRedemption,
  CampusEvent,
} from '@/types/domain';

export const MOCK_USER: User = {
  id: 'u-001',
  email: 'danpoong@dankook.ac.kr',
  nickname: '단풍이',
  department: '컴퓨터공학과',
  studentId: '25',
  level: 3,
  joinedAt: '2025-03-02',
};

export const MOCK_RESTAURANTS: Restaurant[] = [
  { id: 'r-1', name: '단풍식당',      category: '한식 · 김치찌개', price: '₩₩',  walkMin: 3, rating: 4.6, reviewCount: 128, hot: true,  hasStamp: true,  imageLabel: '한식', hours: '11–22시', phone: '031-...4421' },
  { id: 'r-2', name: '캠퍼스 라멘',   category: '일식 · 돈코츠',   price: '₩₩',  walkMin: 5, rating: 4.4, reviewCount: 87,  hasStamp: true,  imageLabel: '일식', hours: '11–21시', phone: '031-...8830' },
  { id: 'r-3', name: '정문 김밥천국', category: '분식',            price: '₩',   walkMin: 1, rating: 4.1, reviewCount: 210, hasStamp: false, imageLabel: '분식', hours: '24시간', phone: '031-...0021' },
  { id: 'r-4', name: 'STAFF COFFEE',  category: '카페 · 핸드드립', price: '₩₩',  walkMin: 4, rating: 4.7, reviewCount: 64,  hasStamp: true,  imageLabel: '카페', hours: '08–22시', phone: '031-...1240' },
  { id: 'r-5', name: '후문 닭갈비',   category: '한식 · 회식',     price: '₩₩₩', walkMin: 8, rating: 4.2, reviewCount: 156, hasStamp: true,  imageLabel: '한식', hours: '16–23시', phone: '031-...9911' },
  { id: 'r-6', name: '꽃피는 분식',   category: '분식',            price: '₩',   walkMin: 6, rating: 4.0, reviewCount: 92,  hasStamp: true,  imageLabel: '분식', hours: '10–20시', phone: '031-...4456' },
];

export const MOCK_REVIEWS: Review[] = [
  { id: 'rv-1', restaurantId: 'r-1', userId: 'u-101', userName: '민지',  userTag: '컴공 25학번',  rating: 5, body: '찌개가 매콤하고 양도 많아요. 학교에서 정말 가까워서 자주 가요!', photos: ['음식 사진', '실내 사진'], createdAt: '2일 전' },
  { id: 'rv-2', restaurantId: 'r-1', userId: 'u-102', userName: '준영',  userTag: '경영 24학번',  rating: 4, body: '가성비 좋고 사장님이 친절하세요. 평일 점심엔 줄 서서 대기 5분 정도.', createdAt: '5일 전' },
  { id: 'rv-3', restaurantId: 'r-2', userId: 'u-103', userName: '수아',  userTag: '디자인 25학번', rating: 4, body: '돈코츠 진하고 면 식감 좋아요. 양 보통.', createdAt: '1일 전' },
  { id: 'rv-4', restaurantId: 'r-4', userId: 'u-104', userName: '도윤',  userTag: '영문 24학번',  rating: 5, body: '원두 진짜 좋아요. 시험기간엔 자리 잡기 힘듦.', createdAt: '6시간 전' },
];

export const MOCK_STAMPS: Stamp[] = [
  { id: 's-1', restaurantId: 'r-1', restaurantName: '단풍식당',      earnedAt: '2025-03-10', color: 'var(--primary)',         obtained: true  },
  { id: 's-2', restaurantId: 'r-2', restaurantName: '캠퍼스 라멘',   earnedAt: '2025-03-09', color: 'oklch(0.62 0.16 18)',    obtained: true  },
  { id: 's-3', restaurantId: 'r-4', restaurantName: 'STAFF COFFEE',  earnedAt: '2025-03-08', color: 'oklch(0.62 0.14 60)',    obtained: true  },
  { id: 's-4', restaurantId: 'r-5', restaurantName: '후문 닭갈비',   earnedAt: '2025-03-07', color: 'oklch(0.62 0.16 18)',    obtained: true  },
  { id: 's-5', restaurantId: 'r-3', restaurantName: '정문 김밥천국', earnedAt: '2025-03-05', color: 'oklch(0.62 0.13 165)',   obtained: true  },
  { id: 's-6', restaurantId: 'r-6', restaurantName: '꽃피는 분식',   earnedAt: '2025-03-04', color: 'oklch(0.62 0.16 18)',    obtained: true  },
  { id: 's-7', restaurantId: 'x',   restaurantName: '단대 우동',     earnedAt: '2025-03-02', color: 'var(--primary)',         obtained: true  },
  { id: 's-8', restaurantId: 'x',   restaurantName: '후문 떡볶이',   earnedAt: '',           color: '',                       obtained: false },
  { id: 's-9', restaurantId: 'x',   restaurantName: '코너 베이커리', earnedAt: '',           color: '',                       obtained: false },
];

export const MOCK_REWARDS: Reward[] = [
  { id: 'rw-1', name: '스타벅스 아메리카노',  pointsRequired: 500,  stock: 12, color: 'oklch(0.62 0.12 165)' },
  { id: 'rw-2', name: 'BBQ 황금올리브 1/2',  pointsRequired: 1200, stock: 3,  color: 'oklch(0.66 0.18 50)' },
  { id: 'rw-3', name: 'GS25 5,000원권',      pointsRequired: 600,  stock: 24, color: 'oklch(0.58 0.16 235)' },
  { id: 'rw-4', name: '교보문고 1만원권',    pointsRequired: 1000, stock: 8,  color: 'oklch(0.55 0.14 280)' },
];

export const MOCK_BUILDINGS: Building[] = [
  { id: 'b-11', code: 'B11', name: '학생회관',     campus: 'jukjeon', walkMin: 4, floors: '지하 1층 ~ 지상 4층', lat: 37.3215, lng: 127.1262 },
  { id: 'b-it', code: 'IT',  name: 'IT관',         campus: 'jukjeon', walkMin: 7, floors: '지하 1층 ~ 지상 6층', lat: 37.3220, lng: 127.1270 },
  { id: 'b-eg', code: 'EG',  name: '공학관',       campus: 'jukjeon', walkMin: 5, floors: '지상 5층',           lat: 37.3219, lng: 127.1258 },
  { id: 'b-ss', code: 'SS',  name: '사회과학관',   campus: 'jukjeon', walkMin: 3, floors: '지상 5층',           lat: 37.3213, lng: 127.1265 },
];

export const MOCK_CAFETERIA: CafeteriaMenu[] = [
  { id: 'cm-1', buildingId: 'b-11', corner: '한식 A', menu: '제육볶음 · 시금치무침 · 미역국 · 김치',    price: 5500, soldOut: false, quantity: 84,  sold: 21, hot: true },
  { id: 'cm-2', buildingId: 'b-11', corner: '한식 B', menu: '돈까스 · 단무지 · 양배추샐러드 · 미소국', price: 6000, soldOut: true,  quantity: 60,  sold: 60 },
  { id: 'cm-3', buildingId: 'b-11', corner: '양식 C', menu: '스파게티 · 갈릭브레드 · 샐러드',           price: 6500, soldOut: false, quantity: 50,  sold: 12 },
  { id: 'cm-4', buildingId: 'b-11', corner: '분식 D', menu: '라면 · 김밥 · 만두 (2pc) · 단무지',        price: 4500, soldOut: false, quantity: 100, sold: 38 },
  { id: 'cm-5', buildingId: 'b-11', corner: '일품 E', menu: '비빔밥 · 된장국 · 김치',                   price: 5000, soldOut: false, quantity: 40,  sold: 9 },
];

export const MOCK_CLUBS: Club[] = [
  { id: 'c-1', name: '사진동아리 한울', category: '문화/예술', buildingId: 'b-11', buildingName: '학생회관', room: '312', members: 48, status: '활성',   recruiting: true,  awards: 3, instagram: 'dku_hanwool', description: '한울은 단국대학교 죽전캠퍼스의 사진 중앙동아리예요. 매학기 정기 출사와 작품전을 진행하며, 신입생 환영회와 흑백암실 워크샵을 운영합니다. 카메라가 없어도 가입할 수 있어요.', president: '이서연 · 24학번', meeting: '매주 화 18:00', fee: 30000, logoColor: 'var(--ink)' },
  { id: 'c-2', name: 'RUNRUN',         category: '체육',       buildingId: 'b-11', buildingName: '체육관',   room: '102', members: 31, status: '활성',   recruiting: true,  awards: 1, instagram: 'dku_runrun',  description: '러닝 + 트레일 동아리. 매주 토 캠퍼스 트레일 러닝.',                                                       president: '김도현 · 23학번',  meeting: '매주 토 07:00', fee: 20000, logoColor: 'oklch(0.62 0.16 18)' },
  { id: 'c-3', name: '코드웍스',       category: '학술',       buildingId: 'b-it', buildingName: 'IT관',     room: '411', members: 62, status: '활성',   recruiting: true,  awards: 5, instagram: 'dku_codeworks', description: '학술 개발 동아리. 해커톤·스터디·프로젝트 운영.',                                                          president: '박서영 · 23학번', meeting: '매주 목 19:00', fee: 25000, logoColor: 'oklch(0.62 0.13 165)' },
  { id: 'c-4', name: '푸드챌린저',     category: '취미',       buildingId: 'b-11', buildingName: '학생회관', room: '218', members: 19, status: '검토중', recruiting: false, awards: 0 },
  { id: 'c-5', name: '단대 합창단',    category: '문화/예술', buildingId: 'b-ss', buildingName: '음대관',   room: '105', members: 24, status: '활성',   recruiting: false, awards: 2 },
  { id: 'c-6', name: '사회봉사회',     category: '봉사',       buildingId: 'b-ss', buildingName: '사회과학관', room: 'B1',  members: 41, status: '활성',   recruiting: true,  awards: 4 },
];

export const MOCK_WEATHER: Weather = {
  campus: 'jukjeon',
  temp: 17,
  description: '흐림',
  precipitation: 20,
  hourly: [
    { hour: '12시', temp: 18 },
    { hour: '15시', temp: 19 },
    { hour: '18시', temp: 16 },
    { hour: '21시', temp: 14 },
  ],
};

export const MOCK_BUS_24: TransitArrival = {
  route: '24번',
  destination: '죽전역 → 단국대',
  minutes: [3, 11],
};

export const MOCK_SUBWAY: TransitArrival = {
  route: '수인분당선',
  destination: '죽전역',
  minutes: [4, 12],
};

export const MOCK_TIMETABLE: TimetableClass[] = [
  { id: 't-1', day: 0, start: 9,    end: 10.5, name: '자료구조',  professor: '김교수', building: 'IT관',         room: '403', color: 'var(--primary)',       category: '전공' },
  { id: 't-2', day: 0, start: 13,   end: 14.5, name: '교양 영어',                       building: '사회과학관', room: '201', color: 'oklch(0.74 0.16 55)',  category: '교양' },
  { id: 't-3', day: 1, start: 10.5, end: 12,   name: '선형대수',                       building: '공학관',     room: '305', color: 'oklch(0.62 0.16 18)',  category: '전공' },
  { id: 't-4', day: 1, start: 14.5, end: 16,   name: '확률통계',                       building: 'IT관',       room: '502', color: 'var(--primary)',       category: '전공' },
  { id: 't-5', day: 2, start: 9,    end: 10.5, name: '자료구조',  professor: '김교수', building: 'IT관',       room: '403', color: 'var(--primary)',       category: '전공', isNext: true },
  { id: 't-6', day: 2, start: 13,   end: 15,   name: '체육',                           building: '체육관',     room: '-',   color: 'oklch(0.62 0.13 165)', category: '체육' },
  { id: 't-7', day: 3, start: 10.5, end: 12,   name: '선형대수',                       building: '공학관',     room: '305', color: 'oklch(0.62 0.16 18)',  category: '전공' },
  { id: 't-8', day: 4, start: 9,    end: 10.5, name: '자료구조',  professor: '김교수', building: 'IT관',       room: '403', color: 'var(--primary)',       category: '전공' },
  { id: 't-9', day: 4, start: 13,   end: 14.5, name: '교양 영어',                       building: '사회과학관', room: '201', color: 'oklch(0.74 0.16 55)',  category: '교양' },
];

export const MOCK_USER_POINTS = 320;
export const MOCK_POINT_GOAL = 500;

// ─── 어드민: 리뷰 신고 ───
export const MOCK_REPORTS: ReviewReport[] = [
  {
    id: 'rep-1',
    reviewId: 'rv-99',
    reporterId: 'u-201',
    reporterName: '익명_3F2A',
    reason: '명예훼손',
    detail: '특정 직원을 비방하는 표현이 포함되어 있어요.',
    createdAt: '5분 전',
    status: 'pending',
    reviewSnapshot: {
      restaurantId: 'r-1',
      restaurantName: '단풍식당',
      userName: '익명사용자',
      rating: 1,
      body: '주방장이 너무 불친절하고 위생도 엉망이에요. 다신 안 갈 거예요.',
    },
  },
  {
    id: 'rep-2',
    reviewId: 'rv-98',
    reporterId: 'u-202',
    reporterName: '익명_8B91',
    reason: '광고/스팸',
    createdAt: '1시간 전',
    status: 'pending',
    reviewSnapshot: {
      restaurantId: 'r-4',
      restaurantName: 'STAFF COFFEE',
      userName: '커피마니아',
      rating: 5,
      body: '★★★ 무료 음료 쿠폰 받으려면 010-1234-5678 로 연락주세요! 단대 학우 한정!!',
    },
  },
  {
    id: 'rep-3',
    reviewId: 'rv-97',
    reporterId: 'u-203',
    reporterName: '익명_1C45',
    reason: '허위 정보',
    detail: '실제로 가본 적이 없는 가게 같습니다.',
    createdAt: '어제',
    status: 'hidden',
    reviewSnapshot: {
      restaurantId: 'r-2',
      restaurantName: '캠퍼스 라멘',
      userName: '비공개',
      rating: 5,
      body: '여기 사장님이 미슐랭 출신이에요!! 진짜 강추!!',
    },
  },
  {
    id: 'rep-4',
    reviewId: 'rv-96',
    reporterId: 'u-204',
    reporterName: '익명_F2A1',
    reason: '욕설/혐오',
    createdAt: '3일 전',
    status: 'rejected',
    reviewSnapshot: {
      restaurantId: 'r-3',
      restaurantName: '정문 김밥천국',
      userName: '단대인',
      rating: 3,
      body: '맛은 그저 그래요. 가성비는 괜찮은 편.',
    },
  },
];

// ─── 어드민: 사용자 ───
export const MOCK_USERS: AdminUser[] = [
  {
    id: 'u-001',
    email: 'danpoong@dankook.ac.kr',
    nickname: '단풍이',
    department: '컴퓨터공학과',
    studentId: '25',
    level: 3,
    campus: 'jukjeon',
    isAdmin: false,
    isSuspended: false,
    joinedAt: '2025-03-02',
    lastSeenAt: '방금 전',
    totalPoints: 320,
    reviewCount: 12,
    stampCount: 7,
  },
  {
    id: 'u-002',
    email: 'admin@dankook.ac.kr',
    nickname: '학생복지팀',
    department: '학생복지팀',
    studentId: 'STAFF',
    level: 99,
    campus: 'jukjeon',
    isAdmin: true,
    isSuspended: false,
    joinedAt: '2024-09-01',
    lastSeenAt: '5분 전',
    totalPoints: 0,
    reviewCount: 0,
    stampCount: 0,
  },
  {
    id: 'u-101',
    email: 'minji@dankook.ac.kr',
    nickname: '민지',
    department: '컴퓨터공학과',
    studentId: '25',
    level: 2,
    campus: 'jukjeon',
    isAdmin: false,
    isSuspended: false,
    joinedAt: '2025-03-04',
    lastSeenAt: '2분 전',
    totalPoints: 180,
    reviewCount: 8,
    stampCount: 4,
  },
  {
    id: 'u-102',
    email: 'jy24@dankook.ac.kr',
    nickname: '준영',
    department: '경영학과',
    studentId: '24',
    level: 4,
    campus: 'jukjeon',
    isAdmin: false,
    isSuspended: false,
    joinedAt: '2024-03-02',
    lastSeenAt: '12분 전',
    totalPoints: 540,
    reviewCount: 21,
    stampCount: 11,
  },
  {
    id: 'u-103',
    email: 'sua@dankook.ac.kr',
    nickname: '수아',
    department: '디자인학과',
    studentId: '25',
    level: 2,
    campus: 'jukjeon',
    isAdmin: false,
    isSuspended: false,
    joinedAt: '2025-03-08',
    lastSeenAt: '1시간 전',
    totalPoints: 95,
    reviewCount: 4,
    stampCount: 2,
  },
  {
    id: 'u-901',
    email: 'spam@example.com',
    nickname: '스팸봇1',
    department: '미상',
    studentId: '0',
    level: 1,
    campus: 'jukjeon',
    isAdmin: false,
    isSuspended: true,
    joinedAt: '2025-03-10',
    lastSeenAt: '2일 전',
    totalPoints: 0,
    reviewCount: 1,
    stampCount: 0,
  },
];

// ─── MY: 즐겨찾기 (단풍이가 즐겨찾기한 항목) ───
export const MOCK_FAVORITES: Favorite[] = [
  { id: 'fav-1', userId: 'u-001', targetType: 'restaurant', targetId: 'r-1',  targetName: '단풍식당',        targetMeta: '한식 · 김치찌개 · 도보 3분', imageLabel: '한식', createdAt: '3일 전' },
  { id: 'fav-2', userId: 'u-001', targetType: 'restaurant', targetId: 'r-4',  targetName: 'STAFF COFFEE',    targetMeta: '카페 · 핸드드립 · 도보 4분', imageLabel: '카페', createdAt: '1주 전' },
  { id: 'fav-3', userId: 'u-001', targetType: 'club',       targetId: 'c-1',  targetName: '사진동아리 한울', targetMeta: '문화/예술 · 학생회관 312',                       createdAt: '5일 전' },
  { id: 'fav-4', userId: 'u-001', targetType: 'building',   targetId: 'b-11', targetName: '학생회관',        targetMeta: 'B11 · 도보 4분',                                createdAt: '2주 전' },
];

// ─── MY: 리워드 보관함 (교환 내역) ───
export const MOCK_REDEMPTIONS: RewardRedemption[] = [
  {
    id: 'rd-1',
    rewardId: 'rw-1',
    rewardName: '스타벅스 아메리카노',
    rewardColor: 'oklch(0.62 0.12 165)',
    pointsSpent: 500,
    redeemedAt: '2일 전',
    couponCode: 'SBUX-D9F2-K1QM-7A3X',
    expiresAt: '2025-05-21 까지',
    isUsed: false,
  },
  {
    id: 'rd-2',
    rewardId: 'rw-3',
    rewardName: 'GS25 5,000원권',
    rewardColor: 'oklch(0.58 0.16 235)',
    pointsSpent: 600,
    redeemedAt: '2주 전',
    couponCode: 'GS25-A8B1-CC92-LMN0',
    expiresAt: '2025-06-04 까지',
    isUsed: true,
  },
  {
    id: 'rd-3',
    rewardId: 'rw-1',
    rewardName: '스타벅스 아메리카노',
    rewardColor: 'oklch(0.62 0.12 165)',
    pointsSpent: 500,
    redeemedAt: '한 달 전',
    couponCode: 'SBUX-Z3Y2-X1WV-7P5Q',
    expiresAt: '2025-04-22 까지',
    isUsed: true,
  },
];

// ─── 학사 일정 / 이벤트 ───
export const MOCK_EVENTS: CampusEvent[] = [
  {
    id: 'ev-1',
    title: '단국 대동제',
    description: '죽전캠퍼스 봄 축제 — 동아리 공연, 게스트 라이브, 푸드 트럭',
    category: '축제',
    campus: 'jukjeon',
    startAt: '2025-05-21 (수)',
    endAt: '2025-05-23 (금)',
    location: '죽전캠퍼스 중앙광장',
    coverEmoji: '🎉',
    isPinned: true,
  },
  {
    id: 'ev-2',
    title: '신입생 스탬프 EVENT',
    description: '스탬프 3개 모으면 추첨을 통해 기프티콘 증정',
    category: '공지',
    startAt: '~ 2025-04-30',
    coverEmoji: '🎁',
    isPinned: true,
    linkUrl: '/stamp',
  },
  {
    id: 'ev-3',
    title: '2025-1학기 수강신청',
    description: '본수강신청 — 정정 기간은 3/4 ~ 3/8',
    category: '학사',
    startAt: '2025-03-03 (월) 09:00',
    endAt: '2025-03-03 (월) 17:00',
    location: '온라인 (수강신청 시스템)',
    coverEmoji: '📚',
  },
  {
    id: 'ev-4',
    title: '동아리 박람회',
    description: '중앙동아리 30+ 부스 운영. 신입생 환영',
    category: '동아리',
    campus: 'jukjeon',
    startAt: '2025-03-10 (월) 11:00',
    endAt: '2025-03-12 (수) 17:00',
    location: '학생회관 앞 광장',
    coverEmoji: '🎓',
  },
  {
    id: 'ev-5',
    title: '중간고사 기간',
    description: '학기 중간 정기 시험',
    category: '학사',
    startAt: '2025-04-22 (화)',
    endAt: '2025-04-28 (월)',
    coverEmoji: '📝',
  },
  {
    id: 'ev-6',
    title: '도서관 24시간 운영',
    description: '시험기간 한정 — 중앙도서관 1·2층 24시간 개방',
    category: '공지',
    startAt: '2025-04-15 (화) ~',
    endAt: '2025-04-28 (월)',
    location: '중앙도서관',
    coverEmoji: '📖',
  },
];
