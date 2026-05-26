// app.jsx — DANIV design canvas: 9+ screens in iOS frames

const ROOT = ReactDOM.createRoot(document.getElementById("root"));

// ────────────────────────────────────────────────────────────
// PhoneFrame — wraps a screen in the iOS bezel
// ────────────────────────────────────────────────────────────
function PhoneFrame({ children, dark = false }) {
  return (
    <IOSDevice width={360} height={760} dark={dark}>
      {children}
    </IOSDevice>
  );
}

function App() {
  return (
    <DesignCanvas>
      {/* ── INTRO BANNER (post-it style note) ── */}
      <DCSection id="cover" title="단이브 (DANIV)" subtitle="단국대학교 신입생을 위한 올인원 캠퍼스 가이드 PWA · 모바일 UI 디자인">
        <DCPostIt width={300}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: "Pretendard Variable, system-ui" }}>
            <strong style={{ fontSize: 14 }}>디자인 시스템</strong>
            <div style={{ fontSize: 12, lineHeight: 1.55 }}>
              • Primary <code>oklch(.42 .18 270)</code> 딥 인디고<br/>
              • Accent <code>oklch(.74 .16 55)</code> 웜 앰버<br/>
              • Type: Pretendard + JetBrains Mono<br/>
              • Radius 16~24, soft shadow, mobile-first<br/>
              • 단국대 공식 브랜딩과 차별화된 오리지널 비주얼
            </div>
          </div>
        </DCPostIt>
        <DCPostIt width={300}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: "Pretendard Variable, system-ui" }}>
            <strong style={{ fontSize: 14 }}>사용 방법</strong>
            <div style={{ fontSize: 12, lineHeight: 1.55 }}>
              • 캔버스를 드래그/줌해서 둘러보세요<br/>
              • 각 화면 우측 상단 ⤢ 버튼으로 전체화면<br/>
              • 모든 화면은 실제로 인터랙티브 (탭, 별점, 폼 등)<br/>
              • 모바일 360×760 기준, PWA로 설치 가능한 구조
            </div>
          </div>
        </DCPostIt>
      </DCSection>

      {/* ── 1. ONBOARDING & AUTH ── */}
      <DCSection id="onboarding" title="01 · 첫 진입" subtitle="온보딩 3-step + 로그인/회원가입">
        <DCArtboard id="onb" label="온보딩 · 3-step (interactive)" width={360} height={760}>
          <OnboardingScreen />
        </DCArtboard>
        <DCArtboard id="login" label="로그인 · 회원가입 토글" width={360} height={760}>
          <LoginScreen />
        </DCArtboard>
      </DCSection>

      {/* ── 2. CORE — Home / Map / Timetable ── */}
      <DCSection id="core" title="02 · 메인 플로우" subtitle="홈 · 지도 · 시간표 — 가장 자주 쓰는 3개 탭">
        <DCArtboard id="home" label="홈 · 다음 수업 + 학식 + 날씨" width={360} height={760}>
          <HomeScreen />
        </DCArtboard>
        <DCArtboard id="map" label="캠퍼스 지도 · 동선" width={360} height={760}>
          <MapScreen />
        </DCArtboard>
        <DCArtboard id="tt" label="시간표 · 주간 그리드" width={360} height={760}>
          <TimetableScreen />
        </DCArtboard>
      </DCSection>

      {/* ── 3. RESTAURANT FLOW ── */}
      <DCSection id="food" title="03 · 맛집 & 리뷰" subtitle="리스트 → 상세 → 작성 + 방문 인증 (콜드 스타트 해결)">
        <DCArtboard id="r-list" label="맛집 리스트 · 필터" width={360} height={760}>
          <RestaurantListScreen />
        </DCArtboard>
        <DCArtboard id="r-detail" label="음식점 상세 · 리뷰" width={360} height={760}>
          <RestaurantDetailScreen />
        </DCArtboard>
        <DCArtboard id="r-write" label="리뷰 작성 · 별점 (interactive)" width={360} height={760}>
          <WriteReviewScreen />
        </DCArtboard>
      </DCSection>

      {/* ── 4. GAMIFICATION ── */}
      <DCSection id="stamp" title="04 · 스탬프 & 리워드" subtitle="포켓스탑 컨셉 — 방문 인증 → 포인트 → 기프티콘">
        <DCArtboard id="stamp-book" label="스탬프북 · 포인트 · 리워드" width={360} height={760}>
          <StampBookScreen />
        </DCArtboard>
      </DCSection>

      {/* ── 5. CAMPUS DETAIL ── */}
      <DCSection id="campus" title="05 · 캠퍼스 정보" subtitle="건물 상세 (학식 실시간) · 동아리 상세 · 마이페이지">
        <DCArtboard id="bldg" label="학생회관 · 학식 실시간" width={360} height={760}>
          <BuildingScreen />
        </DCArtboard>
        <DCArtboard id="club" label="중앙동아리 상세" width={360} height={760}>
          <ClubScreen />
        </DCArtboard>
        <DCArtboard id="me" label="마이페이지" width={360} height={760}>
          <MyPageScreen />
        </DCArtboard>
      </DCSection>

      {/* ── 6. DARK MODE VARIANTS ── */}
      <DCSection id="dark" title="06 · 다크 모드 & 설정" subtitle="동일 디자인의 다크 변형 + 자동 전환 설정 화면">
        <DCArtboard id="d-home" label="홈 · 다크" width={360} height={760}>
          <HomeScreen dark />
        </DCArtboard>
        <DCArtboard id="d-map" label="지도 · 다크" width={360} height={760}>
          <MapScreen dark />
        </DCArtboard>
        <DCArtboard id="d-tt" label="시간표 · 다크" width={360} height={760}>
          <TimetableScreen dark />
        </DCArtboard>
        <DCArtboard id="d-stamp" label="스탬프북 · 다크" width={360} height={760}>
          <StampBookScreen dark />
        </DCArtboard>
        <DCArtboard id="d-me" label="MY · 다크" width={360} height={760}>
          <MyPageScreen dark />
        </DCArtboard>
        <DCArtboard id="settings-light" label="설정 · 자동 전환 토글 (interactive)" width={360} height={760}>
          <SettingsScreen />
        </DCArtboard>
        <DCArtboard id="settings-dark" label="설정 · 다크" width={360} height={760}>
          <SettingsScreen dark />
        </DCArtboard>
      </DCSection>

      {/* ── 7. ADMIN ── */}
      <DCSection id="admin" title="07 · 어드민 페이지" subtitle="학생복지팀 / 식당 / 동아리 운영자용 — 데스크탑 + 사장님 모바일">
        <DCArtboard id="adm-dash" label="대시보드 · 캠퍼스 현황" width={1180} height={780}>
          <ChromeWindow tabs={[{ title: "DANIV Admin" }]} url="admin.daniv.app/dashboard" width={1180} height={780}>
            <AdminDashboard />
          </ChromeWindow>
        </DCArtboard>
        <DCArtboard id="adm-caf" label="학식 메뉴 · 품절 실시간 토글" width={1180} height={780}>
          <ChromeWindow tabs={[{ title: "DANIV Admin · 학식" }]} url="admin.daniv.app/cafeteria" width={1180} height={780}>
            <AdminCafeteria />
          </ChromeWindow>
        </DCArtboard>
        <DCArtboard id="adm-club" label="동아리 관리 · 정보 편집" width={1180} height={780}>
          <ChromeWindow tabs={[{ title: "DANIV Admin · 동아리" }]} url="admin.daniv.app/clubs" width={1180} height={780}>
            <AdminClubs />
          </ChromeWindow>
        </DCArtboard>
        <DCArtboard id="adm-mobile" label="사장님 모드 · 한 손 토글 (interactive)" width={360} height={760}>
          <MobileVendorAdmin />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ROOT.render(<App />);
