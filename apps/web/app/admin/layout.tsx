import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Shell admin — melindungi seluruh route /admin.
 * Role check detail dilakukan per modul (docs/12_ROLE_PERMISSION.md).
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  let email: string | undefined;

  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email;
  } catch {
    email = undefined;
  }

  if (!email) {
    redirect("/masuk?next=/admin");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b border-border bg-card">
        <Container className="flex h-14 items-center justify-between">
          <p className="font-display text-sm font-bold">Admin MWCNU Mandobo</p>
          <span className="text-xs text-muted-foreground">{email}</span>
        </Container>
      </div>
      <Container className="py-8">{children}</Container>
    </div>
  );
}
