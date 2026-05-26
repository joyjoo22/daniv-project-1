// 알림함 — 학사/스탬프/이벤트/일반 알림.
//
// 현재는 mock 데이터 기반 — localStorage 에 읽음 상태 영속화.
// 추후 백엔드 연결 시 fetch + WebSocket 으로 교체.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Chip, Tag, BellIcon, StampIcon, CalIcon, GiftIcon, TrophyIcon } from '@/components/ui';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { useIsDesktop } from '@/hooks/useBreakpoint';

type NotifCategory = '학사' | '스탬프' | '이벤트' | '동아리';

type Notification = {
  id: string;
  category: NotifCategory;
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
  href?: string; // 클릭 시 이동할 경로
};

// Mock — 실제는 API 호출.
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n-1',
    category: '스탬프',
    title: '🎉 스탬프 적립 완료',
    body: '단풍식당에서 스탬프 1개를 적립했어요. (+20p)',
    createdAt: '5분 전',
    isRead: false,
    href: '/stamp',
  },
  {
    id: 'n-2',
    category: '학사',
    title: '🎓 다음 수업 알림',
    body: '자료구조와 알고리즘 수업이 10분 후 IT관 403호에서 시작돼요.',
    createdAt: '15분 전',
    isRead: false,
    href: '/timetable',
  },
  {
    id: 'n-3',
    category: '이벤트',
    title: '🎁 신입생 EVENT',
    body: '도장 3개를 모으면 추첨에 응모할 수 있어요!',
    createdAt: '2시간 전',
    isRead: false,
    href: '/stamp',
  },
  {
    id: 'n-4',
    category: '동아리',
    title: '📷 사진동아리 한울 가입 안내',
    body: '신청서가 정상 접수되었어요. 3/15 까지 결과를 받게 됩니다.',
    createdAt: '어제',
    isRead: true,
    href: '/club/c-1',
  },
  {
    id: 'n-5',
    category: '학사',
    title: '📚 학사 공지',
    body: '2025-1학기 수강신청이 3/3 09:00 부터 시작됩니다.',
    createdAt: '3일 전',
    isRead: true,
  },
  {
    id: 'n-6',
    category: '이벤트',
    title: '☕ 리워드 새로 추가',
    body: 'BHC 뿌링클 1500p 리워드가 새로 등록되었어요.',
    createdAt: '1주 전',
    isRead: true,
    href: '/stamp',
  },
];

const STORAGE_KEY = 'daniv:notifications:v1';

const CATEGORY_ICON: Record<NotifCategory, React.ReactNode> = {
  학사:   <CalIcon size={18} />,
  스탬프: <StampIcon size={18} />,
  이벤트: <GiftIcon size={18} />,
  동아리: <TrophyIcon size={18} />,
};

const CATEGORY_COLOR: Record<NotifCategory, string> = {
  학사:   'var(--primary)',
  스탬프: 'var(--accent)',
  이벤트: 'oklch(0.62 0.16 18)',
  동아리: 'oklch(0.62 0.13 165)',
};

type Filter = 'all' | 'unread';

export default function NotificationsPage() {
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');
  const [items, setItems] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved) as Notification[];
    } catch {}
    return INITIAL_NOTIFICATIONS;
  });

  // localStorage 영속화
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const unread = items.filter((n) => !n.isRead);
  const visible = filter === 'unread' ? unread : items;

  const handleClick = (n: Notification) => {
    setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
    if (n.href) navigate(n.href);
  };

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((x) => ({ ...x, isRead: true })));
  };

  const handleClearAll = () => {
    if (!window.confirm('모든 알림을 삭제할까요?')) return;
    setItems([]);
  };

  return (
    <>
      <TopBar
        title="알림"
        onBack={() => navigate(-1)}
        action={
          unread.length > 0 ? (
            <button
              type="button"
              onClick={handleMarkAllRead}
              style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary-ink)' }}
            >
              모두 읽음
            </button>
          ) : items.length > 0 ? (
            <button
              type="button"
              onClick={handleClearAll}
              style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-4)' }}
            >
              모두 삭제
            </button>
          ) : undefined
        }
      />

      <PageContainer variant="narrow" style={{ padding: isDesktop ? '8px 24px 48px' : '0 16px 24px' }}>
        {/* 필터 */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          <Chip active={filter === 'all'} onCard onClick={() => setFilter('all')}>
            전체 {items.length}
          </Chip>
          <Chip active={filter === 'unread'} onCard onClick={() => setFilter('unread')}>
            안읽음
            {unread.length > 0 && (
              <span
                className="mono"
                style={{
                  marginLeft: 4,
                  padding: '0 5px',
                  borderRadius: 999,
                  background: 'var(--rose)',
                  color: '#fff',
                  fontSize: 9,
                  fontWeight: 700,
                }}
              >
                {unread.length}
              </span>
            )}
          </Chip>
        </div>

        {visible.length === 0 ? (
          <Card style={{ padding: 48, textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 30, marginBottom: 12 }}>🔔</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--ink-2)' }}>
              {filter === 'unread' ? '읽지 않은 알림이 없어요' : '알림이 없어요'}
            </p>
            {filter === 'unread' && (
              <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--ink-4)' }}>
                모든 알림을 확인했어요 ✨
              </p>
            )}
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {visible.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => handleClick(n)}
                style={{
                  background: n.isRead ? 'var(--card)' : 'var(--primary-soft)',
                  border: `1px solid ${n.isRead ? 'var(--line)' : 'oklch(0.86 0.06 270)'}`,
                  borderRadius: 16,
                  padding: 14,
                  display: 'flex',
                  gap: 12,
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                  position: 'relative',
                }}
              >
                {!n.isRead && (
                  <span
                    aria-label="안읽음"
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'var(--rose)',
                    }}
                  />
                )}
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    background: CATEGORY_COLOR[n.category],
                    color: '#fff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {CATEGORY_ICON[n.category]}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Tag variant="indigo">{n.category}</Tag>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, flex: 1, minWidth: 0 }}>
                      {n.title}
                    </p>
                  </div>
                  <p
                    style={{
                      margin: '4px 0 0',
                      fontSize: 12,
                      color: 'var(--ink-3)',
                      lineHeight: 1.5,
                    }}
                  >
                    {n.body}
                  </p>
                  <p
                    className="mono"
                    style={{ margin: '6px 0 0', fontSize: 10, color: 'var(--ink-4)' }}
                  >
                    {n.createdAt}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 빈 알림 보내기 안내 */}
        {items.length > 0 && (
          <p
            style={{
              margin: '20px 0 0',
              fontSize: 11,
              color: 'var(--ink-4)',
              textAlign: 'center',
              lineHeight: 1.6,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <BellIcon size={12} /> 알림 설정은 MY → 설정 에서 변경할 수 있어요
          </p>
        )}
      </PageContainer>
    </>
  );
}
