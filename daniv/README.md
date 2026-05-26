# 단이브 (DUCG DANIV)

> 단국대학교 신입생을 위한 올인원 캠퍼스 가이드 PWA
>
> *DAN*kook + Un*IV* → **DANIV** (단이브)

---

## ✨ 기능 (예정)

1. 🗺 **지도 기반 캠퍼스 안내** — 네이버 지도 + 시간표 기반 이동 동선
2. 🍱 **음식점 리뷰 + 게이미피케이션** — 별점 리뷰 + 스탬프/포인트 + 기프티콘 교환
3. 🎓 **학사 정보** — 학교 행사, 학과 과방, 동아리방
4. 🏛 **건물 안내** — 학식 실시간 메뉴/품절, 입주 시설, 동아리방
5. 🚌 **교통 + 날씨** — 캠퍼스 날씨, 24번 버스, 죽전역 수인분당선

## 🛠 기술 스택

- **Build**: Vite 6
- **Framework**: React 18 + TypeScript
- **Routing**: React Router v6
- **State**: Zustand
- **Style**: Tailwind CSS (시안 토큰 통합) + OKLCH 색공간
- **HTTP**: Axios
- **PWA**: vite-plugin-pwa + workbox
- **Form**: React Hook Form + Zod
- **지도**: 네이버 지도 JS API (PHASE 6)

## 🚀 설치 / 실행

```powershell
# 1. 의존성 설치
npm install

# 2. 환경변수 준비
copy .env.example .env.local
# .env.local 에 실제 키 입력 (PHASE 6부터 필요)

# 3. 개발 서버
npm run dev          # http://localhost:5173

# 4. 프로덕션 빌드
npm run build
npm run preview      # 빌드 결과 미리보기

# 5. 타입 체크
npm run type-check
```

## 📁 폴더 구조

```
daniv/
├── public/
│   └── icons/              ← PWA 아이콘
├── src/
│   ├── pages/              ← 라우트 단위 화면
│   ├── components/
│   │   ├── ui/             ← Button, Card, Tag, Chip 등 공용 UI
│   │   └── layout/         ← BottomTab, TopBar, Phone shell
│   ├── store/              ← Zustand 스토어
│   ├── api/                ← Axios 인스턴스 + API 함수
│   ├── hooks/              ← 커스텀 훅 (useDarkMode 등)
│   ├── utils/              ← cn, formatters
│   ├── types/              ← 도메인 타입
│   ├── styles/             ← tokens.css, globals.css, animations.css
│   └── assets/             ← 로컬 이미지/아이콘
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## 📋 PHASE 진행 상황

- [x] **PHASE 0** — 디자인 시안 분석
- [x] **PHASE 1** — 프로젝트 초기화 (Vite + React + TS + Tailwind + PWA)
- [x] **PHASE 2** — 공통 컴포넌트 이식 (Button/Card/Tag/Stars/TabBar/TopBar/CampusMap …)
- [x] **PHASE 3** — 화면 이식 + 라우팅 (17개 화면 + 데스크탑 반응형)
- [x] **PHASE 4** — Zustand 스토어 + Axios API 레이어 + MSW 모킹
- [x] **PHASE 5** — 핵심 기능 통합 (Toast/AuthGuard/폼검증/리뷰/스탬프 GPS)
- [x] **PHASE 6** — 외부 API 연동 (네이버 지도 + Open-Meteo 날씨 + GPS)
- [ ] **PHASE 7** — PWA 마무리 (manifest/SW/오프라인)
- [ ] **PHASE 8** — 배포 (Vercel + GitHub Actions)

## 🔑 외부 API 키 설정 (PHASE 6+)

키 없이도 모든 화면이 정상 동작합니다 (MSW + Open-Meteo + CampusMap fallback). 키를 추가하면 자동으로 실제 데이터로 전환됩니다.

```powershell
copy .env.example .env.local
# .env.local 에 필요한 키만 채워 넣으세요
```

| 키 | 발급처 | 필수도 |
|---|---|---|
| `VITE_NAVER_MAP_CLIENT_ID` | [Naver Cloud Platform](https://console.ncloud.com/naver-service/application) → Maps → Web Dynamic Map | **권장** (없어도 CampusMap 자동 fallback) |
| `VITE_WEATHER_API_KEY` | [data.go.kr](https://www.data.go.kr/data/15084084/openapi.do) 기상청 단기예보 | 선택 (Open-Meteo로 자동 fallback) |
| `VITE_GBUS_API_KEY` | [gits.go.kr](https://www.gits.go.kr/main.do) 경기버스정보 | 선택 (백엔드 프록시 필요, mock 유지) |
| `VITE_SUBWAY_API_KEY` | [data.seoul.go.kr](https://data.seoul.go.kr/dataList/OA-12764/A/1/datasetView.do) 실시간 지하철 | 선택 (백엔드 프록시 필요) |

> ⚠ 한국 정부 API (기상청·버스·지하철) 는 CORS 미지원이라 백엔드 프록시 필요. 클라이언트 직접 호출 가능한 건 네이버 지도뿐.
> 그래서 PHASE 6 단계에서는 **네이버 지도 + Open-Meteo (무료, 키 불필요)** 가 즉시 실연동되고, 나머지는 백엔드 준비 후 동작합니다.

## 🎨 디자인 시스템

시안: [`../design-mockup/`](../design-mockup)

- **Primary**: `oklch(0.42 0.18 270)` 딥 인디고
- **Accent**: `oklch(0.74 0.16 55)` 웜 앰버
- **Font**: Pretendard Variable (본문) + JetBrains Mono (숫자)
- **Radius**: 8 / 12 / 18 / 22 / 28 px
- **Dark mode**: `<html class="dark">` 토글

## 📝 라이선스

내부 프로젝트.
