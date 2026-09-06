/**
 * Helper konfigurasi environment Supabase.
 * Mendukung format kunci lama (Legacy JWT) dan format kunci baru (Publishable / Secret keys)
 * sesuai standar terbaru Supabase (Deprecation roadmap 2026).
 */

export function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
}

/**
 * Mendapatkan kunci publik (Publishable Key / Anon Key).
 * Mendukung `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (baru) dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` (lama).
 */
export function getSupabasePublishableKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ""
  );
}

/**
 * Mendapatkan kunci rahasia server (Secret Key / Service Role Key).
 * Mendukung `SUPABASE_SECRET_KEY` (baru) dan `SUPABASE_SERVICE_ROLE_KEY` (lama).
 */
export function getSupabaseSecretKey(): string {
  return process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

/**
 * Memeriksa apakah Supabase URL dan Kunci Publik telah terkonfigurasi.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabasePublishableKey());
}
