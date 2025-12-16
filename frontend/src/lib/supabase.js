import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fallback for verification/local dev without keys to prevent crash
const isConfigured = supabaseUrl && supabaseKey;

export const supabase = isConfigured
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export const isSupabaseConfigured = () => !!supabase;
