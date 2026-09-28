// 🔌 Supabase Bağlantısı

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ Supabase URL və ya KEY tapılmadı! .env faylını yoxla.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
