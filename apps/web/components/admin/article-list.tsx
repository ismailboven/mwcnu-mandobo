"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Badge, Button } from "@mwcnu/ui";
import { formatDateNumericID } from "@mwcnu/utils";
import type { ArticleStatus } from "@mwcnu/types";
import { deleteArticlesAction, updateArticleFieldAction } from "@/features/articles/actions";
import { FeatureToggle } from "@/components/admin/feature-toggle";
import { InlineSelectCell, type InlineSelectOption } from "@/components/admin/inline-select-cell";

export interface ArticleListItem {
  id: string;
  title: string;
  slug: string;
  status: ArticleStatus;
  is_featured: boolean;
  published_at: string | null;
  scheduled_for: string | null;
  updated_at: string;
  category: { id: string; name: string; slug: string } | null | undefined;
}

const STATUS_OPTIONS: InlineSelectOption[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Terbit" },
  { value: "scheduled", label: "Jadwal" },
  { value: "archived", label: "Arsip" },
];

const STATUS_BADGE = {
  draft: { label: "Draft", variant: "secondary" },
  published: { label: "Terbit", variant: "success" },
  scheduled: { label: "Jadwal", variant: "warning" },
  archived: { label: "Arsip", variant: "muted" },
} as const;

type SortKey = "title" | "category" | "status" | "featured" | "date";
type SortDir = "asc" | "desc";

const SORT_LABEL: Record<SortKey, string> = {
  title: "Berita",
  category: "Kategori",
  status: "Status",
  featured: "Top",
  date: "Terbit",
};

function sortValue(article: ArticleListItem, key: SortKey): string {
  if (key === "title") return article.title.toLowerCase();
  if (key === "category") return (article.category?.name ?? "").toLowerCase();
  if (key === "status") return article.status;
  if (key === "featured") return article.is_featured ? "1" : "0";
  return article.published_at ?? article.scheduled_for ?? article.updated_at;
}

function displayDate(article: ArticleListItem): { label: string; date: string } {
  if (article.status === "published" && article.published_at) {
    return { label: formatDateNumericID(article.published_at), date: article.published_at };
  }
  if (article.status === "scheduled" && article.scheduled_for) {
    return { label: formatDateNumericID(article.scheduled_for), date: article.scheduled_for };
  }
  return { label: formatDateNumericID(article.updated_at), date: article.updated_at };
}

