import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@mwcnu/types";
import { getSupabasePublishableKey, getSupabaseUrl } from "./env";

/**
 * Klien Supabase untuk Server Components & Server Actions.
 * Session dibaca dari HTTP-only cookies (dikelola middleware).
 */
export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient<Database>(getSupabaseUrl(), getSupabasePublishableKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Dipanggil dari Server Component — token refresh di-handle middleware.
        }
      },
    },
  });
}
