"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Badge } from "@mwcnu/ui";
import { cn } from "@/lib/utils";
import { ADMIN_NAV } from "@/lib/admin-navigation";

export function AdminSidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <nav
      aria-label="Navigasi admin"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={cn(
        "border-border bg-card duration-base sticky top-4 hidden shrink-0 flex-col gap-1 overflow-hidden rounded-xl border p-2 transition-all ease-in-out lg:flex",
        expanded ? "w-58" : "w-16"
      )}
    >
      {ADMIN_NAV.map((item) => {
        const Icon = item.icon;
        const active =
          !item.disabled && (pathname === item.href || pathname.startsWith(`${item.href}/`));

        const label = (
          <span className="flex min-w-0 flex-1 items-center gap-1">
            <span className="truncate">{item.label}</span>
            {item.disabled ? (
              <Badge variant="outline" className="shrink-0 text-xs">
                Segera
              </Badge>
            ) : null}
          </span>
        );

        const inner = (
          <span
            title={expanded ? undefined : item.label}
            className={cn(
              "flex h-10 w-full items-center rounded-lg text-sm font-medium transition-colors",
              expanded ? "gap-2.5 px-2.5" : "justify-center",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              item.disabled && "opacity-50"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {expanded ? label : null}
          </span>
        );

        if (item.disabled) {
          return (
            <span key={item.href} aria-disabled="true" className="shrink-0">
              {inner}
            </span>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className="shrink-0"
          >
            {inner}
          </Link>
        );
      })}
    </nav>
  );
}
