import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { PlainLayout, PublicLayout } from '@/components/layout/PlainLayout';
import { AdminShell } from '@/pages/admin/AdminShell';

import HomePage from '@/pages/HomePage';
import MapPage from '@/pages/MapPage';
import TimetablePage from '@/pages/TimetablePage';
import StampPage from '@/pages/StampPage';
import FoodListPage from '@/pages/FoodListPage';
import FoodDetailPage from '@/pages/FoodDetailPage';
import ReviewWritePage from '@/pages/ReviewWritePage';
import MyPage from '@/pages/MyPage';
import SettingsPage from '@/pages/SettingsPage';
import BuildingPage from '@/pages/BuildingPage';
import ClubPage from '@/pages/ClubPage';
import ClubListPage from '@/pages/ClubListPage';
import OnboardingPage from '@/pages/OnboardingPage';
import LoginPage from '@/pages/LoginPage';
import OfflinePage from '@/pages/OfflinePage';
import MyReviewsPage from '@/pages/MyReviewsPage';
import MyFavoritesPage from '@/pages/MyFavoritesPage';
import MyRewardsPage from '@/pages/MyRewardsPage';
import NotificationsPage from '@/pages/NotificationsPage';
import EventsPage from '@/pages/EventsPage';

import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminCafeteriaPage from '@/pages/admin/AdminCafeteriaPage';
import AdminClubsPage from '@/pages/admin/AdminClubsPage';
import AdminRestaurantsPage from '@/pages/admin/AdminRestaurantsPage';
import AdminBuildingsPage from '@/pages/admin/AdminBuildingsPage';
import AdminReportsPage from '@/pages/admin/AdminReportsPage';
import AdminRewardsPage from '@/pages/admin/AdminRewardsPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import VendorAdminPage from '@/pages/admin/VendorAdminPage';

export const router = createBrowserRouter([
  // ─── 5탭 + 시간표 (사이드바/하단탭) ───
  {
    element: <AppLayout />,
    children: [
      { path: '/',          element: <HomePage /> },
      { path: '/map',       element: <MapPage /> },
      { path: '/timetable', element: <TimetablePage /> },
      { path: '/stamp',     element: <StampPage /> },
      { path: '/food',      element: <FoodListPage /> },
      { path: '/clubs',     element: <ClubListPage /> },
      { path: '/me',        element: <MyPage /> },
    ],
  },

  // ─── 비인증 라우트 (온보딩 / 로그인 / 오프라인) ───
  {
    element: <PublicLayout />,
    children: [
      { path: '/onboarding', element: <OnboardingPage /> },
      { path: '/login',      element: <LoginPage /> },
      { path: '/offline',    element: <OfflinePage /> },
    ],
  },

  // ─── 보호된 상세 화면 (탭 없음, 인증 필요) ───
  {
    element: <PlainLayout />,
    children: [
      { path: '/food/:id',        element: <FoodDetailPage /> },
      { path: '/food/:id/review', element: <ReviewWritePage /> },
      { path: '/building/:id',    element: <BuildingPage /> },
      { path: '/club/:id',        element: <ClubPage /> },
      { path: '/settings',        element: <SettingsPage /> },
      // MY 하위 페이지
      { path: '/me/reviews',      element: <MyReviewsPage /> },
      { path: '/me/favorites',    element: <MyFavoritesPage /> },
      { path: '/me/rewards',      element: <MyRewardsPage /> },
      { path: '/notifications',   element: <NotificationsPage /> },
      { path: '/events',          element: <EventsPage /> },
    ],
  },

  // ─── 어드민 (데스크탑 셸) ───
  {
    path: '/admin',
    element: <AdminShell />,
    children: [
      { index: true,         element: <AdminDashboardPage /> },
      { path: 'cafeteria',   element: <AdminCafeteriaPage /> },
      { path: 'restaurants', element: <AdminRestaurantsPage /> },
      { path: 'clubs',       element: <AdminClubsPage /> },
      { path: 'buildings',   element: <AdminBuildingsPage /> },
      { path: 'reports',     element: <AdminReportsPage /> },
      { path: 'rewards',     element: <AdminRewardsPage /> },
      { path: 'users',       element: <AdminUsersPage /> },
    ],
  },
  { path: '/admin/vendor', element: <VendorAdminPage /> },

  // ─── fallback ───
  { path: '*', element: <Navigate to="/" replace /> },
]);
