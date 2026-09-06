import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@mwcnu/types";
import { getSupabasePublishableKey, getSupabaseUrl } from "./env";

/**
 * Klien Supabase untuk Client Components (auth flow, realtime).
 * Hanya dipakai di browser.
 */
export function createBrowserSupabase() {
  return createBrowserClient<Database>(getSupabaseUrl(), getSupabasePublishableKey());
}
