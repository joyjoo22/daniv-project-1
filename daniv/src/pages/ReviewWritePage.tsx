// 리뷰 작성 — 별점 + 태그 + 텍스트 + 사진 + 방문 인증 + 등록 CTA.
// 등록 후: 포인트 갱신 + 토스트 + 상세 페이지로 복귀.
//
// 임시저장: localStorage 에 저장하여 페이지 재방문 시 복원.
// 카메라: 숨겨진 file input 을 ref 로 트리거.
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Tag,
  Chip,
  Stars,
  PlaceholderImage,
  FieldLabel,
  CameraIcon,
  CheckIcon,
  StampIcon,
} from '@/components/ui';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { useAsync } from '@/hooks/useAsync';
import { restaurantsApi } from '@/api';
import { usePointsStore } from '@/store/pointsStore';
import { useUIStore } from '@/store/uiStore';

const FEELING = ['', '별로', '그저그래요', '괜찮아요', '맛있어요', '또 가고 싶어요!'] as const;

const TAGS = [
  { label: '맛있어요',   defaultOn: true },
  { label: '가성비',     defaultOn: true },
  { label: '양 많아요',  defaultOn: false },
  { label: '혼밥',       defaultOn: false },
  { label: '빠른 서빙',  defaultOn: false },
  { label: '깨끗해요',   defaultOn: true },
  { label: '분위기',     defaultOn: false },
] as const;

type Draft = {
  rating: number;
  body: string;
  tags: string[];
};

const draftKey = (id: string) => `daniv:reviewDraft:${id}`;

