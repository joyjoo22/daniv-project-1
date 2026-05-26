-- ============================================================================
-- 단이브 (DANIV) — 초기 시드 데이터
-- ----------------------------------------------------------------------------
-- schema.sql 실행 후 이 파일을 실행. 콜드스타트 방지용 풍부한 데모 데이터.
-- 실 운영 데이터로 교체하기 전까지 사용.
-- ============================================================================

-- ─── 건물 ───
INSERT INTO public.buildings (id, code, name, campus, floors, walk_min, lat, lng) VALUES
  ('b-11', 'B11', '학생회관',   'jukjeon', '지하 1층 ~ 지상 4층', 4, 37.3215, 127.1262),
  ('b-it', 'IT',  'IT관',       'jukjeon', '지하 1층 ~ 지상 6층', 7, 37.3220, 127.1270),
  ('b-eg', 'EG',  '공학관',     'jukjeon', '지상 5층',           5, 37.3219, 127.1258),
  ('b-ss', 'SS',  '사회과학관', 'jukjeon', '지상 5층',           3, 37.3213, 127.1265)
ON CONFLICT (id) DO NOTHING;

-- ─── 음식점 ───
INSERT INTO public.restaurants (id, name, category, price_tier, walk_min, hours, phone, image_label, has_stamp, hot) VALUES
  ('r-1', '단풍식당',      '한식 · 김치찌개', '₩₩',  3, '11–22시', '031-...4421', '한식', true,  true),
  ('r-2', '캠퍼스 라멘',   '일식 · 돈코츠',   '₩₩',  5, '11–21시', '031-...8830', '일식', true,  false),
  ('r-3', '정문 김밥천국', '분식',            '₩',   1, '24시간',  '031-...0021', '분식', false, false),
  ('r-4', 'STAFF COFFEE', '카페 · 핸드드립', '₩₩',  4, '08–22시', '031-...1240', '카페', true,  false),
  ('r-5', '후문 닭갈비',   '한식 · 회식',     '₩₩₩', 8, '16–23시', '031-...9911', '한식', true,  false),
  ('r-6', '꽃피는 분식',   '분식',            '₩',   6, '10–20시', '031-...4456', '분식', true,  false)
ON CONFLICT (id) DO NOTHING;

-- ─── 동아리 ───
INSERT INTO public.clubs (id, name, category, building_id, room, members_count, status, recruiting, instagram, description, president, meeting, fee, logo_color)
VALUES
  ('c-1', '사진동아리 한울', '문화/예술', 'b-11', '312', 48, '활성', true, 'dku_hanwool',
   '한울은 단국대학교 죽전캠퍼스의 사진 중앙동아리예요. 매학기 정기 출사와 작품전을 진행하며, 신입생 환영회와 흑백암실 워크샵을 운영합니다. 카메라가 없어도 가입할 수 있어요.',
   '이서연 · 24학번', '매주 화 18:00', 30000, '#241a5c'),
  ('c-2', 'RUNRUN',         '체육',     'b-11', '102', 31, '활성', true, 'dku_runrun',
   '러닝 + 트레일 동아리. 매주 토 캠퍼스 트레일 러닝.', '김도현 · 23학번', '매주 토 07:00', 20000, '#c14a3c'),
  ('c-3', '코드웍스',       '학술',     'b-it', '411', 62, '활성', true, 'dku_codeworks',
   '학술 개발 동아리. 해커톤·스터디·프로젝트 운영.', '박서영 · 23학번', '매주 목 19:00', 25000, '#3e9c84'),
  ('c-4', '푸드챌린저',     '취미',     'b-11', '218', 19, '검토중', false, NULL, NULL, NULL, NULL, NULL, NULL),
  ('c-5', '단대 합창단',    '문화/예술', 'b-ss', '105', 24, '활성', false, NULL, NULL, NULL, NULL, NULL, NULL),
  ('c-6', '사회봉사회',     '봉사',     'b-ss', 'B1',  41, '활성', true, NULL, NULL, NULL, NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- ─── 수상 내역 (한울) ───
INSERT INTO public.club_awards (club_id, year, title, description) VALUES
  ('c-1', '2024', '전국 대학사진 공모전 금상', '단체전 「길 위에서」'),
  ('c-1', '2023', '단국대 동아리 페스타 대상', '캠퍼스 다큐멘터리'),
  ('c-1', '2022', '교내 학술대회 우수상',     '사진과 기록');

-- ─── 리워드 ───
INSERT INTO public.rewards (id, name, points_required, stock, cover_color) VALUES
  ('rw-1', '스타벅스 아메리카노',  500,  12, 'oklch(0.62 0.12 165)'),
  ('rw-2', 'BBQ 황금올리브 1/2',  1200, 3,  'oklch(0.66 0.18 50)'),
  ('rw-3', 'GS25 5,000원권',      600,  24, 'oklch(0.58 0.16 235)'),
  ('rw-4', '교보문고 1만원권',    1000, 8,  'oklch(0.55 0.14 280)')
ON CONFLICT (id) DO NOTHING;

-- ─── 오늘의 학식 (학생회관, 점심) ───
INSERT INTO public.cafeteria_menus (building_id, date, meal, corner, menu, price, quantity, sold, sold_out, hot) VALUES
  ('b-11', current_date, 'lunch', '한식 A', '제육볶음 · 시금치무침 · 미역국 · 김치',    5500, 84,  21, false, true),
  ('b-11', current_date, 'lunch', '한식 B', '돈까스 · 단무지 · 양배추샐러드 · 미소국', 6000, 60,  60, true,  false),
  ('b-11', current_date, 'lunch', '양식 C', '스파게티 · 갈릭브레드 · 샐러드',           6500, 50,  12, false, false),
  ('b-11', current_date, 'lunch', '분식 D', '라면 · 김밥 · 만두 (2pc) · 단무지',        4500, 100, 38, false, false),
  ('b-11', current_date, 'lunch', '일품 E', '비빔밥 · 된장국 · 김치',                   5000, 40,  9,  false, false);

-- ─── 학사 일정 / 축제 ───
INSERT INTO public.events (title, description, category, campus, start_at, end_at, is_pinned) VALUES
  ('2025-1학기 개강',         '본 학기 정규수업 시작', '학사', 'jukjeon', '2025-03-04 00:00+09', '2025-06-21 23:59+09', true),
  ('단국 대동제',             '죽전캠퍼스 봄 축제',     '축제', 'jukjeon', '2025-05-21 12:00+09', '2025-05-23 23:00+09', true),
  ('동아리 박람회',           '중앙동아리 모집 박람회', '동아리','jukjeon','2025-03-10 11:00+09', '2025-03-12 17:00+09', false);
