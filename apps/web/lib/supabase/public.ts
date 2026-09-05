import { createClient } from "@supabase/supabase-js";
import type { Database } from "@mwcnu/types";

/**
 * Klien Supabase stateless untuk query publik di server (tanpa cookies).
 * Digunakan untuk fetch data publik yang tidak membutuhkan sesi autentikasi pengguna
 * sehingga aman saat proses prerendering/build Next.js (tidak memicu dynamic server error).
 */
export function createPublicSupabase() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
