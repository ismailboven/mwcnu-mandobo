import "server-only";
import type { RoleLevel } from "@mwcnu/types";

export const ROLE_LEVELS = {
  viewer: 1,
  editor: 2,
  admin: 3,
  super_admin: 4,
} as const satisfies Record<string, RoleLevel>;

export type RoleName = keyof typeof ROLE_LEVELS;

export function roleLevel(role: RoleName): RoleLevel {
  return ROLE_LEVELS[role];
}

export function canAccess(minLevel: RoleLevel, level: number): boolean {
  return level >= minLevel;
}
