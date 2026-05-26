import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

// 단이브 Vite 설정 — React + PWA + path alias(@/ → src/)
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // precache 대상 — 자주 변하지 않는 정적 자산 + 매니페스트 아이콘들.
      includeAssets: [
        'icons/icon-192.png',
        'icons/icon-512.png',
        'icons/icon-maskable-512.png',
        'icons/apple-touch-icon.png',
        'icons/favicon-16.png',
        'icons/favicon-32.png',
        'icons/icon.svg',
        'mockServiceWorker.js',
      ],
      manifest: {
        name: '단이브 DUCG DANIV',
        short_name: '단이브',
        description: '단국대학교 신입생을 위한 캠퍼스 가이드 PWA',
        theme_color: '#2a1f5c',
        background_color: '#f7f5f0',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        lang: 'ko',
        categories: ['education', 'lifestyle', 'navigation'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // precache 대상 파일 globs.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        // 백엔드 API 와 MSW 워커 자체는 precache 우회 (브라우저 직접 처리).
        navigateFallbackDenylist: [/^\/api\//, /^\/mockServiceWorker/],
        // SPA 새로고침/오프라인 진입 시 index.html 로 fallback.
        navigateFallback: '/index.html',
        // 런타임 캐싱 — 외부 도메인 + 자주 갱신되는 리소스.
        runtimeCaching: [
          // 네이버 지도 SDK / 타일 / 정적 리소스 — StaleWhileRevalidate.
          {
            urlPattern: /^https:\/\/(o?api|nrbe)\.map\.naver\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'naver-maps-sdk',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 7 }, // 7일
            },
          },
          {
            urlPattern: /^https:\/\/(map|ssl)\.pstatic\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'naver-static-assets',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }, // 30일
            },
          },
          // Open-Meteo 날씨 — NetworkFirst (실시간성 중요, 실패 시 캐시 fallback).
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'open-meteo-weather',
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 }, // 1시간
            },
          },
          // Pretendard + JetBrains Mono 폰트 (CDN) — CacheFirst (장기간).
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'jsdelivr-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 }, // 1년
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
      devOptions: {
        // 개발 모드에서는 SW 비활성화 (MSW 와 충돌 방지).
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    // 다른 dev 서버가 5173을 점유 중이면 자동 증가 대신 실패시킴.
    // 네이버 지도 NCP "Web 서비스 URL" 등록을 단순화하기 위함.
    strictPort: true,
    host: true,
  },
});
