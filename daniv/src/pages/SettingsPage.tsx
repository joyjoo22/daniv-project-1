// 설정 — 테마(라이트/다크/시스템/스케줄) + 알림 + 일반 + 개인정보
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, SectionHead, ToggleRow, SelectRow, Modal } from '@/components/ui';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useComingSoon } from '@/hooks/useComingSoon';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';

type Theme = 'light' | 'dark' | 'system' | 'schedule';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { isDark, setTheme: setDarkTheme } = useDarkMode();
  const comingSoon = useComingSoon();
  const logout = useAuthStore((s) => s.logout);
  const pushToast = useUIStore((s) => s.pushToast);

  const [legalDoc, setLegalDoc] = useState<'terms' | 'privacy' | null>(null);

  const handleWithdraw = async () => {
    if (
      !window.confirm(
        '정말 탈퇴할까요? 작성한 리뷰와 스탬프는 모두 삭제되며 복구할 수 없어요.',
      )
    )
      return;
    pushToast('회원 탈퇴 처리는 곧 지원돼요. 우선 로그아웃 됩니다.', 'info');
    await logout();
    navigate('/onboarding', { replace: true });
  };

  const [theme, setTheme] = useState<Theme>(isDark ? 'dark' : 'light');
  const [start, setStart] = useState('19:00');
  const [end, setEnd] = useState('07:00');
  const [notif, setNotif] = useState({
    next: true,
    stamp: true,
    event: false,
    marketing: false,
  });

  const handleSelectTheme = (next: Theme) => {
    setTheme(next);
    // light/dark 만 즉시 반영. system/schedule 은 후처리 단순화 — 우선 라이트로.
    if (next === 'dark') setDarkTheme('dark');
    else if (next === 'light') setDarkTheme('light');
    else setDarkTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  };

  const t = (k: keyof typeof notif) => () => setNotif((n) => ({ ...n, [k]: !n[k] }));

  return (
    <>
      <TopBar title="설정" onBack={() => navigate(-1)} />
      <PageContainer variant="narrow" style={{ padding: '0 16px 24px' }}>
        {/* 테마 */}
        <SectionHead>화면 테마</SectionHead>
        <Card style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <ThemeTile dark={false} active={theme === 'light'} onClick={() => handleSelectTheme('light')} label="라이트" />
            <ThemeTile dark={true}  active={theme === 'dark'}  onClick={() => handleSelectTheme('dark')}  label="다크" />
          </div>
          <div style={{ marginTop: 10 }}>
            <ThemeRow
              active={theme === 'system'}
              onClick={() => handleSelectTheme('system')}
              icon="📱"
              title="시스템 설정 따르기"
              sub="iOS / Android 설정에 맞춰 자동 전환"
            />
            <ThemeRow
              active={theme === 'schedule'}
              onClick={() => handleSelectTheme('schedule')}
              icon="🌙"
              title="시간 예약 자동 전환"
              sub="해질녘부터 새벽까지 다크 모드"
              last
            />
          </div>
        </Card>

        {theme === 'schedule' && (
          <Card style={{ padding: 0, marginBottom: 12, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', background: 'var(--primary-soft)' }}>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--primary-ink)', fontWeight: 600 }}>
                매일 {start}부터 {end}까지 다크 모드가 적용됩니다
              </p>
            </div>
            <TimeRow label="다크 모드 시작" value={start} onChange={setStart} icon="🌒" />
            <TimeRow label="라이트 모드 시작" value={end} onChange={setEnd} icon="☀️" last />
          </Card>
        )}

        {theme === 'system' && (
          <Card
            style={{
              padding: '12px 14px',
              marginBottom: 12,
              background: 'var(--primary-soft)',
              border: '1px solid oklch(0.86 0.06 270)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{ fontSize: 18 }}>✨</span>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--primary-ink)' }}>
              현재 기기 설정 기반으로 자동 전환됩니다.
            </p>
          </Card>
        )}

        {/* 알림 */}
        <SectionHead>알림</SectionHead>
        <Card style={{ padding: 4, marginBottom: 12 }}>
          <ToggleRow icon="🔔" title="다음 수업 알림"   sub="수업 시작 5분 전"  on={notif.next}      onChange={t('next')} />
          <ToggleRow icon="🏷️" title="스탬프 · 포인트" sub="획득/만료 안내"    on={notif.stamp}     onChange={t('stamp')} />
          <ToggleRow icon="🎉" title="학사 일정 · 축제" sub="공식 행사 공지"    on={notif.event}     onChange={t('event')} />
          <ToggleRow icon="📣" title="이벤트 · 마케팅"  sub="리워드 충전 등"    on={notif.marketing} onChange={t('marketing')} last />
        </Card>

        {/* 일반 */}
        <SectionHead>일반</SectionHead>
        <Card style={{ padding: 4, marginBottom: 12 }}>
          <SelectRow icon="🌐" title="언어"           value="한국어"      onClick={() => comingSoon('영어 지원은 곧 추가돼요')} />
          <SelectRow icon="🏫" title="캠퍼스"         value="죽전" badge="천안 곧 출시" onClick={() => comingSoon('천안 캠퍼스 지원은 준비 중이에요')} />
          <SelectRow icon="📍" title="위치 권한"      value="앱 사용 중"  onClick={() => comingSoon('기기 설정에서 변경할 수 있어요')} />
          <SelectRow icon="🔋" title="데이터 절약 모드" value="자동" last onClick={() => comingSoon('데이터 절약 모드는 곧 추가돼요')} />
        </Card>

        {/* 개인정보 */}
        <SectionHead>개인정보 / 약관</SectionHead>
        <Card style={{ padding: 4, marginBottom: 12 }}>
          <SelectRow icon="🛡️" title="개인정보 처리방침"         onClick={() => setLegalDoc('privacy')} />
          <SelectRow icon="📄" title="이용약관"                  onClick={() => setLegalDoc('terms')} />
          <SelectRow icon="🆔" title="계정 · 데이터 다운로드"     onClick={() => comingSoon('데이터 다운로드는 곧 지원돼요')} />
          <SelectRow icon="❌" title="회원 탈퇴" danger last     onClick={handleWithdraw} />
        </Card>

        <p style={{ margin: '16px 0 0', fontSize: 10, color: 'var(--ink-4)', textAlign: 'center' }}>
          DANIV v0.3.0 · build 240312
        </p>
      </PageContainer>

      <Modal
        open={legalDoc !== null}
        onClose={() => setLegalDoc(null)}
        title={legalDoc === 'terms' ? '이용약관' : '개인정보 처리방침'}
      >
        {legalDoc === 'terms' ? <TermsContent /> : <PrivacyContent />}
      </Modal>
    </>
  );
}

