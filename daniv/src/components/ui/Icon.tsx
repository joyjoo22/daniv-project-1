// 단이브 아이콘 셋 — 시안 design-mockup/ui.jsx 의 I 객체를 그대로 이식.
// 24×24 viewBox 기준, currentColor stroke 사용. 모두 size prop 으로 크기 조절.
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

type StarIconProps = IconProps & { filled?: boolean };
type HeartIconProps = IconProps & { filled?: boolean };

function svgBase(size: number, rest: SVGProps<SVGSVGElement>) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    ...rest,
  };
}

export const HomeIcon = ({ size = 22, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
  </svg>
);

export const MapIcon = ({ size = 22, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z" />
    <path d="M9 4v16M15 6v16" />
  </svg>
);

export const PinIcon = ({ size = 22, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

export const CalIcon = ({ size = 22, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="16" rx="2.5" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export const StarIcon = ({ size = 22, filled = false, ...rest }: StarIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinejoin="round"
    {...rest}
  >
    <path d="m12 3 2.7 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17.3 6.5 20.3l1.1-6.3L3 9.6l6.3-.9L12 3Z" />
  </svg>
);

export const StampIcon = ({ size = 22, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v3l-3 3v3h6V9l-3-3V3" />
    <rect x="4" y="14" width="16" height="3" rx="1" />
    <path d="M4 20h16" />
  </svg>
);

export const UserIcon = ({ size = 22, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
  </svg>
);

export const BellIcon = ({ size = 20, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 2 6.5H4c.5-1 2-2.5 2-6.5Z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
);

export const SearchIcon = ({ size = 20, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={1.7} strokeLinecap="round">
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </svg>
);

export const ArrowRightIcon = ({ size = 18, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ChevronRightIcon = ({ size = 16, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const ChevronLeftIcon = ({ size = 18, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 6-6 6 6 6" />
  </svg>
);

export const CloseIcon = ({ size = 20, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={1.9} strokeLinecap="round">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const PlusIcon = ({ size = 18, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={2} strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const CameraIcon = ({ size = 22, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

export const WalkIcon = ({ size = 18, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13" cy="4.5" r="1.5" />
    <path d="M10 21l2-5 3-1-2-3 1-3 3 3h3" />
    <path d="M7 12l3-3 2 2-3 4 3 3" />
  </svg>
);

export const CloudIcon = ({ size = 22, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 18a4 4 0 0 1-.6-8 6 6 0 0 1 11.6 1A4 4 0 0 1 17 18H7Z" />
  </svg>
);

export const SunIcon = ({ size = 22, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={1.7} strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
  </svg>
);

export const BusIcon = ({ size = 20, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="13" rx="2.5" />
    <path d="M4 11h16M8 17v2M16 17v2" />
    <circle cx="8" cy="14.5" r="1" fill="currentColor" />
    <circle cx="16" cy="14.5" r="1" fill="currentColor" />
  </svg>
);

export const TrainIcon = ({ size = 20, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="3" width="12" height="15" rx="3" />
    <path d="M6 11h12M9 21l-2 1M15 21l2 1" />
    <circle cx="9" cy="15" r="1" fill="currentColor" />
    <circle cx="15" cy="15" r="1" fill="currentColor" />
  </svg>
);

export const HeartIcon = ({ size = 18, filled = false, ...rest }: HeartIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />
  </svg>
);

export const InstaIcon = ({ size = 18, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={1.6} strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

export const CheckIcon = ({ size = 18, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12 5 5 9-11" />
  </svg>
);

export const QrIcon = ({ size = 20, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={1.6}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h3v3M21 14v0M17 17v4M14 21h3M21 17v4" />
  </svg>
);

export const TrophyIcon = ({ size = 18, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
    <path d="M5 6H3v2a3 3 0 0 0 3 3M19 6h2v2a3 3 0 0 1-3 3" />
    <path d="M12 13v4M8 21h8M9 17h6" />
  </svg>
);

export const GiftIcon = ({ size = 18, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="9" width="18" height="12" rx="2" />
    <path d="M3 13h18M12 9v12" />
    <path d="M12 9c-2 0-4-1.5-4-3.5S10 3 12 5c2-2 4-1.5 4 .5S14 9 12 9Z" />
  </svg>
);

export const ShareIcon = ({ size = 18, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="m9 11 6-4M9 13l6 4" />
  </svg>
);

export const SettingsIcon = ({ size = 18, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
  </svg>
);

export const LayersIcon = ({ size = 18, ...rest }: IconProps) => (
  <svg {...svgBase(size, rest)} strokeWidth={1.7} strokeLinejoin="round">
    <path d="M12 3l9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5M3 18l9 5 9-5" />
  </svg>
);

// 시안의 I 객체와 동일한 형태로도 사용 가능하도록 namespace export
export const Icon = {
  home: (size = 22, props?: SVGProps<SVGSVGElement>) => <HomeIcon size={size} {...props} />,
  map: (size = 22, props?: SVGProps<SVGSVGElement>) => <MapIcon size={size} {...props} />,
  pin: (size = 22, props?: SVGProps<SVGSVGElement>) => <PinIcon size={size} {...props} />,
  cal: (size = 22, props?: SVGProps<SVGSVGElement>) => <CalIcon size={size} {...props} />,
  star: (size = 22, filled = false, props?: SVGProps<SVGSVGElement>) => (
    <StarIcon size={size} filled={filled} {...props} />
  ),
  stamp: (size = 22, props?: SVGProps<SVGSVGElement>) => <StampIcon size={size} {...props} />,
  user: (size = 22, props?: SVGProps<SVGSVGElement>) => <UserIcon size={size} {...props} />,
  bell: (size = 20, props?: SVGProps<SVGSVGElement>) => <BellIcon size={size} {...props} />,
  search: (size = 20, props?: SVGProps<SVGSVGElement>) => <SearchIcon size={size} {...props} />,
  arrowR: (size = 18, props?: SVGProps<SVGSVGElement>) => <ArrowRightIcon size={size} {...props} />,
  chevR: (size = 16, props?: SVGProps<SVGSVGElement>) => <ChevronRightIcon size={size} {...props} />,
  chevL: (size = 18, props?: SVGProps<SVGSVGElement>) => <ChevronLeftIcon size={size} {...props} />,
  close: (size = 20, props?: SVGProps<SVGSVGElement>) => <CloseIcon size={size} {...props} />,
  plus: (size = 18, props?: SVGProps<SVGSVGElement>) => <PlusIcon size={size} {...props} />,
  camera: (size = 22, props?: SVGProps<SVGSVGElement>) => <CameraIcon size={size} {...props} />,
  walk: (size = 18, props?: SVGProps<SVGSVGElement>) => <WalkIcon size={size} {...props} />,
  cloud: (size = 22, props?: SVGProps<SVGSVGElement>) => <CloudIcon size={size} {...props} />,
  sun: (size = 22, props?: SVGProps<SVGSVGElement>) => <SunIcon size={size} {...props} />,
  bus: (size = 20, props?: SVGProps<SVGSVGElement>) => <BusIcon size={size} {...props} />,
  train: (size = 20, props?: SVGProps<SVGSVGElement>) => <TrainIcon size={size} {...props} />,
  heart: (size = 18, filled = false, props?: SVGProps<SVGSVGElement>) => (
    <HeartIcon size={size} filled={filled} {...props} />
  ),
  insta: (size = 18, props?: SVGProps<SVGSVGElement>) => <InstaIcon size={size} {...props} />,
  check: (size = 18, props?: SVGProps<SVGSVGElement>) => <CheckIcon size={size} {...props} />,
  qr: (size = 20, props?: SVGProps<SVGSVGElement>) => <QrIcon size={size} {...props} />,
  trophy: (size = 18, props?: SVGProps<SVGSVGElement>) => <TrophyIcon size={size} {...props} />,
  gift: (size = 18, props?: SVGProps<SVGSVGElement>) => <GiftIcon size={size} {...props} />,
  share: (size = 18, props?: SVGProps<SVGSVGElement>) => <ShareIcon size={size} {...props} />,
  settings: (size = 18, props?: SVGProps<SVGSVGElement>) => <SettingsIcon size={size} {...props} />,
  layers: (size = 18, props?: SVGProps<SVGSVGElement>) => <LayersIcon size={size} {...props} />,
};
