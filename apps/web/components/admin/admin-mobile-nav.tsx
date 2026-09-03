"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { Badge, Button } from "@mwcnu/ui";
import { cn } from "@/lib/utils";
import { ADMIN_NAV } from "@/lib/admin-navigation";
import { signOutAction } from "@/features/auth/actions";

interface AdminMobileNavProps {
  email: string | undefined;
  roleLabel: string;
}

export function AdminMobileNav({ email, roleLabel }: AdminMobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          className="bg-background fixed inset-0 z-[60] flex flex-col lg:hidden"
        >
          <div className="border-border flex h-14 shrink-0 items-center justify-between border-b px-4">
            <p className="font-display text-sm font-bold">Admin MWCNU Mandobo</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="Tutup menu"
            >
              <X className="size-5" />
            </Button>
          </div>

          <div className="shrink-0 px-4 pt-4">
            <div className="border-border bg-muted/40 rounded-xl border p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground min-w-0 truncate text-sm">{email}</span>
                <Badge variant="success" className="shrink-0">
                  {roleLabel}
                </Badge>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-4" aria-label="Navigasi admin">
            <div className="flex flex-col gap-1">
              {ADMIN_NAV.map((item) => {
                const Icon = item.icon;
                const active =
                  !item.disabled &&
                  (pathname === item.href || pathname.startsWith(`${item.href}/`));

                const inner = (
                  <span
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-accent",
                      item.disabled && "opacity-50"
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {item.label}
                    {item.disabled ? (
                      <Badge variant="outline" className="ml-auto text-[10px]">
                        Segera
                      </Badge>
                    ) : null}
                  </span>
                );

                if (item.disabled) {
                  return (
                    <span key={item.href} aria-disabled="true">
                      {inner}
                    </span>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {inner}
                  </Link>
                );
              })}

              <div className="bg-border my-2 h-px" />
              <button
                type="button"
                onClick={() => signOutAction()}
                className="text-destructive hover:bg-accent flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium"
              >
                <LogOut className="size-4 shrink-0" />
                Keluar
              </button>
            </div>
          </nav>

          <div className="border-border shrink-0 border-t p-4">
            <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
              <X className="size-4" />
              Tutup
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
