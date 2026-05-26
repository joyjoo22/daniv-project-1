// 건물 상세 — 학생회관 예시. 히어로 + 길찾기/층별 + 오늘 학식 + 입주 시설 + 동아리방.
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Tag,
  Modal,
  HeartIcon,
  ChevronLeftIcon,
  WalkIcon,
} from '@/components/ui';
import { PageContainer } from '@/components/layout/PageContainer';
import { useIsDesktop } from '@/hooks/useBreakpoint';
import { useComingSoon } from '@/hooks/useComingSoon';
import { useUIStore } from '@/store/uiStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { MOCK_BUILDINGS, MOCK_CAFETERIA, MOCK_CLUBS } from '@/data/mock';

const FACILITIES = [
  { f: '1F', n: '학생식당',       s: '영업중',   v: 'mint',   i: '🍱' },
  { f: '1F', n: 'CU 편의점',      s: '24시간',   v: 'indigo', i: '🏪' },
  { f: '2F', n: '스터디 카페',    s: '08–22시',  v: 'amber',  i: '☕' },
  { f: '2F', n: '복사실',         s: '09–18시',  v: 'indigo', i: '🖨' },
  { f: 'B1', n: '샤워실/체육시설', s: '06–22시', v: 'mint',   i: '🚿' },
] as const;

