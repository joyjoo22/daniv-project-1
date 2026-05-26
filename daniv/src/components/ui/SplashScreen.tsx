// 진입 스플래시 — 단이브 워드마크가 시퀀스로 등장 → 잠시 유지 → 부드럽게 사라짐.
//
// 타이밍 (총 ~1.6s):
//   0    ~ 500ms  : 인디고 원 등장 (back-easing)
//   200  ~ 600ms  : 앰버 도트 팝업 (overshoot)
//   350  ~ 700ms  : "단이브" 글자 슬라이드업
//   600  ~ 900ms  : "단국대 캠퍼스 가이드" 캡션 페이드인
//   1200 ~ 1600ms : 전체 페이드아웃 + 살짝 확대 + 블러 (앱으로 들어가는 느낌)
//
// 첫 방문(session) 에만 표시 → sessionStorage 로 재방문 시 즉시 스킵.
// PWA 첫 실행 시에도 보임.
import { useEffect, useState } from 'react';
import { useIsDesktop } from '@/hooks/useBreakpoint';

const SPLASH_KEY = 'daniv:splash:v1';
const SHOW_MS = 1200;
const OUT_MS = 420;

type Phase = 'visible' | 'leaving' | 'gone';

type SplashScreenProps = {
  /** 강제로 다시 보여줄 때 사용 (테스트). 기본은 sessionStorage 검사. */
  forceShow?: boolean;
};

export function SplashScreen({ forceShow = false }: SplashScreenProps) {
  const isDesktop = useIsDesktop();
  // 초기값을 동기적으로 결정해 첫 페인트에서 깜빡임 방지.
  const [phase, setPhase] = useState<Phase>(() => {
    if (typeof window === 'undefined') return 'gone';
    if (forceShow) return 'visible';
    return sessionStorage.getItem(SPLASH_KEY) ? 'gone' : 'visible';
  });

  // 타이머는 마운트 시 단 한번만 스케줄링.
  // [phase] 의존성이면 phase 변경 시 cleanup 이 다음 단계 타이머까지 클리어해서
  // 'leaving' 에 영원히 멈추는 버그가 있음 → 화면 전체를 덮어 클릭 차단됨.
  useEffect(() => {
    // 초기 상태가 'gone' 이면 (sessionStorage 이미 셋) 스킵.
    if (phase === 'gone') return;
    sessionStorage.setItem(SPLASH_KEY, '1');
    const t1 = window.setTimeout(() => setPhase('leaving'), SHOW_MS);
    const t2 = window.setTimeout(() => setPhase('gone'), SHOW_MS + OUT_MS);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 의도적으로 마운트 1회

  if (phase === 'gone') return null;

  // 모바일은 워드마크 약간 작게, 데스크탑은 크게.
  const logoSize = isDesktop ? 56 : 44;

  return (
    <div
      role="status"
      aria-label="단이브 로딩 중"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        // 단이브 톤 배경 — 미세한 라디얼 그라데이션.
        background:
          'radial-gradient(circle at 50% 35%, var(--primary-soft) 0%, var(--bg) 60%)',
        animation:
          phase === 'leaving'
            ? `daniv-splash-out ${OUT_MS}ms cubic-bezier(.4,0,.2,1) forwards`
            : undefined,
        // leaving 페이즈 (페이드아웃 중) 부터는 클릭이 아래 컨텐츠로 통과되게.
        // 만에 하나 phase 가 'gone' 으로 못 가도 클릭 차단 방지.
        pointerEvents: phase === 'leaving' ? 'none' : 'auto',
      }}
    >
      {/* 워드마크 — 시안의 인디고 원 + 앰버 도트 + "단이브" 한글. 컴포넌트 인라인 복제로 각 부위 독립 애니메이션 */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: logoSize * 0.3,
          color: 'var(--ink)',
        }}
      >
        {/* 인디고 원 (앰버 도트 부착) */}
        <span
          style={{
            position: 'relative',
            width: logoSize * 0.9,
            height: logoSize * 0.9,
            borderRadius: '50%',
            background: 'var(--primary)',
            animation: 'daniv-splash-circle 500ms cubic-bezier(.34,1.56,.64,1) both',
            boxShadow: '0 6px 24px oklch(0.42 0.18 270 / 0.25)',
          }}
        >
          <span
            style={{
              position: 'absolute',
              right: -logoSize * 0.04,
              bottom: -logoSize * 0.04,
              width: logoSize * 0.32,
              height: logoSize * 0.32,
              borderRadius: '50%',
              background: 'var(--accent)',
              boxShadow: '0 0 0 2px var(--bg), 0 4px 12px oklch(0.74 0.16 55 / 0.4)',
              animation:
                'daniv-splash-dot 400ms cubic-bezier(.34,1.56,.64,1) 200ms both',
            }}
          />
        </span>

        {/* "단이브" 워드마크 */}
        <span
          style={{
            fontSize: logoSize,
            fontWeight: 800,
            lineHeight: 1,
            color: 'var(--ink)',
            display: 'inline-block',
            animation: 'daniv-splash-text 400ms cubic-bezier(.2,.7,.3,1) 350ms both',
          }}
        >
          단이브
        </span>
      </div>

      {/* 캡션 */}
      <p
        style={{
          margin: 0,
          fontSize: 13,
          letterSpacing: '0.02em',
          color: 'var(--ink-3)',
          animation: 'daniv-splash-caption 500ms ease-out 600ms both',
        }}
      >
        단국대학교 캠퍼스 가이드
      </p>

      {/* 로딩 dots */}
      <div
        aria-hidden
        style={{
          display: 'flex',
          gap: 6,
          marginTop: 4,
          animation: 'daniv-splash-caption 400ms ease-out 700ms both',
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--primary)',
              animation: `daniv-splash-pulse 1.1s ease-in-out ${i * 0.18}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
