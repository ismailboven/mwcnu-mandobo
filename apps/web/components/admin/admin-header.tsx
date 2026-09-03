"use client";

import { LogOut } from "lucide-react";
import { Badge, Button } from "@mwcnu/ui";
import { Container } from "@/components/layout/container";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { signOutAction } from "@/features/auth/actions";

interface AdminHeaderProps {
  email: string | undefined;
  roleLabel: string;
}

export function AdminHeader({ email, roleLabel }: AdminHeaderProps) {
  return (
    <div className="border-border bg-card border-b">
      <Container className="flex h-14 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <AdminMobileNav email={email} roleLabel={roleLabel} />
          <p className="font-display truncate text-sm font-bold">Admin MWCNU Mandobo</p>
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <span className="text-muted-foreground text-xs">{email}</span>
          <Badge variant="success">{roleLabel}</Badge>
          <Button variant="ghost" size="sm" onClick={() => signOutAction()} aria-label="Keluar">
            <LogOut className="size-4" />
            Keluar
          </Button>
        </div>
      </Container>
    </div>
  );
}
