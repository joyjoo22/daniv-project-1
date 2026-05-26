// MSW 핸들러 — 개발 모드에서 실제 API 호출을 가로채 mock 데이터로 응답.
// 백엔드가 준비되면 setupWorker 호출을 제거하는 것만으로 실제 API로 전환된다.
//
// 외부 도메인 (네이버 지도, Open-Meteo, Supabase, 폰트 CDN 등) 은
// main.tsx 의 onUnhandledRequest: 'bypass' 로 자동 통과 — 명시적 passthrough()
// 핸들러를 쓰면 MSW 가 자체 fetch 로 재호출해서 CORS/credentials 케이스에서
// "Failed to fetch" 에러를 던질 수 있음.
import { http, HttpResponse, delay } from 'msw';
import {
  MOCK_USER,
  MOCK_RESTAURANTS,
  MOCK_REVIEWS,
  MOCK_CLUBS,
  MOCK_BUILDINGS,
  MOCK_CAFETERIA,
  MOCK_STAMPS,
  MOCK_REWARDS,
  MOCK_USER_POINTS,
  MOCK_POINT_GOAL,
  MOCK_TIMETABLE,
  MOCK_WEATHER,
  MOCK_BUS_24,
  MOCK_SUBWAY,
  MOCK_REPORTS,
  MOCK_USERS,
  MOCK_FAVORITES,
  MOCK_REDEMPTIONS,
} from '@/data/mock';
import type {
  Review,
  Restaurant,
  Club,
  Building,
  Reward,
  ReviewReport,
  AdminUser,
  Favorite,
  RewardRedemption,
} from '@/types/domain';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const url = (path: string) => `${BASE}${path}`;

// in-memory 상태 — 페이지 갱신 전까지는 mutate 결과가 반영됨.
let reviewsState: Review[] = [...MOCK_REVIEWS];
let pointsState = MOCK_USER_POINTS;
let cafeteriaState = [...MOCK_CAFETERIA];
let restaurantsState: Restaurant[] = [...MOCK_RESTAURANTS];
let clubsState: Club[] = [...MOCK_CLUBS];
let buildingsState: Building[] = [...MOCK_BUILDINGS];
let rewardsState: Reward[] = [...MOCK_REWARDS];
let reportsState: ReviewReport[] = [...MOCK_REPORTS];
let usersState: AdminUser[] = [...MOCK_USERS];
let favoritesState: Favorite[] = [...MOCK_FAVORITES];
let redemptionsState: RewardRedemption[] = [...MOCK_REDEMPTIONS];

// 단순 id 생성 — `r-<timestamp>` / `c-<timestamp>`.
const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

const FAKE_TOKEN = 'mock-jwt-token-' + Date.now();