function TermsContent() {
  return (
    <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7 }}>
      <p style={{ margin: '0 0 12px', fontSize: 11, color: 'var(--ink-4)' }}>
        v1.0 · 2025년 3월 시행
      </p>

      <h3 style={{ margin: '16px 0 6px', fontSize: 14, fontWeight: 800 }}>제 1조 (목적)</h3>
      <p style={{ margin: 0 }}>
        본 약관은 단이브 (이하 "서비스") 가 제공하는 단국대학교 캠퍼스 가이드 PWA 의 이용 조건 및 절차,
        이용자와 서비스 운영자의 권리·의무를 규정합니다.
      </p>

      <h3 style={{ margin: '16px 0 6px', fontSize: 14, fontWeight: 800 }}>제 2조 (가입 자격)</h3>
      <p style={{ margin: 0 }}>
        단국대학교 학적을 보유한 재학생/휴학생/졸업생에 한해 가입 가능하며, 학교 메일(@dankook.ac.kr) 인증이
        필요합니다.
      </p>

      <h3 style={{ margin: '16px 0 6px', fontSize: 14, fontWeight: 800 }}>제 3조 (콘텐츠 작성 정책)</h3>
      <p style={{ margin: 0 }}>
        리뷰 및 사용자 작성 콘텐츠는 사실에 기반해야 하며, 명예훼손·욕설·광고성 글은 신고에 따라 즉시
        숨김 처리되거나 삭제될 수 있습니다. 반복되는 위반 시 계정이 정지될 수 있습니다.
      </p>

      <h3 style={{ margin: '16px 0 6px', fontSize: 14, fontWeight: 800 }}>제 4조 (스탬프·포인트)</h3>
      <p style={{ margin: 0 }}>
        포인트는 학내 서비스 내에서만 사용되는 가상의 단위이며 현금 환급이 불가합니다. 부정한 방법으로
        획득한 포인트는 회수 처리됩니다.
      </p>

      <h3 style={{ margin: '16px 0 6px', fontSize: 14, fontWeight: 800 }}>제 5조 (서비스 운영)</h3>
      <p style={{ margin: 0 }}>
        학교 행사·축제 일정, 학식 메뉴, 동아리 정보 등 학사 관련 데이터의 정확성은 학생복지팀의 검수 주기에
        따릅니다. 운영자는 사전 공지 후 일시적으로 서비스를 중단할 수 있습니다.
      </p>

      <p style={{ margin: '20px 0 0', fontSize: 11, color: 'var(--ink-4)' }}>
        ※ 본 약관은 데모 버전입니다. 실제 서비스 출시 전 법무 검토를 거쳐 정식 버전으로 교체됩니다.
      </p>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7 }}>
      <p style={{ margin: '0 0 12px', fontSize: 11, color: 'var(--ink-4)' }}>
        v1.0 · 2025년 3월 시행
      </p>

      <h3 style={{ margin: '16px 0 6px', fontSize: 14, fontWeight: 800 }}>1. 수집하는 정보</h3>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        <li>필수: 이메일, 비밀번호(해시), 닉네임, 학과, 학번</li>
        <li>선택: 프로필 사진, 시간표</li>
        <li>자동: 위치 (스탬프 적립 시), 접속 IP, 기기 정보</li>
      </ul>

      <h3 style={{ margin: '16px 0 6px', fontSize: 14, fontWeight: 800 }}>2. 이용 목적</h3>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        <li>회원 식별, 인증, 부정 사용 방지</li>
        <li>맞춤형 알림 (다음 수업, 학식, 이벤트)</li>
        <li>스탬프 적립 시 위치 기반 방문 인증</li>
        <li>서비스 개선을 위한 통계 (식별 불가능한 집계 형태)</li>
      </ul>

      <h3 style={{ margin: '16px 0 6px', fontSize: 14, fontWeight: 800 }}>3. 보관 기간</h3>
      <p style={{ margin: 0 }}>
        회원 탈퇴 즉시 모든 개인정보는 영구 삭제됩니다. 단, 관련 법령에 따라 보관이 요구되는 거래 기록은
        해당 법령에서 정한 기간 동안 보관됩니다.
      </p>

      <h3 style={{ margin: '16px 0 6px', fontSize: 14, fontWeight: 800 }}>4. 제3자 제공</h3>
      <p style={{ margin: 0 }}>
        원칙적으로 제3자에게 제공하지 않습니다. 단, 법률에 따라 요구되는 경우 또는 사용자가 동의한 외부
        서비스 (예: 카카오 로그인) 의 경우에만 최소한의 정보가 제공됩니다.
      </p>

      <h3 style={{ margin: '16px 0 6px', fontSize: 14, fontWeight: 800 }}>5. 권리</h3>
      <p style={{ margin: 0 }}>
        언제든 본인 정보를 조회·수정·삭제하거나 계정 데이터 다운로드를 요청할 수 있습니다.
      </p>

      <p style={{ margin: '20px 0 0', fontSize: 11, color: 'var(--ink-4)' }}>
        ※ 본 방침은 데모 버전입니다. 실제 서비스 출시 전 개인정보보호위원회 가이드에 따라 정식 버전으로
        교체됩니다.
      </p>
    </div>
  );
}

