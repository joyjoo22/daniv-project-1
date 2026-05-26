// PWA 아이콘 생성 스크립트 — SVG 마스터를 PNG (192/512/maskable 512) 로 변환.
//
// 사용: npm run gen:icons
//
// 마스터 SVG 는 인디고 배경 + 흰 단이브 워드마크 + 앰버 도트.
// maskable 은 safe zone(가운데 80%) 안에 아이콘을 배치하고 가장자리는 인디고로 채움.
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '..', 'public', 'icons');

// 라운드 사각형 + 워드마크 + 앰버 도트 — 일반 (non-maskable) 아이콘.
// SVG 의 viewBox 는 512×512.
const ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3a2a85"/>
      <stop offset="1" stop-color="#241a5c"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <circle cx="220" cy="240" r="120" fill="#ffffff"/>
  <circle cx="316" cy="316" r="48" fill="#241a5c"/>
  <circle cx="316" cy="316" r="38" fill="#d9994c"/>
  <text x="256" y="450" text-anchor="middle"
        font-family="Pretendard, -apple-system, system-ui, sans-serif"
        font-weight="900" font-size="62" fill="#ffffff" letter-spacing="-2">단이브</text>
</svg>
`.trim();

// maskable 아이콘 — safe zone 안에서만 컨텐츠 표시 (가장자리 ~10% 잘릴 수 있음).
// 배경은 풀-블리드 인디고, 컨텐츠는 가운데 80% 안에 배치.
const MASKABLE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#2a1f5c"/>
  <circle cx="240" cy="240" r="92" fill="#ffffff"/>
  <circle cx="296" cy="296" r="36" fill="#2a1f5c"/>
  <circle cx="296" cy="296" r="28" fill="#d9994c"/>
</svg>
`.trim();

const TARGETS = [
  { src: ICON_SVG,     size: 192, name: 'icon-192.png' },
  { src: ICON_SVG,     size: 512, name: 'icon-512.png' },
  { src: MASKABLE_SVG, size: 512, name: 'icon-maskable-512.png' },
  // Apple touch icon — iOS Safari 가 home screen 아이콘으로 사용.
  { src: ICON_SVG,     size: 180, name: 'apple-touch-icon.png' },
  // Favicon — 32×32, 16×16.
  { src: ICON_SVG,     size: 32,  name: 'favicon-32.png' },
  { src: ICON_SVG,     size: 16,  name: 'favicon-16.png' },
];

async function main() {
  await mkdir(outDir, { recursive: true });

  // SVG 마스터들을 별도 파일로도 저장 (수정/추적 용이).
  await writeFile(resolve(outDir, 'icon.svg'), ICON_SVG);
  await writeFile(resolve(outDir, 'icon-maskable.svg'), MASKABLE_SVG);

  for (const { src, size, name } of TARGETS) {
    const buffer = Buffer.from(src);
    const out = resolve(outDir, name);
    await sharp(buffer, { density: 384 })
      .resize(size, size, { fit: 'cover' })
      .png({ compressionLevel: 9 })
      .toFile(out);
    console.log(`✓ ${name} (${size}×${size})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
