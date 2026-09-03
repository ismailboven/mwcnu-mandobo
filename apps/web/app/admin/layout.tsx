import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AuthError, MIN_LEVEL, requireLevel } from "@/lib/authz";
import { createServerSupabase } from "@/lib/supabase/server";

const ROLE_LABEL = {
  viewer: "Viewer",
  editor: "Editor",
  admin: "Admin",
  super_admin: "Super Admin",
} as const; /**
 * Shell admin — melindungi seluruh route /admin.
 * Setiap pengguna login (level >= 1) boleh masuk; akses per modul
 * di-cek lebih ketat di Server Action masing-masing (docs/12).
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  let session:
    { email: string | undefined; role: keyof typeof ROLE_LABEL | null; level: number } | undefined;

  try {
    const supabase = await createServerSupabase();
    const result = await requireLevel(supabase, MIN_LEVEL.staff);
    session = {
      email: result.email,
      role: result.role,
      level: result.level,
    };
  } catch (error) {
    if (error instanceof AuthError && error.code === "UNAUTHORIZED") {
      redirect("/masuk?next=/admin");
    }
    session = undefined;
  }

  if (!session) {
    redirect("/masuk?next=/admin");
  }

  return (
    <div className="bg-muted/30 min-h-screen">
      <AdminHeader email={session.email} roleLabel={ROLE_LABEL[session.role ?? "viewer"]} />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:items-start lg:px-8 lg:py-8">
        <AdminSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
