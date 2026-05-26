// 세그먼트 컨트롤 — 시안의 .seg + button[data-active] 패턴.
type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedProps<T extends string> = {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  style?: React.CSSProperties;
};

export function Segmented<T extends string>({ options, value, onChange, className, style }: SegmentedProps<T>) {
  return (
    <div className={`seg ${className ?? ''}`} style={style}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          data-active={value === opt.value ? 'true' : undefined}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
