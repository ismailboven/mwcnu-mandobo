"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { Badge, Button } from "@mwcnu/ui";
import { cn } from "@/lib/utils";
import type { AdminCategory } from "@/repositories/category-repository";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/features/categories/actions";

export function CategoryManager({ categories }: { categories: AdminCategory[] }) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      {error ? (
        <div className="border-destructive/50 bg-destructive/10 text-destructive mb-3 rounded-lg border px-3 py-2 text-sm">
          {error}
        </div>
      ) : null}

      <CreateCategoryForm onError={setError} />

      <div className="border-border bg-card mt-4 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border border-b text-left text-xs tracking-wide uppercase">
              <th className="text-muted-foreground px-4 py-2 font-medium">Nama</th>
              <th className="text-muted-foreground px-4 py-2 font-medium">Slug</th>
              <th className="text-muted-foreground px-4 py-2 font-medium">Berita</th>
              <th className="text-muted-foreground px-4 py-2 font-medium">Status</th>
              <th className="text-muted-foreground px-4 py-2 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {categories.map((category) => (
              <CategoryRow key={category.id} category={category} onError={setError} />
            ))}
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-muted-foreground px-4 py-10 text-center text-sm">
                  Belum ada kategori.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CreateCategoryForm({ onError }: { onError: (message: string | null) => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!open) {
    return (
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Tambah Kategori
      </Button>
    );
  }

  const submit = async () => {
    setSubmitting(true);
    setFormError(null);
    const result = await createCategoryAction({ name, slug: slug || undefined });
    setSubmitting(false);
    if (!result.ok) {
      setFormError(result.message);
      onError(result.message);
      return;
    }
    setName("");
    setSlug("");
    setOpen(false);
    router.refresh();
  };

  return (
    <div className="border-border bg-card flex flex-col gap-3 rounded-lg border p-3 lg:flex-row lg:items-end">
      <div className="space-y-1 lg:flex-1">
        <Label htmlFor="category-name">Nama</Label>
        <input
          id="category-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="contoh: Kegiatan"
          className="border-border bg-background focus:border-primary h-9 w-full rounded-lg border px-3 text-sm outline-none"
        />
      </div>
      <div className="space-y-1 lg:flex-1">
        <Label htmlFor="category-slug">Slug (kosongkan untuk otomatis)</Label>
        <input
          id="category-slug"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          placeholder="kegiatan"
          className="border-border bg-background focus:border-primary h-9 w-full rounded-lg border px-3 text-sm outline-none"
        />
      </div>
      <div className="flex items-center gap-1">
        <Button size="sm" disabled={submitting || !name.trim()} onClick={submit}>
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
          Simpan
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
          <X className="size-4" />
          Batal
        </Button>
      </div>
      {formError ? <p className="text-destructive text-xs">{formError}</p> : null}
    </div>
  );
}

function CategoryRow({
  category,
  onError,
}: {
  category: AdminCategory;
  onError: (message: string | null) => void;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [rowError, setRowError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setRowError(null);
    const result = await updateCategoryAction(category.id, { name, slug });
    setSaving(false);
    if (!result.ok) {
      setRowError(result.message);
      onError(result.message);
      return;
    }
    setEditing(false);
    router.refresh();
  };

  const toggleActive = async () => {
    setBusy(true);
    setRowError(null);
    const result = await updateCategoryAction(category.id, { isActive: !category.is_active });
    setBusy(false);
    if (!result.ok) {
      setRowError(result.message);
      onError(result.message);
      return;
    }
    router.refresh();
  };

  const remove = async () => {
    if (!window.confirm(`Hapus kategori "${category.name}"?`)) return;
    setBusy(true);
    setRowError(null);
    const result = await deleteCategoryAction(category.id);
    setBusy(false);
    if (!result.ok) {
      setRowError(result.message);
      onError(result.message);
      return;
    }
    router.refresh();
  };

  return (
    <tr className="hover:bg-accent/40 transition-colors">
      <td className="px-4 py-2">
        {editing ? (
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-label="Nama kategori"
            className="border-border bg-background focus:border-primary h-8 w-full rounded-lg border px-2 text-sm outline-none"
          />
        ) : (
          <span className="font-medium">{category.name}</span>
        )}
      </td>
      <td className="text-muted-foreground px-4 py-2 whitespace-nowrap">
        {editing ? (
          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            aria-label="Slug kategori"
            className="border-border bg-background focus:border-primary h-8 w-full rounded-lg border px-2 font-mono text-xs outline-none"
          />
        ) : (
          <code className="text-xs">{category.slug}</code>
        )}
      </td>
      <td className="px-4 py-2 whitespace-nowrap">
        <Badge variant="muted">{category.article_count}</Badge>
      </td>
      <td className="px-4 py-2 whitespace-nowrap">
        <button
          type="button"
          onClick={toggleActive}
          disabled={busy}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-60",
            category.is_active
              ? "bg-success/10 text-success hover:bg-success/20"
              : "bg-muted text-muted-foreground hover:bg-accent"
          )}
        >
          {category.is_active ? "Aktif" : "Nonaktif"}
        </button>
      </td>
      <td className="px-4 py-2">
        <div className="flex items-center justify-end gap-1">
          {editing ? (
            <>
              <Button
                size="icon"
                variant="ghost"
                className="size-8"
                disabled={saving || !name.trim()}
                onClick={save}
                aria-label="Simpan kategori"
              >
                {saving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Check className="size-4" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="size-8"
                onClick={() => {
                  setEditing(false);
                  setName(category.name);
                  setSlug(category.slug);
                }}
                aria-label="Batal edit"
              >
                <X className="size-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                size="icon"
                variant="ghost"
                className="size-8"
                onClick={() => {
                  setName(category.name);
                  setSlug(category.slug);
                  setEditing(true);
                }}
                aria-label="Edit kategori"
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-destructive size-8"
                onClick={remove}
                disabled={busy}
                aria-label="Hapus kategori"
              >
                <Trash2 className="size-4" />
              </Button>
            </>
          )}
        </div>
        {rowError ? <p className="text-destructive mt-1 text-xs">{rowError}</p> : null}
      </td>
    </tr>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-muted-foreground text-xs font-medium">
      {children}
    </label>
  );
}
