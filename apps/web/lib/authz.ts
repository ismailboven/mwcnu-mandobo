import "server-only";
import type { RoleLevel, RoleName } from "@mwcnu/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@mwcnu/types";

export const ROLE_LEVELS = {
  viewer: 1,
  editor: 2,
  admin: 3,
  super_admin: 4,
} as const satisfies Record<string, RoleLevel>;

export type { RoleName };

export function roleLevel(role: RoleName): RoleLevel {
  return ROLE_LEVELS[role];
}

export function canAccess(minLevel: RoleLevel, level: number): boolean {
  return level >= minLevel;
}

export const MIN_LEVEL = {
  staff: 1,
  editor: 2,
  admin: 3,
  superAdmin: 4,
} as const;

export class AuthError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

/**
 * Ambil level role user saat ini dari database (bukan JWT claim),
 * sesuai rekomendasi docs/12 untuk role yang bisa berubah.
 */
export async function getUserLevel(supabase: SupabaseClient<Database>): Promise<number> {
  const { role } = await getUserRole(supabase);
  return role ? ROLE_LEVELS[role] : 0;
}

/**
 * Ambil role (nama + level) tertinggi milik user saat ini.
 */
export async function getUserRole(supabase: SupabaseClient<Database>): Promise<{
  role: RoleName | null;
  level: number;
}> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { role: null, level: 0 };

  const { data } = await supabase
    .from("user_roles")
    .select("roles(name, level)")
    .eq("user_id", user.id);

  const candidates = (
    (data ?? []) as unknown as { roles: { name: RoleName; level: number } | null }[]
  )
    .map((row) => row.roles)
    .filter((role): role is { name: RoleName; level: number } => Boolean(role));

  if (candidates.length === 0) return { role: null, level: 0 };

  const highest = candidates.sort((a, b) => b.level - a.level)[0]!;
  return { role: highest.name, level: highest.level };
}

/**
 * Guard standar: pastikan user login & level cukup.
 * Throws AuthError("UNAUTHORIZED") / AuthError("FORBIDDEN").
 */
export async function requireLevel(
  supabase: SupabaseClient<Database>,
  minLevel: RoleLevel
): Promise<{ userId: string; email: string | undefined; level: number; role: RoleName | null }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new AuthError("UNAUTHORIZED", "Silakan masuk terlebih dahulu.");
  }

  const { role, level } = await getUserRole(supabase);

  if (level < minLevel) {
    throw new AuthError("FORBIDDEN", "Anda tidak memiliki akses.");
  }

  return { userId: user.id, email: user.email ?? undefined, level, role };
}
