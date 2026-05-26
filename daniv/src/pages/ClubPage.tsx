// 동아리 상세 — 로고 헤로 + 가입신청 + 메타 + 소개 + 수상내역 + 모집중 배너
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  HeartIcon,
  InstaIcon,
  PlusIcon,
  PinIcon,
  UserIcon,
  CalIcon,
  TrophyIcon,
} from '@/components/ui';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { MOCK_CLUBS } from '@/data/mock';
import { useIsDesktop } from '@/hooks/useBreakpoint';
import { clubsApi } from '@/api';
import { useUIStore } from '@/store/uiStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useComingSoon } from '@/hooks/useComingSoon';

const AWARDS = [
  { y: '2024', t: '전국 대학사진 공모전 금상',     k: '단체전 「길 위에서」' },
  { y: '2023', t: '단국대 동아리 페스타 대상',     k: '캠퍼스 다큐멘터리' },
  { y: '2022', t: '교내 학술대회 우수상',          k: '사진과 기록' },
] as const;

export default function ClubPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const pushToast = useUIStore((s) => s.pushToast);
  const comingSoon = useComingSoon();
  const club = MOCK_CLUBS.find((c) => c.id === id) ?? MOCK_CLUBS[0];

  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  // 즐겨찾기 store 와 연동.
  const { find: findFavorite, toggle: toggleFavorite, load: loadFavorites } = useFavoritesStore();
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);
  const favorited = !!findFavorite('club', club.id);

  const handleApply = async () => {
    if (applied) {
      pushToast('이미 가입 신청한 동아리예요', 'info');
      return;
    }
    setApplying(true);
    try {
      await clubsApi.apply(club.id);
      setApplied(true);
      pushToast(`${club.name} 가입 신청이 접수되었어요! 📩`, 'success');
    } catch {
      pushToast('가입 신청에 실패했어요. 잠시 후 다시 시도해주세요.', 'error');
    } finally {
      setApplying(false);
    }
  };

  const handleInstagram = () => {
    if (!club.instagram) {
      comingSoon('이 동아리는 인스타그램이 등록되지 않았어요');
      return;
    }
    window.open(`https://instagram.com/${club.instagram}`, '_blank', 'noopener,noreferrer');
  };

  const handleFavorite = async () => {
    try {
      const { added } = await toggleFavorite({
        targetType: 'club',
        targetId: club.id,
        targetName: club.name,
        targetMeta: `${club.category} · ${club.buildingName} ${club.room}`,
      });
      pushToast(added ? '즐겨찾기에 추가했어요' : '즐겨찾기에서 제거했어요', 'success');
    } catch {
      pushToast('처리 실패', 'error');
    }
  };

  return (
    <>
      <TopBar title="중앙동아리" onBack={() => navigate(-1)} />
      <PageContainer variant="narrow" style={{ padding: '0 18px 24px' }}>
        {/* 로고 헤로 */}
        <Card style={{ padding: 20, textAlign: 'center', overflow: 'hidden', position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.4,
              background:
                'radial-gradient(circle at 50% 0%, oklch(0.92 0.08 270), transparent 60%)',
            }}
          />
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 22,
              background: club.logoColor ?? 'var(--ink)',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: '-0.05em',
              margin: '0 auto 10px',
              position: 'relative',
              boxShadow: 'var(--sh-2)',
            }}
          >
            {club.name.replace(/^.{0,3}/, '').trim() || club.name[0]}
          </div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>{club.name}</h2>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--ink-3)', position: 'relative' }}>
            중앙동아리 · 설립 1992
          </p>

          <div
            style={{
              display: 'flex',
              gap: 6,
              justifyContent: 'center',
              marginTop: 14,
              position: 'relative',
            }}
          >
            <button
              type="button"
              onClick={handleApply}
              disabled={applying || applied}
              style={{
                height: 38,
                padding: '0 16px',
                borderRadius: 12,
                background: applied ? 'var(--mint)' : 'var(--ink)',
                color: applied ? '#0a3022' : 'var(--bg)',
                fontSize: 13,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                opacity: applying ? 0.7 : 1,
              }}
            >
              <PlusIcon size={14} /> {applied ? '신청 완료' : applying ? '신청 중...' : '가입 신청'}
            </button>
            <Button variant="icon" aria-label="인스타그램" onClick={handleInstagram}>
              <InstaIcon size={18} />
            </Button>
            <Button variant="icon" aria-label="찜" onClick={handleFavorite}>
              <HeartIcon size={18} filled={favorited} />
            </Button>
          </div>
        </Card>

        {/* 메타 정보 */}
        <Card style={{ marginTop: 12, padding: 0 }}>
          {[
            { l: '동아리방', v: `${club.buildingName} ${club.room}호`, i: <PinIcon size={16} /> },
            { l: '회장',     v: club.president ?? '미정',              i: <UserIcon size={16} /> },
            { l: '회비',     v: club.fee ? `학기당 ${club.fee.toLocaleString()}원` : '미정', i: '₩' },
            { l: '정기 모임', v: club.meeting ?? '미정',                 i: <CalIcon size={16} /> },
          ].map((m, i) => (
            <div
              key={m.l}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderTop: i ? '1px solid var(--line)' : 'none',
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 9,
                  background: 'var(--bg-2)',
                  color: 'var(--ink-3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {m.i}
              </span>
              <span style={{ flex: 1, fontSize: 12, color: 'var(--ink-3)' }}>{m.l}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{m.v}</span>
            </div>
          ))}
        </Card>

        {/* 소개 */}
        <p style={{ margin: '20px 4px 8px', fontSize: 13, fontWeight: 700, color: 'var(--ink-3)' }}>소개</p>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: 'var(--ink-2)',
            lineHeight: 1.6,
            padding: '0 4px',
          }}
        >
          {club.description ?? '소개가 아직 등록되지 않았어요.'}
        </p>

        {/* 수상 내역 */}
        <p style={{ margin: '20px 4px 10px', fontSize: 13, fontWeight: 700, color: 'var(--ink-3)' }}>
          수상 내역
        </p>
        <Card style={{ padding: 14 }}>
          {AWARDS.slice(0, club.awards).map((a, i) => (
            <div
              key={a.y + a.t}
              style={{
                display: 'flex',
                gap: 12,
                padding: '10px 0',
                borderTop: i ? '1px solid var(--line)' : 'none',
              }}
            >
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)', width: 36 }}>{a.y}</span>
              <span style={{ color: 'var(--accent-ink)', marginTop: 2 }}>
                <TrophyIcon size={14} />
              </span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{a.t}</p>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>{a.k}</p>
              </div>
            </div>
          ))}
          {club.awards === 0 && (
            <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-4)', textAlign: 'center' }}>
              등록된 수상 내역이 없어요.
            </p>
          )}
        </Card>

        {/* 모집중 배너 */}
        {club.recruiting && (
          <div
            style={{
              marginTop: 20,
              borderRadius: 22,
              padding: 18,
              background: 'var(--primary-soft)',
              border: '1px solid oklch(0.86 0.06 270)',
              display: 'flex',
              gap: 14,
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: 'var(--primary)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
              }}
            >
              📸
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--primary-ink)' }}>
                2025-1학기 모집 중
              </p>
              <p style={{ margin: 0, fontSize: 11, color: 'var(--primary-ink)', opacity: 0.75 }}>
                ~ 3/15 (토) · 신입생 환영
              </p>
            </div>
            <button
              type="button"
              onClick={handleApply}
              disabled={applying || applied}
              style={{
                padding: '8px 14px',
                borderRadius: 12,
                background: applied ? 'var(--mint)' : 'var(--ink)',
                color: applied ? '#0a3022' : 'var(--bg)',
                fontSize: 12,
                fontWeight: 700,
                opacity: applying ? 0.7 : 1,
              }}
            >
              {applied ? '신청 완료' : applying ? '신청 중...' : '지원하기'}
            </button>
          </div>
        )}

        {isDesktop && <div style={{ height: 24 }} />}
      </PageContainer>
    </>
  );
}
