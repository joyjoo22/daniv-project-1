// 온보딩 — 3-step 슬라이드 + 진행 dots + CTA
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, ArrowRightIcon } from '@/components/ui';
import { PageContainer } from '@/components/layout/PageContainer';

type Step = {
  tag: string;
  title: string;
  body: string;
  art: React.ReactNode;
};

function ArtMap() {
  return (
    <svg viewBox="0 0 240 240" width="100%" height="100%">
      <defs>
        <linearGradient id="o-map" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="oklch(0.94 0.04 270)" />
          <stop offset="1" stopColor="oklch(0.92 0.03 145)" />
        </linearGradient>
      </defs>
      <rect x="20" y="40" width="200" height="160" rx="20" fill="url(#o-map)" />
      <path
        d="M40 90 Q 80 70, 120 110 T 200 150"
        stroke="oklch(0.42 0.18 270)"
        strokeWidth="3"
        fill="none"
        strokeDasharray="6 5"
        strokeLinecap="round"
      />
      <rect x="50" y="60" width="22" height="18" rx="3" fill="#fff" />
      <rect x="160" y="170" width="28" height="18" rx="3" fill="#fff" />
      <circle cx="61" cy="69" r="6" fill="oklch(0.74 0.16 55)" />
      <circle cx="174" cy="179" r="10" fill="oklch(0.42 0.18 270)" />
      <circle cx="174" cy="179" r="4" fill="#fff" />
    </svg>
  );
}

function ArtCafeteria() {
  return (
    <svg viewBox="0 0 240 240" width="100%" height="100%">
      <rect x="40" y="50" width="160" height="140" rx="18" fill="oklch(0.96 0.025 60)" />
      <rect x="56" y="68" width="60" height="48" rx="8" fill="#fff" />
      <rect x="124" y="68" width="60" height="48" rx="8" fill="#fff" />
      <rect x="56" y="124" width="60" height="48" rx="8" fill="#fff" />
      <rect x="124" y="124" width="60" height="48" rx="8" fill="oklch(0.74 0.16 55)" />
      <circle cx="86" cy="92" r="10" fill="oklch(0.74 0.16 55)" />
      <circle cx="154" cy="92" r="10" fill="oklch(0.42 0.18 270)" />
      <circle cx="86" cy="148" r="10" fill="oklch(0.78 0.13 165)" />
      <rect x="138" y="140" width="32" height="16" rx="3" fill="#fff" />
      <text
        x="154"
        y="153"
        fontSize="11"
        fontWeight="700"
        fill="oklch(0.42 0.18 270)"
        textAnchor="middle"
        fontFamily="system-ui"
      >
        SOLD
      </text>
    </svg>
  );
}

function ArtStamp() {
  return (
    <svg viewBox="0 0 240 240" width="100%" height="100%">
      <rect x="40" y="50" width="160" height="140" rx="18" fill="oklch(0.94 0.05 60)" />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => {
          const i = r * 4 + c;
          const filled = i < 7;
          const cx = 70 + c * 32;
          const cy = 82 + r * 32;
          return (
            <g key={`${r}-${c}`}>
              <circle
                cx={cx}
                cy={cy}
                r="13"
                fill={filled ? 'oklch(0.42 0.18 270)' : '#fff'}
                stroke={filled ? 'none' : 'oklch(0.88 0.01 80)'}
                strokeWidth="1.5"
                strokeDasharray={filled ? '0' : '2 2'}
              />
              {filled && (
                <path
                  d={`M${cx - 4},${cy} l3,3 l5,-6`}
                  stroke="#fff"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </g>
          );
        }),
      )}
    </svg>
  );
}

const STEPS: Step[] = [
  {
    tag: '01 / 캠퍼스 가이드',
    title: '입학 첫날부터\n캠퍼스가 익숙해져요',
    body: '지도 위에 다음 강의 동선이 그려지고, 다음 수업 5분 전 알림이 울려요.',
    art: <ArtMap />,
  },
  {
    tag: '02 / 학식부터 카페까지',
    title: '오늘의 학식,\n지금 품절일까?',
    body: '건물 안 학식·카페·편의점의 실시간 운영 현황을 한눈에 볼 수 있어요.',
    art: <ArtCafeteria />,
  },
  {
    tag: '03 / 모으면 진짜 받는다',
    title: '방문하고, 리뷰하고,\n기프티콘으로 교환',
    body: '주변 가게에서 도장을 모아 포인트로 바꾸고, 진짜 기프티콘을 받아가세요.',
    art: <ArtStamp />,
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 480, margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px 20px 0' }}>
        <button
          type="button"
          onClick={() => navigate('/login')}
          style={{ fontSize: 14, color: 'var(--ink-3)', padding: '8px 4px' }}
        >
          건너뛰기
        </button>
      </div>

      <PageContainer variant="narrow" style={{ flex: 1, padding: '12px 28px 0' }}>
        <div className="daniv-enter" key={step} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              height: 240,
              borderRadius: 24,
              background: 'var(--bg-2)',
              border: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {s.art}
          </div>

          <div
            className="mono"
            style={{
              fontSize: 11,
              color: 'var(--primary-ink)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            {s.tag}
          </div>

          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
              whiteSpace: 'pre-line',
            }}
          >
            {s.title}
          </h1>

          <p
            style={{
              fontSize: 15,
              color: 'var(--ink-3)',
              lineHeight: 1.55,
              margin: 0,
              maxWidth: 320,
            }}
          >
            {s.body}
          </p>
        </div>
      </PageContainer>

      <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? 22 : 6,
                height: 6,
                borderRadius: 999,
                background: i === step ? 'var(--ink)' : 'var(--line-2)',
                transition: 'width .2s ease, background .2s ease',
              }}
            />
          ))}
        </div>

        <Button
          variant="primary"
          onClick={() => (last ? navigate('/login') : setStep((v) => v + 1))}
        >
          {last ? '단이브 시작하기' : '다음'}
          <ArrowRightIcon size={18} />
        </Button>
      </div>
    </div>
  );
}
