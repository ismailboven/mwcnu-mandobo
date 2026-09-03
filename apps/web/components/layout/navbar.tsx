"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@mwcnu/ui";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NAV_LINKS } from "@/lib/navigation";

export function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-primary flex items-center gap-2 text-lg font-bold"
        >
          <span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-lg text-sm font-bold">
            NU
          </span>
          <span>MWCNU Mandobo</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "hover:bg-accent hover:text-accent-foreground rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(link.href) ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          {isLoggedIn ? (
            <Button asChild variant="default" size="sm" className="hidden sm:inline-flex">
              <Link href="/admin">Admin</Link>
            </Button>
          ) : (
            <Button asChild variant="default" size="sm" className="hidden sm:inline-flex">
              <Link href="/masuk">Masuk</Link>
            </Button>
          )}
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
        </div>
      </div>

      {open ? (
        <nav
          className="border-border bg-background border-t px-4 py-4 lg:hidden"
          aria-label="Navigasi mobile"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium",
                  isActive(link.href) ? "bg-accent text-primary" : "text-foreground hover:bg-accent"
                )}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <Button asChild className="mt-2">
                <Link href="/admin" onClick={() => setOpen(false)}>
                  Admin
                </Link>
              </Button>
            ) : (
              <Button asChild className="mt-2">
                <Link href="/masuk" onClick={() => setOpen(false)}>
                  Masuk
                </Link>
              </Button>
            )}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
