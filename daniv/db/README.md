# 단이브 DB 설정 가이드 (Supabase)

## 1. Supabase 프로젝트 생성

1. https://supabase.com 가입 → **New project**
2. Project name: `daniv` (또는 자유)
3. Database password: 안전한 비밀번호 (저장해두세요)
4. Region: `Northeast Asia (Seoul)` 권장
5. Plan: Free (개발용 충분)

## 2. SQL 스키마 실행

1. 대시보드 좌측 메뉴 → **SQL Editor** → **New query**
2. [`schema.sql`](./schema.sql) 전체 내용 복사 → 붙여넣기 → **Run**
3. 성공 메시지 확인 (테이블 13개 + RLS 정책 생성)
4. 같은 방법으로 [`seed.sql`](./seed.sql) 실행 (초기 데모 데이터)

## 3. 인증 설정

1. **Authentication** → **Providers** → **Email** 활성화 확인
2. **Confirm email** 옵션:
   - 개발 중: **비활성화** (이메일 인증 없이 즉시 가입)
   - 운영 시: **활성화** + SMTP 설정
3. (선택) Site URL 등록: `http://localhost:5173`

## 4. 클라이언트 키 발급

1. **Project Settings** (좌하단 톱니바퀴) → **API**
2. 다음 두 값을 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Project API keys → anon public**: `eyJhbGc...` (긴 JWT)

## 5. 단이브 앱에 연결

`daniv/.env.local` 에 키 추가:

```dotenv
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJI...
```

dev 서버 재시작:

```powershell
npm run dev
```

## 6. 동작 확인

| 경로 | 동작 |
|---|---|
| `/login` → 회원가입 탭 → 정보 입력 → 가입 완료 | Supabase `auth.users` 에 행 생성 + `public.profiles` 에 행 생성 |
| `/login` → 로그인 | Supabase Auth 토큰 발급 |
| Supabase 대시보드 → **Authentication** → **Users** | 가입한 사용자 보임 |
| Supabase 대시보드 → **Table Editor** → **profiles** | 닉네임/학과/학번 행 확인 |

## 7. 자동 분기 동작

- `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` **둘 다 설정** → Supabase 실제 DB 사용
- 둘 중 하나라도 비어 있으면 → **MSW mock** 자동 사용 (개발 편의)

`src/lib/env.ts` 의 `hasSupabase()` 헬퍼가 분기 판단을 담당합니다.

## 트러블슈팅

### 가입 시 "new row violates row-level security policy"

→ `profiles_insert_own` RLS 정책이 동작 중. 가입 후 `profiles.insert({ id: data.user.id, ... })` 의 `id` 가 `auth.uid()` 와 일치해야 합니다. authStore.signup() 의 코드 흐름이 이 패턴을 따르므로 문제 없어야 함. 만약 발생 시 schema.sql 의 RLS 정책 부분 재실행 확인.

### "duplicate key value violates unique constraint profiles_nickname_unique_lower_idx"

→ 이미 사용 중인 닉네임. 다른 닉네임 사용.

### 이메일 인증 메일이 안 옴

→ Authentication → Settings → Email Provider 의 SMTP 미설정. 개발 중에는 **Confirm email** 옵션을 끄는 것을 권장.
