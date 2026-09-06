import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@mwcnu/types";
import { getSupabaseSecretKey, getSupabaseUrl } from "./env";

/**
 * Klien admin dengan Secret Key / service_role key.
 * ⚠️ HANYA untuk server & operasi admin khusus (membuat user, dsb).
 * Jangan pernah dipakai di client atau Server Action user-facing.
 */
export function createAdminSupabase() {
  const url = getSupabaseUrl();
  const secretKey = getSupabaseSecretKey();

  if (!url || !secretKey) {
    throw new Error(
      "Supabase admin tidak dikonfigurasi (SUPABASE_SECRET_KEY atau SUPABASE_SERVICE_ROLE_KEY)."
    );
  }

  return createClient<Database>(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