export default function ReviewWritePage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pushToast = useUIStore((s) => s.pushToast);
  const loadPoints = usePointsStore((s) => s.load);

  const [rating, setRating] = useState(4);
  const [body, setBody] = useState('');
  const [activeTags, setActiveTags] = useState<Set<string>>(
    new Set(TAGS.filter((t) => t.defaultOn).map((t) => t.label)),
  );
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: restaurant } = useAsync(() => restaurantsApi.detail(id), [id]);

  // 임시저장 복원 (페이지 진입 시)
  useEffect(() => {
    if (!id) return;
    try {
      const saved = window.localStorage.getItem(draftKey(id));
      if (saved) {
        const d = JSON.parse(saved) as Draft;
        setRating(d.rating);
        setBody(d.body);
        setActiveTags(new Set(d.tags));
      }
    } catch {
      // 무시
    }
  }, [id]);

  const toggleTag = (label: string) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const handleSaveDraft = () => {
    if (!id) return;
    const draft: Draft = { rating, body, tags: Array.from(activeTags) };
    window.localStorage.setItem(draftKey(id), JSON.stringify(draft));
    pushToast('임시저장 되었어요 💾', 'success');
  };

  const handlePickPhoto = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    if (photos.length + files.length > 5) {
      pushToast('사진은 최대 5장까지 첨부할 수 있어요', 'error');
      return;
    }
    // 미리보기용 ObjectURL — PHASE 6 에선 클라이언트 사이드만, 추후 Supabase Storage 업로드 연동.
    const urls = files.map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...urls]);
    pushToast(`사진 ${files.length}장 추가됨 · +5p`, 'success');
    e.target.value = ''; // 같은 파일 재선택 허용
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos((prev) => {
      const next = [...prev];
      const removed = next.splice(idx, 1)[0];
      if (removed) URL.revokeObjectURL(removed);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!restaurant) return;
    if (body.trim().length < 5) {
      pushToast('5자 이상 작성해주세요.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await restaurantsApi.createReview({
        restaurantId: restaurant.id,
        rating,
        body: body.trim(),
        tags: Array.from(activeTags),
        photos,
      });
      // 등록 성공 — 임시저장 비우기.
      window.localStorage.removeItem(draftKey(restaurant.id));
      // 포인트 스토어 갱신 (MSW 핸들러가 +25p 누적)
      await loadPoints();
      pushToast('리뷰가 등록되었어요! +25p', 'success');
      navigate(`/food/${restaurant.id}`);
    } catch {
      pushToast('리뷰 등록에 실패했어요.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <TopBar
        title="리뷰 쓰기"
        onBack={() => navigate(-1)}
        action={
          <button
            type="button"
            onClick={handleSaveDraft}
            style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-4)' }}
          >
            임시저장
          </button>
        }
      />
      <PageContainer variant="narrow" style={{ padding: '0 18px 20px' }}>
        {/* 가게 정보 */}
        <Card
          style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}
        >
          <PlaceholderImage label="img" width={48} height={48} radius={12} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
              {restaurant?.name ?? '불러오는 중...'}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--ink-4)' }}>
              {restaurant?.category ?? ' '}
            </p>
          </div>
          <Tag variant="amber" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <StampIcon size={11} /> +20p
          </Tag>
        </Card>

        {/* 별점 */}
        <div style={{ textAlign: 'center', padding: '16px 0 20px' }}>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-3)' }}>이 가게는 어땠어요?</p>
          <div style={{ marginTop: 10, display: 'inline-flex', gap: 6 }}>
            <Stars value={rating} interactive onChange={setRating} size={36} />
          </div>
          <p
            style={{
              margin: '8px 0 0',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--ink-2)',
            }}
          >
            {FEELING[rating]}
          </p>
        </div>

        {/* 태그 */}
        <FieldLabel optional>어떤 점이 좋았어요?</FieldLabel>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {TAGS.map((t) => (
            <Chip key={t.label} active={activeTags.has(t.label)} onCard onClick={() => toggleTag(t.label)}>
              {t.label}
            </Chip>
          ))}
        </div>

        {/* 텍스트 */}
        <FieldLabel>자유롭게 후기를 적어주세요</FieldLabel>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="단대 친구들에게 도움이 되는 솔직한 후기를 남겨주세요."
          maxLength={1000}
          style={{
            width: '100%',
            minHeight: 110,
            padding: 14,
            fontSize: 14,
            borderRadius: 18,
            border: '1px solid var(--line)',
            background: 'var(--card)',
            resize: 'none',
            outline: 'none',
            lineHeight: 1.55,
            color: 'var(--ink)',
            fontFamily: 'inherit',
          }}
        />
        <p
          style={{
            margin: '6px 2px 0',
            fontSize: 11,
            color: 'var(--ink-4)',
            textAlign: 'right',
          }}
        >
          {body.length} / 1000
        </p>

        {/* 사진 */}
        <FieldLabel>
          사진 추가 <span style={{ color: 'var(--accent-ink)', fontWeight: 600 }}>+5p</span>
        </FieldLabel>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handlePickPhoto}
            disabled={photos.length >= 5}
            style={{
              width: 72,
              height: 72,
              borderRadius: 14,
              border: '1.5px dashed var(--line-2)',
              background: 'var(--card)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              color: 'var(--ink-3)',
              opacity: photos.length >= 5 ? 0.4 : 1,
            }}
          >
            <CameraIcon size={20} />
            <span className="mono" style={{ fontSize: 9 }}>{photos.length} / 5</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoSelected}
            style={{ display: 'none' }}
          />
          {photos.map((url, i) => (
            <div
              key={url}
              style={{ position: 'relative', width: 72, height: 72 }}
            >
              <img
                src={url}
                alt={`첨부 사진 ${i + 1}`}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 14,
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <button
                type="button"
                onClick={() => handleRemovePhoto(i)}
                aria-label="사진 제거"
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: 'var(--ink)',
                  color: 'var(--bg)',
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--bg)',
                }}
              >
                ✕
              </button>
            </div>
          ))}
          {photos.length === 0 && (
            <>
              <PlaceholderImage label="사진 1" width={72} height={72} radius={14} />
              <PlaceholderImage label="사진 2" width={72} height={72} radius={14} />
            </>
          )}
        </div>

        {/* 방문 인증 */}
        <Card
          style={{
            marginTop: 18,
            padding: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'var(--primary-soft)',
            border: '1px solid oklch(0.86 0.06 270)',
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              color: 'var(--primary-ink)',
              background: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckIcon size={18} />
          </span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--primary-ink)' }}>방문 인증 완료</p>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--primary-ink)', opacity: 0.7 }}>
              GPS · 10:32 인증됨
            </p>
          </div>
        </Card>

        <div style={{ marginTop: 24 }}>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? '등록 중...' : '리뷰 등록 · 총 +25p'}
          </Button>
        </div>
      </PageContainer>
    </>
  );
}
