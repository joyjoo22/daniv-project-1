// 별점 컴포넌트 — 시안 ui.jsx의 Stars.
// 표시 전용(기본) 또는 interactive=true로 클릭 입력 가능.
import { StarIcon } from './Icon';

type StarsProps = {
  value?: number;
  size?: number;
  max?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
};

export function Stars({ value = 0, size = 14, max = 5, interactive = false, onChange }: StarsProps) {
  return (
    <div style={{ display: 'inline-flex', gap: 2, color: 'var(--accent-ink)' }}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.round(value);
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(i + 1)}
            style={{
              color: filled ? 'var(--accent)' : 'var(--line-2)',
              display: 'inline-flex',
              padding: interactive ? 2 : 0,
              cursor: interactive ? 'pointer' : 'default',
            }}
            aria-label={`별점 ${i + 1}`}
          >
            <StarIcon size={size} filled={filled} />
          </button>
        );
      })}
    </div>
  );
}