export function ArticleList({
  articles,
  categories,
}: {
  articles: ArticleListItem[];
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const allCheckedRef = useRef<HTMLInputElement>(null);

  const categoryOptions: InlineSelectOption[] = [
    { value: "", label: "Tanpa kategori" },
    ...categories.map((category) => ({ value: category.id, label: category.name })),
  ];

  const updateField = async (article: ArticleListItem, patch: unknown) => {
    const result = await updateArticleFieldAction(article.id, patch);
    if (result.ok) {
      router.refresh();
    }
    return result;
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(q) ||
        (article.category?.name ?? "").toLowerCase().includes(q)
    );
  }, [articles, query]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      const cmp = sortValue(a, sortKey).localeCompare(sortValue(b, sortKey), "id");
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [filtered, sortKey, sortDir]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(total, safePage * pageSize);
  const pageRows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  useEffect(() => {
    const input = allCheckedRef.current;
    if (!input) return;
    const some = filtered.some((article) => selected.has(article.id));
    const every = filtered.every((article) => selected.has(article.id));
    input.checked = filtered.length > 0 && every;
    input.indeterminate = some && !every;
  }, [filtered, selected]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "date" || key === "featured" ? "desc" : "asc");
    }
    setPage(1);
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      const allSelected = filtered.every((article) => next.has(article.id));
      filtered.forEach((article) => {
        if (allSelected) next.delete(article.id);
        else next.add(article.id);
      });
      return next;
    });
  };

  const handleBulkDelete = async () => {
    const ids = [...selected];
    if (ids.length === 0) return;
    if (!window.confirm(`Hapus ${ids.length} berita terpilih?`)) return;
    setError(null);
    const result = await deleteArticlesAction(ids);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setSelected(new Set());
    router.refresh();
  };

  const renderSortTh = (column: SortKey) => {
    const active = sortKey === column;
    return (
      <th className="px-4 py-2">
        <button
          type="button"
          onClick={() => handleSort(column)}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-medium transition-colors"
          aria-label={`Urutkan berdasarkan ${SORT_LABEL[column]}`}
        >
          {SORT_LABEL[column]}
          {active ? (
            sortDir === "asc" ? (
              <ArrowUp className="size-3.5" />
            ) : (
              <ArrowDown className="size-3.5" />
            )
          ) : (
            <ArrowUpDown className="size-3.5 opacity-40" />
          )}
        </button>
      </th>
    );
  };

  const pageItems = (): Array<number | "..."> => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const items: Array<number | "..."> = [1];
    if (safePage > 3) items.push("...");
    const from = Math.max(2, safePage - 1);
    const to = Math.min(totalPages - 1, safePage + 1);
    for (let i = from; i <= to; i += 1) items.push(i);
    if (safePage < totalPages - 2) items.push("...");
    items.push(totalPages);
    return items;
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Cari berita..."
            aria-label="Cari berita"
            className="border-border bg-background focus:border-primary h-9 w-full rounded-lg border pr-3 pl-8 text-sm transition-colors outline-none"
          />
        </div>
        <Button asChild size="sm" className="shrink-0">
          <Link href="/admin/berita/baru">
            <Plus className="size-4" />
            Tambah Berita
          </Link>
        </Button>
      </div>

      {error ? (
        <div className="border-destructive/50 bg-destructive/10 text-destructive mt-3 rounded-lg border px-3 py-2 text-sm">
          {error}
        </div>
      ) : null}

      {selected.size > 0 ? (
        <div className="border-border bg-accent/50 mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-3 py-2">
          <span className="text-sm font-medium">{selected.size} berita dipilih</span>
          <div className="flex items-center gap-1">
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="size-4" />
              Hapus
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
              Batal
            </Button>
          </div>
        </div>
      ) : null}

      <div className="border-border bg-card mt-4 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border border-b text-left text-xs tracking-wide uppercase">
              <th className="w-10 px-4 py-2">
                <input
                  ref={allCheckedRef}
                  type="checkbox"
                  onChange={toggleAll}
                  aria-label="Pilih semua berita"
                  className="accent-primary size-4"
                />
              </th>
              {renderSortTh("title")}
              {renderSortTh("featured")}
              {renderSortTh("category")}
              {renderSortTh("status")}
              {renderSortTh("date")}
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {pageRows.map((article) => {
              const badge = STATUS_BADGE[article.status] ?? STATUS_BADGE.draft;
              const date = displayDate(article);
              return (
                <tr key={article.id} className="hover:bg-accent/40 transition-colors">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selected.has(article.id)}
                      onChange={() => toggleOne(article.id)}
                      aria-label={`Pilih ${article.title}`}
                      className="accent-primary size-4"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      href={`/admin/berita/${article.id}/edit`}
                      className="flex items-center gap-1.5"
                      title={article.title}
                    >
                      <span className="text-foreground hover:text-primary line-clamp-2 font-medium">
                        {article.title}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <FeatureToggle
                      featured={article.is_featured}
                      title={article.title}
                      onToggle={(next) => updateField(article, { isFeatured: next })}
                      onError={setError}
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <InlineSelectCell
                      value={article.category?.id ?? ""}
                      options={categoryOptions}
                      label={`Kategori ${article.title}`}
                      onSave={(categoryId) =>
                        updateField(article, { categoryId: categoryId || null })
                      }
                      onError={setError}
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <InlineSelectCell
                      value={article.status}
                      options={STATUS_OPTIONS}
                      label={`Status ${article.title}`}
                      onSave={(status) => updateField(article, { status })}
                      onError={setError}
                      renderClosed={(label) => <Badge variant={badge.variant}>{label}</Badge>}
                    />
                  </td>
                  <td className="text-muted-foreground px-4 py-2 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">
                      {article.status === "scheduled" ? (
                        <CalendarClock className="size-3.5 shrink-0" />
                      ) : null}
                      {date.label}
                    </span>
                  </td>
                </tr>
              );
            })}
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-muted-foreground px-4 py-10 text-center text-sm">
                  {articles.length === 0
                    ? 'Belum ada berita. Klik "Buat Berita" untuk menambahkan.'
                    : "Tidak ada berita yang cocok."}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {total > 0 ? (
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <span>Tampilkan</span>
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
              aria-label="Jumlah berita per halaman"
              className="border-border bg-background focus:border-primary h-8 rounded-lg border px-2 text-sm outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>per halaman</span>
          </div>

          <p className="text-muted-foreground text-xs">
            Menampilkan {start}–{end} dari {total} berita
          </p>

          <nav aria-label="Paginasi" className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={safePage === 1}
            >
              <ChevronLeft className="size-4" />
              Sebelumnya
            </Button>
            {pageItems().map((item, index) =>
              item === "..." ? (
                <span key={`gap-${index}`} className="text-muted-foreground px-1 text-xs">
                  …
                </span>
              ) : (
                <Button
                  key={item}
                  type="button"
                  variant={item === safePage ? "default" : "outline"}
                  size="icon"
                  className="size-8"
                  onClick={() => setPage(item)}
                  aria-label={`Halaman ${item}`}
                  aria-current={item === safePage ? "page" : undefined}
                >
                  {item}
                </Button>
              )
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              disabled={safePage === totalPages}
            >
              Berikutnya
              <ChevronRight className="size-4" />
            </Button>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
