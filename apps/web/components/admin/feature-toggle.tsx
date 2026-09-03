"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActionResult } from "@/lib/types";

export function FeatureToggle({
  featured,
  title,
  onToggle,
  onError,
}: {
  featured: boolean;
  title: string;
  onToggle: (next: boolean) => Promise<ActionResult>;
  onError: (message: string | null) => void;
}) {
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    const result = await onToggle(!featured);
    setBusy(false);
    if (!result.ok) {
      onError(result.message ?? "Gagal menyimpan perubahan.");
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      title={featured ? `Hapus unggulan: ${title}` : `Jadikan unggulan: ${title}`}
      aria-label={featured ? `Hapus unggulan ${title}` : `Jadikan unggulan ${title}`}
      aria-pressed={featured}
      className={cn(
        "hover:bg-accent grid size-8 place-items-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-50",
        featured ? "text-warning" : "text-muted-foreground hover:text-warning"
      )}
    >
      <Star className={cn("size-4", featured && "fill-warning")} />
    </button>
  );
}
