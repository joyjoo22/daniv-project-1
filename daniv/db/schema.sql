-- ============================================================================
-- 단이브 (DANIV) — PostgreSQL 15+ / Supabase 호환 DB 스키마
-- ----------------------------------------------------------------------------
-- 실행 방법:
--   1) Supabase 대시보드 → SQL Editor → 이 파일 전체 붙여넣기 → Run
--   2) 또는 psql 로:  psql $DATABASE_URL -f db/schema.sql
--
-- 주의:
--   - Supabase 의 auth.users 테이블을 신뢰 원천으로 사용 (이메일/비밀번호 관리).
--   - 본 스키마의 public.profiles 가 daniv 도메인 데이터 (닉네임/학과/학번 등) 보관.
--   - RLS(Row Level Security) 활성화 — 사용자가 자기 데이터만 읽고 쓸 수 있음.
-- ============================================================================

-- ENUM 타입
DO $$ BEGIN
  CREATE TYPE campus_enum AS ENUM ('jukjeon', 'cheonan');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE club_category AS ENUM ('문화/예술', '체육', '학술', '봉사', '취미');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE club_status AS ENUM ('활성', '검토중', '비활성');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE point_event_type AS ENUM ('review', 'stamp', 'reward', 'event', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================================
-- 1. PROFILES — Supabase auth.users 와 1:1 매핑.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id               uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email            citext NOT NULL UNIQUE,
  nickname         text NOT NULL CHECK (char_length(nickname) BETWEEN 2 AND 12),
  department       text NOT NULL,
  student_id       text NOT NULL,
  avatar_url       text,
  level            int  NOT NULL DEFAULT 1 CHECK (level >= 1),
  campus           campus_enum NOT NULL DEFAULT 'jukjeon',
  is_admin         boolean NOT NULL DEFAULT false,
  joined_at        timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS profiles_nickname_idx ON public.profiles (nickname);

-- 닉네임 중복 방지 (대소문자 무관)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_nickname_unique_lower_idx
  ON public.profiles (lower(nickname));

-- 단국대 이메일 도메인 검증 (필요 시 활성화)
-- ALTER TABLE public.profiles
--   ADD CONSTRAINT profiles_dku_email_check
--   CHECK (email ~* '@dankook\.ac\.kr$');

-- ============================================================================
-- 2. BUILDINGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.buildings (
  id          text PRIMARY KEY,           -- "b-11"
  code        text NOT NULL,              -- "B11"
  name        text NOT NULL,
  campus      campus_enum NOT NULL DEFAULT 'jukjeon',
  lat         double precision,
  lng         double precision,
  floors      text,
  walk_min    int,
  description text,
  cover_url   text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS buildings_campus_idx ON public.buildings (campus);

-- ============================================================================
-- 3. RESTAURANTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.restaurants (
  id              text PRIMARY KEY,
  name            text NOT NULL,
  category        text NOT NULL,
  price_tier      text CHECK (price_tier IN ('₩', '₩₩', '₩₩₩')),
  walk_min        int,
  lat             double precision,
  lng             double precision,
  hours           text,
  phone           text,
  cover_url       text,
  image_label     text,
  has_stamp       boolean NOT NULL DEFAULT false,
  hot             boolean NOT NULL DEFAULT false,
  campus          campus_enum NOT NULL DEFAULT 'jukjeon',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS restaurants_campus_idx ON public.restaurants (campus);
CREATE INDEX IF NOT EXISTS restaurants_has_stamp_idx ON public.restaurants (has_stamp) WHERE has_stamp;

-- ============================================================================
-- 4. REVIEWS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   text NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating          int  NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body            text NOT NULL CHECK (char_length(body) BETWEEN 5 AND 1000),
  tags            text[] NOT NULL DEFAULT '{}',
  photos          text[] NOT NULL DEFAULT '{}',
  is_reported     boolean NOT NULL DEFAULT false,
  is_hidden       boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reviews_restaurant_idx ON public.reviews (restaurant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS reviews_user_idx ON public.reviews (user_id, created_at DESC);

-- ============================================================================
-- 5. STAMPS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.stamps (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id   text NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  earned_at       timestamptz NOT NULL DEFAULT now(),
  method          text NOT NULL CHECK (method IN ('gps', 'qr')) DEFAULT 'gps',
  lat             double precision,
  lng             double precision
);

-- 같은 가게는 하루 1회만 적립 (악용 방지)
CREATE UNIQUE INDEX IF NOT EXISTS stamps_unique_per_day_idx
  ON public.stamps (user_id, restaurant_id, date_trunc('day', earned_at));

CREATE INDEX IF NOT EXISTS stamps_user_idx ON public.stamps (user_id, earned_at DESC);

-- ============================================================================
-- 6. POINT_HISTORY — 모든 포인트 변동의 단일 출처. user_points 는 view 로 집계.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.point_history (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  delta        int  NOT NULL,        -- 양수=적립, 음수=차감
  event_type   point_event_type NOT NULL,
  reason       text NOT NULL,
  ref_id       text,                  -- 관련된 review/stamp/reward id
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS point_history_user_idx ON public.point_history (user_id, created_at DESC);

CREATE OR REPLACE VIEW public.user_points AS
SELECT
  user_id,
  COALESCE(SUM(delta), 0)::int AS total
FROM public.point_history
GROUP BY user_id;

-- ============================================================================
-- 7. REWARDS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.rewards (
  id                text PRIMARY KEY,
  name              text NOT NULL,
  description       text,
  points_required   int  NOT NULL CHECK (points_required > 0),
  stock             int  NOT NULL DEFAULT 0 CHECK (stock >= 0),
  cover_color       text,                    -- "oklch(0.62 0.12 165)" 등 디자인 토큰
  image_url         text,
  active            boolean NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reward_redemptions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id   text NOT NULL REFERENCES public.rewards(id),
  redeemed_at timestamptz NOT NULL DEFAULT now(),
  coupon_code text                        -- 발급된 기프티콘 코드
);

CREATE INDEX IF NOT EXISTS reward_redemptions_user_idx ON public.reward_redemptions (user_id, redeemed_at DESC);

-- ============================================================================
-- 8. CLUBS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.clubs (
  id              text PRIMARY KEY,
  name            text NOT NULL,
  category        club_category NOT NULL,
  building_id     text REFERENCES public.buildings(id) ON DELETE SET NULL,
  room            text,
  members_count   int  NOT NULL DEFAULT 0,
  status          club_status NOT NULL DEFAULT '활성',
  recruiting      boolean NOT NULL DEFAULT false,
  instagram       text,
  description     text,
  president       text,
  meeting         text,
  fee             int,
  logo_color      text,
  campus          campus_enum NOT NULL DEFAULT 'jukjeon',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS clubs_category_idx ON public.clubs (category);
CREATE INDEX IF NOT EXISTS clubs_recruiting_idx ON public.clubs (recruiting) WHERE recruiting;

CREATE TABLE IF NOT EXISTS public.club_awards (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id     text NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  year        text NOT NULL,
  title       text NOT NULL,
  description text
);

CREATE INDEX IF NOT EXISTS club_awards_club_idx ON public.club_awards (club_id, year DESC);

-- 동아리 가입 신청
CREATE TABLE IF NOT EXISTS public.club_applications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id     text NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  applied_at  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS club_applications_unique_idx
  ON public.club_applications (club_id, user_id);

-- ============================================================================
-- 9. CAFETERIA MENUS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.cafeteria_menus (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id  text NOT NULL REFERENCES public.buildings(id) ON DELETE CASCADE,
  date         date NOT NULL DEFAULT current_date,
  meal         text NOT NULL CHECK (meal IN ('breakfast', 'lunch', 'dinner')) DEFAULT 'lunch',
  corner       text NOT NULL,
  menu         text NOT NULL,
  price        int  NOT NULL CHECK (price >= 0),
  quantity     int  NOT NULL DEFAULT 0,
  sold         int  NOT NULL DEFAULT 0,
  sold_out     boolean NOT NULL DEFAULT false,
  hot          boolean NOT NULL DEFAULT false,
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cafeteria_menus_building_date_idx
  ON public.cafeteria_menus (building_id, date DESC, meal);

-- ============================================================================
-- 10. TIMETABLES — 사용자별 시간표
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.timetable_classes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  semester    text NOT NULL DEFAULT '2025-1',
  day         int  NOT NULL CHECK (day BETWEEN 0 AND 6),
  start_time  numeric(4,1) NOT NULL,         -- 9.0, 10.5 등
  end_time    numeric(4,1) NOT NULL,
  name        text NOT NULL,
  professor   text,
  building    text,
  room        text,
  color       text,
  category    text CHECK (category IN ('전공', '교양', '체육', '기타')),
  CHECK (end_time > start_time)
);

CREATE INDEX IF NOT EXISTS timetable_user_semester_idx
  ON public.timetable_classes (user_id, semester);

-- ============================================================================
-- 11. EVENTS — 학사/축제 일정
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  description text,
  category    text CHECK (category IN ('축제', '학사', '공지', '동아리', '기타')),
  campus      campus_enum,
  start_at    timestamptz NOT NULL,
  end_at      timestamptz,
  cover_url   text,
  link_url    text,
  is_pinned   boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS events_start_at_idx ON public.events (start_at DESC);

-- ============================================================================
-- 12. FAVORITES — 사용자 즐겨찾기 (음식점·건물·동아리)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.favorites (
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type  text NOT NULL CHECK (target_type IN ('restaurant', 'building', 'club')),
  target_id    text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, target_type, target_id)
);

-- ============================================================================
-- 13. 자동 트리거 — 신규 가입 시 profiles 자동 생성, 포인트 자동 적립 등
-- ============================================================================

-- updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS profiles_touch_updated_at ON public.profiles;
CREATE TRIGGER profiles_touch_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS buildings_touch_updated_at ON public.buildings;
CREATE TRIGGER buildings_touch_updated_at BEFORE UPDATE ON public.buildings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS restaurants_touch_updated_at ON public.restaurants;
CREATE TRIGGER restaurants_touch_updated_at BEFORE UPDATE ON public.restaurants
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS clubs_touch_updated_at ON public.clubs;
CREATE TRIGGER clubs_touch_updated_at BEFORE UPDATE ON public.clubs
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS cafeteria_menus_touch_updated_at ON public.cafeteria_menus;
CREATE TRIGGER cafeteria_menus_touch_updated_at BEFORE UPDATE ON public.cafeteria_menus
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 리뷰 작성 시 +25p 자동 적립
CREATE OR REPLACE FUNCTION public.award_points_on_review()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.point_history (user_id, delta, event_type, reason, ref_id)
  VALUES (NEW.user_id, 25, 'review', '리뷰 작성', NEW.id::text);
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS reviews_award_points ON public.reviews;
CREATE TRIGGER reviews_award_points AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.award_points_on_review();

-- 스탬프 적립 시 +20p 자동 적립
CREATE OR REPLACE FUNCTION public.award_points_on_stamp()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.point_history (user_id, delta, event_type, reason, ref_id)
  VALUES (NEW.user_id, 20, 'stamp', '방문 스탬프', NEW.id::text);
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS stamps_award_points ON public.stamps;
CREATE TRIGGER stamps_award_points AFTER INSERT ON public.stamps
  FOR EACH ROW EXECUTE FUNCTION public.award_points_on_stamp();

-- ============================================================================
-- 14. RLS — Row Level Security 정책
--      Supabase 사용 시 필수. 비-Supabase 환경에선 ALTER ... DISABLE 가능.
-- ============================================================================

ALTER TABLE public.profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stamps              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_history       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_redemptions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_applications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_classes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites           ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 가능 (인증 없이도 조회 가능)
ALTER TABLE public.buildings           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_awards         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafeteria_menus     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events              ENABLE ROW LEVEL SECURITY;

-- ─── 정책 ───
-- 본인 프로필만 읽기/수정 가능
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 리뷰: 모두 읽기 가능, 본인 것만 작성/수정/삭제
CREATE POLICY "reviews_select_all"     ON public.reviews FOR SELECT USING (NOT is_hidden);
CREATE POLICY "reviews_insert_own"     ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update_own"     ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reviews_delete_own"     ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- 스탬프/포인트내역/리워드교환/시간표/즐겨찾기/동아리지원: 본인 것만
CREATE POLICY "stamps_own"               ON public.stamps FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "point_history_select_own" ON public.point_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "reward_redemptions_own"   ON public.reward_redemptions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "club_applications_own"    ON public.club_applications FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "timetable_own"            ON public.timetable_classes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_own"            ON public.favorites FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 공개 컨텐츠 (인증 없이도 읽기 가능)
CREATE POLICY "buildings_public_read"        ON public.buildings        FOR SELECT USING (true);
CREATE POLICY "restaurants_public_read"      ON public.restaurants      FOR SELECT USING (true);
CREATE POLICY "clubs_public_read"            ON public.clubs            FOR SELECT USING (true);
CREATE POLICY "club_awards_public_read"      ON public.club_awards      FOR SELECT USING (true);
CREATE POLICY "cafeteria_menus_public_read"  ON public.cafeteria_menus  FOR SELECT USING (true);
CREATE POLICY "rewards_public_read"          ON public.rewards          FOR SELECT USING (active = true);
CREATE POLICY "events_public_read"           ON public.events           FOR SELECT USING (true);

-- 어드민만 컨텐츠 수정 가능 (profiles.is_admin = true)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  );
$$;

CREATE POLICY "buildings_admin_write"       ON public.buildings        FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "buildings_admin_update"      ON public.buildings        FOR UPDATE USING (public.is_admin());
CREATE POLICY "restaurants_admin_write"     ON public.restaurants      FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "restaurants_admin_update"    ON public.restaurants      FOR UPDATE USING (public.is_admin());
CREATE POLICY "clubs_admin_write"           ON public.clubs            FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "clubs_admin_update"          ON public.clubs            FOR UPDATE USING (public.is_admin());
CREATE POLICY "cafeteria_admin_write"       ON public.cafeteria_menus  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "cafeteria_admin_update"      ON public.cafeteria_menus  FOR UPDATE USING (public.is_admin());
CREATE POLICY "events_admin_write"          ON public.events           FOR INSERT WITH CHECK (public.is_admin());
