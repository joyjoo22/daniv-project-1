// Supabase 클라이언트 — 환경변수 설정 시에만 실제 인스턴스 생성.
// 미설정 시 null 반환하여 호출처에서 MSW mock 으로 자동 fallback.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { ENV, hasSupabase } from './env';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!hasSupabase()) return null;
  if (!client) {
    client = createClient(ENV.supabaseUrl, ENV.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}

// daniv 의 profiles 테이블 스키마 — schema.sql 과 일치.
export type ProfileRow = {
  id: string;
  email: string;
  nickname: string;
  department: string;
  student_id: string;
  avatar_url: string | null;
  level: number;
  campus: 'jukjeon' | 'cheonan';
  is_admin: boolean;
  joined_at: string;
  updated_at: string;
};
