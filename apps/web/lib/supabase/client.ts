import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@mwcnu/types";

/**
 * Klien Supabase untuk Client Components (auth flow, realtime).
 * Hanya dipakai di browser.
 */
export function createBrowserSupabase() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