type ThemeTileProps = {
  dark: boolean;
  active: boolean;
  onClick: () => void;
  label: string;
};

function ThemeTile({ dark, active, onClick, label }: ThemeTileProps) {
  const bg = dark ? 'oklch(0.16 0.012 270)' : 'oklch(0.985 0.005 80)';
  const card = dark ? 'oklch(0.22 0.014 270)' : '#fff';
  const ink = dark ? 'oklch(0.97 0.005 270)' : 'oklch(0.18 0.025 270)';
  const ink2 = dark ? 'oklch(0.68 0.01 270)' : 'oklch(0.52 0.015 270)';
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: 10,
        borderRadius: 16,
        border: active ? '2px solid var(--primary)' : '2px solid var(--line)',
        background: 'var(--card)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        cursor: 'pointer',
        transition: 'all .15s ease',
      }}
    >
      <div
        style={{
          height: 86,
          borderRadius: 10,
          background: bg,
          padding: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ height: 8, borderRadius: 3, background: ink, width: '50%' }} />
        <div
          style={{
            flex: 1,
            borderRadius: 6,
            background: card,
            padding: 5,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <div style={{ height: 4, borderRadius: 2, background: ink, width: '65%' }} />
          <div style={{ height: 3, borderRadius: 2, background: ink2, width: '85%' }} />
          <div style={{ height: 3, borderRadius: 2, background: ink2, width: '70%' }} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            border: active ? '5px solid var(--primary)' : '1.5px solid var(--line-2)',
            background: 'var(--card)',
          }}
        />
      </div>
    </button>
  );
}

type ThemeRowProps = {
  active: boolean;
  onClick: () => void;
  icon: string;
  title: string;
  sub: string;
  last?: boolean;
};

function ThemeRow({ active, onClick, icon, title, sub, last = false }: ThemeRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 4px',
        borderTop: !last ? '1px solid var(--line)' : 'none',
        width: '100%',
        textAlign: 'left',
        background: 'transparent',
        cursor: 'pointer',
      }}
    >
      <span
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: 'var(--bg-2)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
        }}
      >
        {icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{title}</p>
        <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>{sub}</p>
      </div>
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          border: active ? '6px solid var(--primary)' : '1.5px solid var(--line-2)',
          background: 'var(--card)',
          flexShrink: 0,
        }}
      />
    </button>
  );
}

type TimeRowProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: string;
  last?: boolean;
};

function TimeRow({ label, value, onChange, icon, last = false }: TimeRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        borderTop: !last ? '1px solid var(--line)' : 'none',
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{label}</span>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mono"
        style={{
          padding: '6px 10px',
          borderRadius: 10,
          background: 'var(--bg-2)',
          border: '1px solid var(--line)',
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--ink)',
          outline: 'none',
        }}
      />
    </div>
  );
}
