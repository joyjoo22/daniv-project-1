// 즐겨찾기 전역 스토어 — 여러 페이지의 하트 버튼이 같은 상태를 공유.
//
// FoodDetailPage / ClubPage / BuildingPage 의 ❤️ 토글이 모두 이 store 를 통하면,
// MyFavoritesPage 와 자동으로 sync 됨.
import { create } from 'zustand';
import type { Favorite, FavoriteTarget } from '@/types/domain';
import { meApi, type AddFavoriteRequest } from '@/api';

type FavoritesState = {
  items: Favorite[];
  isLoaded: boolean;
  isLoading: boolean;

  load: () => Promise<void>;
  /** 특정 대상이 즐겨찾기 되어있는지 — Favorite 객체 반환 (없으면 undefined) */
  find: (type: FavoriteTarget, id: string) => Favorite | undefined;
  /** 토글 — 있으면 제거, 없으면 추가. 추가 시 메타 정보 필요. */
  toggle: (req: AddFavoriteRequest) => Promise<{ added: boolean }>;
  /** 직접 id 로 제거 (MyFavoritesPage 에서 사용) */
  remove: (id: string) => Promise<void>;
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  items: [],
  isLoaded: false,
  isLoading: false,

  load: async () => {
    if (get().isLoaded || get().isLoading) return;
    set({ isLoading: true });
    try {
      const items = await meApi.favorites();
      set({ items, isLoaded: true, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  find: (type, id) => get().items.find((f) => f.targetType === type && f.targetId === id),

  toggle: async (req) => {
    const existing = get().find(req.targetType, req.targetId);
    if (existing) {
      await meApi.removeFavorite(existing.id);
      set({ items: get().items.filter((f) => f.id !== existing.id) });
      return { added: false };
    } else {
      const created = await meApi.addFavorite(req);
      set({ items: [created, ...get().items] });
      return { added: true };
    }
  },

  remove: async (id) => {
    await meApi.removeFavorite(id);
    set({ items: get().items.filter((f) => f.id !== id) });
  },
}));
