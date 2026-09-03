"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Loader2, X } from "lucide-react";
import type { ActionResult } from "@/lib/types";

export interface InlineSelectOption {
  value: string;
  label: string;
}

interface InlineSelectCellProps {
  value: string;
  options: InlineSelectOption[];
  label: string;
  emptyLabel?: string;
  onSave: (value: string) => Promise<ActionResult>;
  onError: (message: string | null) => void;
  renderClosed?: (currentLabel: string) => ReactNode;
}

export function InlineSelectCell({
  value,
  options,
  label,
  emptyLabel = "—",
  onSave,
  onError,
  renderClosed,
}: InlineSelectCellProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (editing) selectRef.current?.focus();
  }, [editing]);

  const currentLabel = options.find((option) => option.value === value)?.label ?? emptyLabel;

  const begin = () => {
    setEditing(true);
    onError(null);
  };

  const cancel = () => {
    setEditing(false);
  };

  const commit = async (next: string) => {
    if (next === value) {
      setEditing(false);
      return;
    }
    setSaving(true);
    const result = await onSave(next);
    setSaving(false);
    if (!result.ok) {
      onError(result.message ?? "Gagal menyimpan perubahan.");
    }
    setEditing(false);
  };

  if (!editing) {
    return (
      <button
        type="button"
        onClick={begin}
        title={`Ubah ${label}`}
        className="hover:bg-accent hover:text-primary inline-flex items-center rounded-md px-1.5 py-0.5 text-left transition-colors"
      >
        {renderClosed ? (
          renderClosed(currentLabel)
        ) : (
          <span className={value === "" ? "text-muted-foreground" : "text-foreground font-medium"}>
            {currentLabel}
          </span>
        )}
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <select
        ref={selectRef}
        value={value}
        disabled={saving}
        onChange={(event) => void commit(event.target.value)}
        onBlur={() => {
          if (!saving) setEditing(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") cancel();
        }}
        aria-label={label}
        className="border-border bg-background focus:border-primary h-8 rounded-lg border px-2 text-sm outline-none disabled:opacity-60"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {saving ? (
        <Loader2
          className="text-muted-foreground size-4 shrink-0 animate-spin"
          aria-label="Menyimpan"
        />
      ) : null}
      <button
        type="button"
        onClick={cancel}
        aria-label="Batal"
        className="text-muted-foreground hover:bg-accent hover:text-foreground grid size-6 place-items-center rounded-md"
      >
        <X className="size-3.5" />
      </button>
    </span>
  );
}