export default function BuildingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const comingSoon = useComingSoon();
  const pushToast = useUIStore((s) => s.pushToast);

  const building = MOCK_BUILDINGS.find((b) => b.id === id) ?? MOCK_BUILDINGS[0];
  const clubs = MOCK_CLUBS.filter((c) => c.buildingId === building.id).slice(0, 4);

  // 즐겨찾기 store
  const { find: findFavorite, toggle: toggleFavorite, load: loadFavorites } = useFavoritesStore();
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);
  const favorited = !!findFavorite('building', building.id);

  const [floorModalOpen, setFloorModalOpen] = useState(false);

  const handleNavigate = () => {
    pushToast(`${building.name}으로 안내를 시작해요`, 'info');
    navigate('/map');
  };
  void comingSoon; // 더 이상 사용 안 함

  const handleFavorite = async () => {
    try {
      const { added } = await toggleFavorite({
        targetType: 'building',
        targetId: building.id,
        targetName: building.name,
        targetMeta: `${building.code} · 도보 ${building.walkMin}분`,
      });
      pushToast(added ? '즐겨찾기에 추가했어요' : '즐겨찾기에서 제거했어요', 'success');
    } catch {
      pushToast('처리 실패', 'error');
    }
  };

  const hero = (
    <div className="ph" style={{ height: isDesktop ? 260 : 200, position: 'relative', fontSize: 12 }}>
      {building.name} 외관 사진
      {!isDesktop && (
        <>
          <div style={{ position: 'absolute', top: 14, left: 14 }}>
            <Button variant="hero" aria-label="뒤로" onClick={() => navigate(-1)}>
              <ChevronLeftIcon size={20} />
            </Button>
          </div>
          <div style={{ position: 'absolute', top: 14, right: 14 }}>
            <Button variant="hero" aria-label="찜" onClick={handleFavorite}>
              <HeartIcon size={18} filled={favorited} />
            </Button>
          </div>
        </>
      )}
    </div>
  );

  const meta = (
    <>
      <p
        className="mono"
        style={{
          margin: 0,
          fontSize: 10,
          color: 'var(--accent-ink)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        {building.code} · {building.campus === 'jukjeon' ? '죽전캠퍼스' : '천안캠퍼스'}
      </p>
      <h2 style={{ margin: '2px 0 0', fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>
        {building.name}
      </h2>
      <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-3)' }}>
        {building.floors} · 도보 {building.walkMin}분
      </p>

      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button
          type="button"
          className="btn-ghost"
          onClick={handleNavigate}
          style={{ height: 38, background: 'var(--card)', border: '1px solid var(--line)' }}
        >
          <WalkIcon size={16} /> 길찾기
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setFloorModalOpen(true)}
          style={{ height: 38, background: 'var(--card)', border: '1px solid var(--line)' }}
        >
          층별 안내
        </button>
      </div>
    </>
  );

  const cafeteriaSection = (
    <Card style={{ marginTop: 18, padding: 0, overflow: 'hidden' }}>
      <div
        style={{
          padding: '14px 16px',
          background: 'var(--accent-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--accent-ink)' }}>오늘의 학식 · 점심</p>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>1층 학생식당</p>
        </div>
        <span
          style={{
            padding: '4px 10px',
            borderRadius: 999,
            background: 'var(--accent)',
            color: '#3a1d00',
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          11:30 — 14:00
        </span>
      </div>
      <div style={{ padding: '4px 16px 12px' }}>
        {MOCK_CAFETERIA.map((m, i) => (
          <div
            key={m.id}
            style={{
              padding: '12px 0',
              borderTop: i ? '1px solid var(--line)' : 'none',
              opacity: m.soldOut ? 0.45 : 1,
              display: 'flex',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: m.hot ? 'var(--accent-ink)' : 'var(--ink-3)',
                minWidth: 38,
              }}
            >
              {m.corner}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  lineHeight: 1.4,
                  textDecoration: m.soldOut ? 'line-through' : 'none',
                }}
              >
                {m.menu}
              </p>
            </div>
            {m.soldOut ? (
              <Tag variant="rose">품절</Tag>
            ) : (
              <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>
                {m.price.toLocaleString()}원
              </span>
            )}
          </div>
        ))}
        <p style={{ margin: '8px 2px 0', fontSize: 10, color: 'var(--ink-4)' }}>
          마지막 업데이트 · 12분 전 (식당 관리자)
        </p>
      </div>
    </Card>
  );

  const facilitiesSection = (
    <>
      <p
        style={{
          margin: '22px 0 10px 4px',
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--ink-3)',
          letterSpacing: 0,
        }}
      >
        입주 시설
      </p>
      <Card style={{ padding: 4 }}>
        {FACILITIES.map((row, i) => (
          <div
            key={row.n}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              borderTop: i ? '1px solid var(--line)' : 'none',
            }}
          >
            <span
              className="mono"
              style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-4)', width: 20 }}
            >
              {row.f}
            </span>
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 10,
                fontSize: 16,
                background: 'var(--bg-2)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {row.i}
            </span>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{row.n}</span>
            <Tag variant={row.v as 'mint' | 'indigo' | 'amber'}>{row.s}</Tag>
          </div>
        ))}
      </Card>
    </>
  );

  const clubsSection = (
    <>
      <p style={{ margin: '22px 0 10px 4px', fontSize: 13, fontWeight: 700, color: 'var(--ink-3)' }}>
        이 건물의 동아리방
      </p>
      <div
        style={{
          display: isDesktop ? 'grid' : 'flex',
          gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : undefined,
          gap: 8,
          overflowX: isDesktop ? undefined : 'auto',
        }}
      >
        {clubs.map((c) => (
          <Card
            key={c.id}
            style={{
              padding: 10,
              minWidth: 130,
              flexShrink: 0,
              cursor: 'pointer',
            }}
            onClick={() => navigate(`/club/${c.id}`)}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: c.logoColor ?? 'var(--primary)',
                color: '#fff',
                fontWeight: 800,
                fontSize: 14,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {c.name[0]}
            </div>
            <p style={{ margin: '8px 0 0', fontSize: 13, fontWeight: 700 }}>{c.name}</p>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>
              {c.category} · {c.room}
            </p>
          </Card>
        ))}
        {clubs.length === 0 && (
          <p style={{ fontSize: 12, color: 'var(--ink-4)', padding: 16 }}>등록된 동아리방이 없어요.</p>
        )}
      </div>
    </>
  );

  const floorModal = (
    <Modal
      open={floorModalOpen}
      onClose={() => setFloorModalOpen(false)}
      title={`${building.name} 층별 안내`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {Array.from(new Set(FACILITIES.map((f) => f.f))).map((floor) => {
          const items = FACILITIES.filter((f) => f.f === floor);
          return (
            <div key={floor}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <span
                  className="mono"
                  style={{
                    padding: '4px 10px',
                    borderRadius: 8,
                    background: 'var(--primary-soft)',
                    color: 'var(--primary-ink)',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {floor}
                </span>
                <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>
                  {items.length}개 시설
                </span>
              </div>
              <Card style={{ padding: 4 }}>
                {items.map((f, i) => (
                  <div
                    key={f.n}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 12px',
                      borderTop: i ? '1px solid var(--line)' : 'none',
                    }}
                  >
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        background: 'var(--bg-2)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                      }}
                    >
                      {f.i}
                    </span>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{f.n}</span>
                    <Tag variant={f.v as 'mint' | 'indigo' | 'amber'}>{f.s}</Tag>
                  </div>
                ))}
              </Card>
            </div>
          );
        })}
        <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--ink-4)', lineHeight: 1.5 }}>
          💡 시설 정보는 학생복지팀에서 관리합니다. 변경사항이 있으면 어드민에서 업데이트됩니다.
        </p>
      </div>
    </Modal>
  );

  if (isDesktop) {
    return (
      <>
        <PageContainer variant="wide" style={{ padding: '24px 24px 48px' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: 'var(--ink-3)',
              marginBottom: 16,
            }}
          >
            <ChevronLeftIcon size={16} /> 뒤로
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 24 }}>
            <div>
              <Card style={{ overflow: 'hidden', padding: 0 }}>
                {hero}
                <div style={{ padding: 20 }}>{meta}</div>
              </Card>
              {facilitiesSection}
              {clubsSection}
            </div>
            <div>{cafeteriaSection}</div>
          </div>
        </PageContainer>
        {floorModal}
      </>
    );
  }

  return (
    <>
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {hero}
      <div
        style={{
          padding: '18px 18px 24px',
          background: 'var(--bg)',
          borderRadius: '24px 24px 0 0',
          marginTop: -22,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {meta}
        {cafeteriaSection}
        {facilitiesSection}
        {clubsSection}
      </div>
    </div>
    {floorModal}
    </>
  );
}
