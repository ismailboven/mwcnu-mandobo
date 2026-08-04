import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@mwcnu/types";

/**
 * Klien admin dengan service_role key.
 * ⚠️ HANYA untuk server & operasi admin khusus (membuat user, dsb).
 * Jangan pernah dipakai di client atau Server Action user-facing.
 */
export function createAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase admin tidak dikonfigurasi (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
