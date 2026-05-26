// MY 페이지 — 프로필 카드 + 4 stat + 이벤트 배너 + 활동·설정 메뉴
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Tag, MenuRow, Button, SettingsIcon } from '@/components/ui';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { useIsDesktop } from '@/hooks/useBreakpoint';
import { useComingSoon } from '@/hooks/useComingSoon';
import { useAsync } from '@/hooks/useAsync';
import { useAuthStore } from '@/store/authStore';
import { usePointsStore } from '@/store/pointsStore';
import { useUIStore } from '@/store/uiStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { meApi } from '@/api';

export default function MyPage() {
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const comingSoon = useComingSoon();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const setAvatar = useAuthStore((s) => s.setAvatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePickAvatar = () => fileInputRef.current?.click();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      pushToast('이미지 파일만 업로드 가능해요', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      pushToast('5MB 이하 파일만 업로드 가능해요', 'error');
      return;
    }
    const url = URL.createObjectURL(file);
    setAvatar(url);
    pushToast('프로필 사진이 변경됐어요', 'success');
    e.target.value = '';
  };
  const { total: points, stamps, load: loadPoints } = usePointsStore();
  const pushToast = useUIStore((s) => s.pushToast);

  // 즐겨찾기 / 리뷰 / 리워드 카운트 — 실제 API 기반.
  const { items: favorites, load: loadFavorites } = useFavoritesStore();
  const { data: reviews } = useAsync(() => meApi.reviews(), []);
  const { data: redemptions } = useAsync(() => meApi.redemptions(), []);

  const favoritesCount = favorites.length;
  const reviewsCount = reviews?.length ?? 0;
  const redemptionsCount = redemptions?.length ?? 0;

  useEffect(() => {
    loadPoints();
    loadFavorites();
  }, [loadPoints, loadFavorites]);

  const handleLogout = async () => {
    if (!window.confirm('정말 로그아웃 할까요?')) return;
    await logout();
    pushToast('로그아웃 되었어요', 'success');
    navigate('/onboarding', { replace: true });
  };

  const obtainedStamps = stamps.filter((s) => s.obtained).length;
  const nickname = user?.nickname ?? '단풍이';
  const department = user?.department ?? '컴퓨터공학과';
  const studentId = user?.studentId ?? '25';
  const email = user?.email ?? 'danpoong@dankook.ac.kr';
  const level = user?.level ?? 1;

  return (
    <>
      <TopBar
        title="MY"
        action={
          <Button variant="icon" aria-label="설정" onClick={() => navigate('/settings')}>
            <SettingsIcon size={18} />
          </Button>
        }
      />
      <PageContainer variant="narrow" style={{ padding: isDesktop ? '8px 24px 48px' : '0 16px 24px' }}>
        {/* 프로필 카드 */}
        <Card style={{ padding: 18, display: 'flex', gap: 14, alignItems: 'center' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: user?.avatar ? 'transparent' : 'var(--primary)',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 800,
              border: '3px solid var(--card)',
              boxShadow: 'var(--sh-2)',
              position: 'relative',
              overflow: 'visible',
              backgroundImage: user?.avatar ? `url(${user.avatar})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {!user?.avatar && nickname[0]}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={handlePickAvatar}
              style={{
                position: 'absolute',
                right: -2,
                bottom: -2,
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'var(--accent)',
                color: '#3a1d00',
                fontSize: 11,
                fontWeight: 800,
                border: '2px solid var(--card)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              aria-label="프로필 사진 변경"
            >
              +
            </button>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>
                {nickname}
              </p>
              <Tag variant="amber">Lv.{level}</Tag>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--ink-3)' }}>
              {department} · {studentId}학번
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--ink-4)' }}>{email}</p>
          </div>
        </Card>

        {/* 통계 */}
        <Card style={{ marginTop: 10, padding: '16px 0', display: 'flex' }}>
          {(
            [
              [`${points}p`,                  '포인트', () => navigate('/stamp')],
              [String(obtainedStamps),        '스탬프', () => navigate('/stamp')],
              [String(reviewsCount),          '리뷰',   () => navigate('/me/reviews')],
              [String(redemptionsCount),      '리워드', () => navigate('/me/rewards')],
            ] as Array<[string, string, () => void]>
          ).map(([n, l, onClick], i) => (
            <button
              type="button"
              key={l}
              onClick={onClick}
              style={{
                flex: 1,
                textAlign: 'center',
                borderLeft: i ? '1px solid var(--line)' : 'none',
                background: 'transparent',
                padding: 0,
              }}
            >
              <p className="mono" style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>
                {n}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--ink-3)' }}>{l}</p>
            </button>
          ))}
        </Card>

        {/* 이벤트 배너 */}
        <button
          type="button"
          onClick={() => navigate('/events')}
          style={{
            marginTop: 12,
            padding: '16px 18px',
            borderRadius: 22,
            background: 'var(--hero-bg)',
            color: 'var(--hero-fg)',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: -30,
              top: -30,
              width: 140,
              height: 140,
              borderRadius: '50%',
              background: 'var(--accent)',
              opacity: 0.35,
              filter: 'blur(18px)',
            }}
          />
          <div style={{ flex: 1, position: 'relative' }}>
            <p style={{ margin: 0, fontSize: 11, opacity: 0.6 }}>3월 신입생 EVENT</p>
            <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em' }}>
              도장 3개 모으면 추첨 응모
            </p>
          </div>
          <span style={{ fontSize: 30 }}>🎁</span>
        </button>

        {/* 활동 메뉴 */}
        <p
          style={{
            margin: '20px 4px 8px',
            fontSize: 12,
            color: 'var(--ink-4)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          활동
        </p>
        <Card style={{ padding: 4 }}>
          <MenuRow label="내 리뷰"     value={`${reviewsCount}개`}      onClick={() => navigate('/me/reviews')} />
          <MenuRow label="즐겨찾기"    value={`${favoritesCount}개`}   onClick={() => navigate('/me/favorites')} />
          <MenuRow label="포인트 내역"                                  onClick={() => navigate('/stamp')} />
          <MenuRow label="받은 리워드" value={`${redemptionsCount}개`} onClick={() => navigate('/me/rewards')} last />
        </Card>

        {/* 설정 메뉴 */}
        <p
          style={{
            margin: '20px 4px 8px',
            fontSize: 12,
            color: 'var(--ink-4)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          설정
        </p>
        <Card style={{ padding: 4 }}>
          <MenuRow label="알림 설정" value="수업 5분 전" onClick={() => navigate('/settings')} />
          <MenuRow label="테마"      value="라이트"     onClick={() => navigate('/settings')} />
          <MenuRow label="이용 약관"                    onClick={() => comingSoon()} />
          <MenuRow label="로그아웃"  danger last        onClick={handleLogout} />
        </Card>

        <p style={{ margin: '16px 0 0', fontSize: 10, color: 'var(--ink-4)', textAlign: 'center' }}>
          DANIV v0.7.0 · 죽전캠퍼스
        </p>
      </PageContainer>
    </>
  );
}
