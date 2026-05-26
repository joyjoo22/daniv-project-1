// 인증 스토어 — Supabase 가 설정되어 있으면 실제 DB, 없으면 기존 axios+MSW.
//
// 분기:
//   hasSupabase() === true  → Supabase Auth (auth.users + profiles 테이블)
//   hasSupabase() === false → authApi (axios → MSW mock)
//
// localStorage 영속화는 zustand persist 미들웨어로 처리.
// Supabase 의 세션 토큰은 자체 SDK가 localStorage(daniv-auth-token-default-...) 에 보관.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/domain';
import { authApi, type LoginRequest, type SignupRequest } from '@/api';
import { getSupabase, type ProfileRow } from '@/lib/supabase';
import { hasSupabase } from '@/lib/env';

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (req: LoginRequest) => Promise<void>;
  signup: (req: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  clearError: () => void;
  /** 프로필 사진 URL 변경 (로컬 — 추후 Supabase Storage 연동) */
  setAvatar: (avatarUrl: string) => void;
};

function profileToUser(p: ProfileRow): User {
  return {
    id: p.id,
    email: p.email,
    nickname: p.nickname,
    department: p.department,
    studentId: p.student_id,
    avatar: p.avatar_url ?? undefined,
    level: p.level,
    joinedAt: p.joined_at,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async ({ email, password }) => {
        set({ isLoading: true, error: null });
        try {
          if (hasSupabase()) {
            const supabase = getSupabase()!;
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            // Supabase 의 access token + profiles 조인.
            const { data: profile, error: pErr } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single<ProfileRow>();
            if (pErr) throw pErr;
            set({
              token: data.session?.access_token ?? null,
              user: profileToUser(profile),
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // Fallback — 기존 MSW.
            const { token, user } = await authApi.login({ email, password });
            window.localStorage.setItem('daniv:token', token);
            set({ token, user, isAuthenticated: true, isLoading: false });
          }
        } catch (e) {
          const msg =
            e instanceof Error ? e.message : '로그인에 실패했어요. 이메일/비밀번호를 확인해주세요.';
          set({ isLoading: false, error: msg });
          throw e;
        }
      },

      signup: async (req) => {
        set({ isLoading: true, error: null });
        try {
          if (hasSupabase()) {
            const supabase = getSupabase()!;
            // 1) auth.users 생성
            const { data, error } = await supabase.auth.signUp({
              email: req.email,
              password: req.password,
            });
            console.log('supabase.signUp', { data, error });
            if (error) throw error;
            const userId = data.user?.id;
            if (!userId) throw new Error('사용자 ID를 받지 못했어요.');

            // 2) profiles 행 생성 (RLS: profiles_insert_own — 본인 id 만 가능)
            const { error: pErr } = await supabase.from('profiles').insert({
              id: userId,
              email: req.email,
              nickname: req.nickname,
              department: req.department,
              student_id: req.studentId,
            });
            if (pErr) throw pErr;

            const { data: profile, error: selErr } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single<ProfileRow>();
            if (selErr) throw selErr;

            set({
              token: data.session?.access_token ?? null,
              user: profileToUser(profile),
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            const { token, user } = await authApi.signup(req);
            window.localStorage.setItem('daniv:token', token);
            set({ token, user, isAuthenticated: true, isLoading: false });
          }
        } catch (e) {
          const msg = e instanceof Error ? e.message : '회원가입에 실패했어요.';
          set({ isLoading: false, error: msg });
          throw e;
        }
      },

      logout: async () => {
        try {
          if (hasSupabase()) {
            await getSupabase()!.auth.signOut();
          } else {
            await authApi.logout();
          }
        } catch {
          // 클라이언트 상태는 항상 정리
        }
        window.localStorage.removeItem('daniv:token');
        set({ token: null, user: null, isAuthenticated: false });
      },

      hydrate: async () => {
        try {
          if (hasSupabase()) {
            const supabase = getSupabase()!;
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
              set({ token: null, user: null, isAuthenticated: false });
              return;
            }
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single<ProfileRow>();
            if (error) throw error;
            set({
              token: session.access_token,
              user: profileToUser(profile),
              isAuthenticated: true,
            });
            return;
          }

          const { token } = get();
          if (!token) return;
          const user = await authApi.me();
          set({ user, isAuthenticated: true });
        } catch {
          window.localStorage.removeItem('daniv:token');
          set({ token: null, user: null, isAuthenticated: false });
        }
      },

      clearError: () => set({ error: null }),

      setAvatar: (avatarUrl) => {
        const u = get().user;
        if (!u) return;
        set({ user: { ...u, avatar: avatarUrl } });
      },
    }),
    {
      name: 'daniv:auth',
      partialize: (s) => ({ token: s.token, user: s.user, isAuthenticated: s.isAuthenticated }),
    },
  ),
);
