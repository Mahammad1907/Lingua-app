// 🔌 Supabase Bağlantısı

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

/**
 * Supabase client.
 *
 * - `.env` faylı varsa → işləyən client
 * - `.env` yoxdursa → `null` (tətbiq çökmür, sadəcə auth funksiyaları işləmir)
 *
 * İstifadə edərkən yoxla:
 *   if (supabase) { ... }
 */
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

// Development-də xəbərdarlıq
if (!supabase && __DEV__) {
  console.warn(
    '⚠️ Supabase URL və ya KEY tapılmadı. .env faylını yoxla. Auth funksiyaları işləməyəcək.'
  );
}