export const handlers = [
  // ─── AUTH ───
  http.post(url('/auth/login'), async () => {
    await delay(300);
    return HttpResponse.json({ token: FAKE_TOKEN, user: MOCK_USER });
  }),
  http.post(url('/auth/signup'), async () => {
    await delay(400);
    return HttpResponse.json({ token: FAKE_TOKEN, user: MOCK_USER });
  }),
  http.get(url('/auth/me'), () => HttpResponse.json(MOCK_USER)),
  http.post(url('/auth/logout'), () => HttpResponse.json({ ok: true })),

  // ─── RESTAURANTS ───
  http.get(url('/restaurants'), ({ request }) => {
    const u = new URL(request.url);
    const category = u.searchParams.get('category');
    let list = restaurantsState;
    if (category && category !== '전체') {
      list = list.filter((r) => r.category.startsWith(category));
    }
    return HttpResponse.json(list);
  }),
  http.get(url('/restaurants/:id'), ({ params }) => {
    const r = restaurantsState.find((x) => x.id === params.id);
    if (!r) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(r);
  }),
  // ─── RESTAURANTS / ADMIN ───
  http.post(url('/restaurants'), async ({ request }) => {
    const body = (await request.json()) as Omit<Restaurant, 'id' | 'rating' | 'reviewCount'>;
    const newRestaurant: Restaurant = {
      id: newId('r'),
      ...body,
      rating: 0,
      reviewCount: 0,
    };
    restaurantsState = [newRestaurant, ...restaurantsState];
    return HttpResponse.json(newRestaurant);
  }),
  http.patch(url('/restaurants/:id'), async ({ params, request }) => {
    const body = (await request.json()) as Partial<Restaurant>;
    let updated: Restaurant | undefined;
    restaurantsState = restaurantsState.map((r) => {
      if (r.id !== params.id) return r;
      updated = { ...r, ...body };
      return updated;
    });
    if (!updated) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(updated);
  }),
  http.delete(url('/restaurants/:id'), ({ params }) => {
    const exists = restaurantsState.some((r) => r.id === params.id);
    if (!exists) return new HttpResponse(null, { status: 404 });
    restaurantsState = restaurantsState.filter((r) => r.id !== params.id);
    // 관련 리뷰도 같이 삭제
    reviewsState = reviewsState.filter((rv) => rv.restaurantId !== params.id);
    return HttpResponse.json({ ok: true });
  }),
  http.get(url('/restaurants/:id/reviews'), ({ params }) =>
    HttpResponse.json(reviewsState.filter((r) => r.restaurantId === params.id)),
  ),
  // ─── REVIEW POST ───
  http.post(url('/restaurants/:id/reviews'), async ({ params, request }) => {
    const body = (await request.json()) as { rating: number; body: string };
    const newReview: Review = {
      id: `rv-${Date.now()}`,
      restaurantId: params.id as string,
      userId: MOCK_USER.id,
      userName: MOCK_USER.nickname,
      userTag: `${MOCK_USER.department.slice(0, 2)} ${MOCK_USER.studentId}학번`,
      rating: body.rating,
      body: body.body,
      createdAt: '방금 전',
    };
    reviewsState = [newReview, ...reviewsState];
    pointsState += 25;
    return HttpResponse.json(newReview);
  }),

  // ─── CLUBS ───
  http.get(url('/clubs'), ({ request }) => {
    const u = new URL(request.url);
    const category = u.searchParams.get('category');
    const recruiting = u.searchParams.get('recruiting');
    let list = clubsState;
    if (category && category !== '전체') list = list.filter((c) => c.category === category);
    if (recruiting === 'true') list = list.filter((c) => c.recruiting);
    return HttpResponse.json(list);
  }),
  http.get(url('/clubs/:id'), ({ params }) => {
    const c = clubsState.find((x) => x.id === params.id);
    if (!c) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(c);
  }),
  http.post(url('/clubs/:id/apply'), () => HttpResponse.json({ ok: true })),

  // ─── CLUBS / ADMIN ───
  http.post(url('/clubs'), async ({ request }) => {
    const body = (await request.json()) as Omit<Club, 'id' | 'members' | 'awards'>;
    const newClub: Club = {
      id: newId('c'),
      ...body,
      members: 0,
      awards: 0,
    };
    clubsState = [newClub, ...clubsState];
    return HttpResponse.json(newClub);
  }),
  http.patch(url('/clubs/:id'), async ({ params, request }) => {
    const body = (await request.json()) as Partial<Club>;
    let updated: Club | undefined;
    clubsState = clubsState.map((c) => {
      if (c.id !== params.id) return c;
      updated = { ...c, ...body };
      return updated;
    });
    if (!updated) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(updated);
  }),
  http.delete(url('/clubs/:id'), ({ params }) => {
    const exists = clubsState.some((c) => c.id === params.id);
    if (!exists) return new HttpResponse(null, { status: 404 });
    clubsState = clubsState.filter((c) => c.id !== params.id);
    return HttpResponse.json({ ok: true });
  }),

  // ─── BUILDINGS ───
  http.get(url('/buildings'), () => HttpResponse.json(buildingsState)),
  http.get(url('/buildings/:id'), ({ params }) => {
    const b = buildingsState.find((x) => x.id === params.id);
    if (!b) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(b);
  }),
  // BUILDINGS / ADMIN
  http.post(url('/buildings'), async ({ request }) => {
    const body = (await request.json()) as Omit<Building, 'id'>;
    const newBuilding: Building = {
      id: newId('b'),
      ...body,
    };
    buildingsState = [newBuilding, ...buildingsState];
    return HttpResponse.json(newBuilding);
  }),
  http.patch(url('/buildings/:id'), async ({ params, request }) => {
    const body = (await request.json()) as Partial<Building>;
    let updated: Building | undefined;
    buildingsState = buildingsState.map((b) => {
      if (b.id !== params.id) return b;
      updated = { ...b, ...body };
      return updated;
    });
    if (!updated) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(updated);
  }),
  http.delete(url('/buildings/:id'), ({ params }) => {
    const exists = buildingsState.some((b) => b.id === params.id);
    if (!exists) return new HttpResponse(null, { status: 404 });
    buildingsState = buildingsState.filter((b) => b.id !== params.id);
    cafeteriaState = cafeteriaState.filter((m) => m.buildingId !== params.id);
    return HttpResponse.json({ ok: true });
  }),
  http.get(url('/buildings/:id/cafeteria'), ({ params }) =>
    HttpResponse.json(cafeteriaState.filter((m) => m.buildingId === params.id)),
  ),
  http.patch(url('/buildings/:buildingId/cafeteria/:menuId/sold-out'), ({ params }) => {
    cafeteriaState = cafeteriaState.map((m) =>
      m.id === params.menuId ? { ...m, soldOut: !m.soldOut } : m,
    );
    const updated = cafeteriaState.find((m) => m.id === params.menuId);
    return HttpResponse.json(updated);
  }),

  // ─── POINTS / STAMPS / REWARDS ───
  http.get(url('/points'), () =>
    HttpResponse.json({ total: pointsState, goal: MOCK_POINT_GOAL }),
  ),
  http.get(url('/stamps'), () => HttpResponse.json(MOCK_STAMPS)),
  http.post(url('/stamps'), async ({ request }) => {
    const body = (await request.json()) as { restaurantId: string };
    const r = MOCK_RESTAURANTS.find((x) => x.id === body.restaurantId);
    pointsState += 20;
    return HttpResponse.json({
      id: `s-${Date.now()}`,
      restaurantId: body.restaurantId,
      restaurantName: r?.name ?? '미상',
      earnedAt: new Date().toISOString().slice(0, 10),
      color: 'var(--primary)',
      obtained: true,
    });
  }),
  http.get(url('/rewards'), () => HttpResponse.json(rewardsState)),
  http.post(url('/rewards/:id/redeem'), ({ params }) => {
    const r = rewardsState.find((x) => x.id === params.id);
    if (!r) return new HttpResponse(null, { status: 404 });
    if (pointsState < r.pointsRequired) {
      return HttpResponse.json({ message: '포인트가 부족해요.' }, { status: 400 });
    }
    if (r.stock <= 0) {
      return HttpResponse.json({ message: '재고가 부족해요.' }, { status: 400 });
    }
    pointsState -= r.pointsRequired;
    rewardsState = rewardsState.map((x) => (x.id === r.id ? { ...x, stock: x.stock - 1 } : x));
    // 보관함에 자동 추가 — 쿠폰 코드 생성
    const couponCode = `${r.name.replace(/\s+/g, '').slice(0, 4).toUpperCase()}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;
    const newRedemption: RewardRedemption = {
      id: newId('rd'),
      rewardId: r.id,
      rewardName: r.name,
      rewardColor: r.color,
      pointsSpent: r.pointsRequired,
      redeemedAt: '방금 전',
      couponCode,
      expiresAt: '2025-12-31 까지',
      isUsed: false,
    };
    redemptionsState = [newRedemption, ...redemptionsState];
    return HttpResponse.json({ ok: true, remainingPoints: pointsState });
  }),

  // REWARDS / ADMIN
  http.post(url('/rewards'), async ({ request }) => {
    const body = (await request.json()) as Omit<Reward, 'id'>;
    const newReward: Reward = {
      id: newId('rw'),
      ...body,
    };
    rewardsState = [newReward, ...rewardsState];
    return HttpResponse.json(newReward);
  }),
  http.patch(url('/rewards/:id'), async ({ params, request }) => {
    const body = (await request.json()) as Partial<Reward>;
    let updated: Reward | undefined;
    rewardsState = rewardsState.map((r) => {
      if (r.id !== params.id) return r;
      updated = { ...r, ...body };
      return updated;
    });
    if (!updated) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(updated);
  }),
  http.delete(url('/rewards/:id'), ({ params }) => {
    const exists = rewardsState.some((r) => r.id === params.id);
    if (!exists) return new HttpResponse(null, { status: 404 });
    rewardsState = rewardsState.filter((r) => r.id !== params.id);
    return HttpResponse.json({ ok: true });
  }),

  // ─── ADMIN: REPORTS ───
  http.get(url('/admin/reports'), ({ request }) => {
    const u = new URL(request.url);
    const status = u.searchParams.get('status');
    let list = reportsState;
    if (status) list = list.filter((r) => r.status === status);
    return HttpResponse.json(list);
  }),
  http.patch(url('/admin/reports/:id'), async ({ params, request }) => {
    const body = (await request.json()) as { status: ReviewReport['status'] };
    let updated: ReviewReport | undefined;
    reportsState = reportsState.map((r) => {
      if (r.id !== params.id) return r;
      updated = { ...r, status: body.status };
      return updated;
    });
    if (!updated) return new HttpResponse(null, { status: 404 });
    // hidden 처리 시 원본 리뷰도 숨김 (시뮬레이션)
    if (body.status === 'hidden' && updated) {
      reviewsState = reviewsState.filter((rv) => rv.id !== updated!.reviewId);
    }
    return HttpResponse.json(updated);
  }),
  http.delete(url('/admin/reports/:id'), ({ params }) => {
    const exists = reportsState.some((r) => r.id === params.id);
    if (!exists) return new HttpResponse(null, { status: 404 });
    reportsState = reportsState.filter((r) => r.id !== params.id);
    return HttpResponse.json({ ok: true });
  }),

  // ─── ADMIN: USERS ───
  http.get(url('/admin/users'), ({ request }) => {
    const u = new URL(request.url);
    const q = u.searchParams.get('q')?.toLowerCase().trim();
    let list = usersState;
    if (q) {
      list = list.filter(
        (x) =>
          x.nickname.toLowerCase().includes(q) ||
          x.email.toLowerCase().includes(q) ||
          x.department.toLowerCase().includes(q),
      );
    }
    return HttpResponse.json(list);
  }),
  http.patch(url('/admin/users/:id'), async ({ params, request }) => {
    const body = (await request.json()) as Partial<AdminUser>;
    let updated: AdminUser | undefined;
    usersState = usersState.map((u) => {
      if (u.id !== params.id) return u;
      updated = { ...u, ...body };
      return updated;
    });
    if (!updated) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(updated);
  }),
  http.delete(url('/admin/users/:id'), ({ params }) => {
    const exists = usersState.some((u) => u.id === params.id);
    if (!exists) return new HttpResponse(null, { status: 404 });
    usersState = usersState.filter((u) => u.id !== params.id);
    return HttpResponse.json({ ok: true });
  }),

  // ─── MY (내 리뷰 / 즐겨찾기 / 리워드 보관함) ───
  http.get(url('/me/reviews'), () => {
    // 내가 작성한 리뷰 — userId 일치 + 식당명 조인.
    const mine = reviewsState
      .filter((rv) => rv.userId === MOCK_USER.id)
      .map((rv) => {
        const r = restaurantsState.find((x) => x.id === rv.restaurantId);
        return { ...rv, restaurantName: r?.name ?? '(삭제된 식당)' };
      });
    return HttpResponse.json(mine);
  }),

  http.get(url('/me/favorites'), () => HttpResponse.json(favoritesState)),
  http.post(url('/me/favorites'), async ({ request }) => {
    const body = (await request.json()) as Omit<Favorite, 'id' | 'userId' | 'createdAt'>;
    // 중복 추가 방지 — 이미 있으면 기존 것 반환
    const existing = favoritesState.find(
      (f) => f.targetType === body.targetType && f.targetId === body.targetId,
    );
    if (existing) return HttpResponse.json(existing);
    const fav: Favorite = {
      id: newId('fav'),
      userId: MOCK_USER.id,
      ...body,
      createdAt: '방금 전',
    };
    favoritesState = [fav, ...favoritesState];
    return HttpResponse.json(fav);
  }),
  http.delete(url('/me/favorites/:id'), ({ params }) => {
    const exists = favoritesState.some((f) => f.id === params.id);
    if (!exists) return new HttpResponse(null, { status: 404 });
    favoritesState = favoritesState.filter((f) => f.id !== params.id);
    return HttpResponse.json({ ok: true });
  }),

  http.get(url('/me/redemptions'), () => HttpResponse.json(redemptionsState)),
  http.patch(url('/me/redemptions/:id/use'), ({ params }) => {
    let updated: RewardRedemption | undefined;
    redemptionsState = redemptionsState.map((r) => {
      if (r.id !== params.id) return r;
      updated = { ...r, isUsed: true };
      return updated;
    });
    if (!updated) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(updated);
  }),

  // ─── CAMPUS ───
  http.get(url('/timetable'), () => HttpResponse.json(MOCK_TIMETABLE)),
  http.get(url('/weather'), () => HttpResponse.json(MOCK_WEATHER)),
  http.get(url('/transit/bus/:route'), ({ params }) =>
    HttpResponse.json({ ...MOCK_BUS_24, route: `${params.route}번` }),
  ),
  http.get(url('/transit/subway/:station'), () => HttpResponse.json(MOCK_SUBWAY)),
];
