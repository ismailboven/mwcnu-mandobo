"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownItem {
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
  destructive?: boolean;
}

export function RowActionsMenu({ items, label }: { items: DropdownItem[]; label: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="text-muted-foreground hover:bg-accent hover:text-foreground grid size-8 place-items-center rounded-lg transition-colors"
      >
        <MoreHorizontal className="size-4" />
      </button>

      {open ? (
        <div
          role="menu"
          className="border-border bg-card absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-lg border p-1 shadow-lg"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                item.onSelect();
              }}
              className={cn(
                "hover:bg-accent flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                item.destructive ? "text-destructive" : "text-foreground"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
