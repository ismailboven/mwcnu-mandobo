import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArticleCard } from "@/components/domain/article-card";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { listActiveCategories } from "@/repositories/category-repository";
import { listPublishedArticles } from "@/repositories/article-repository";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Berita",
  description: "Berita terbaru dan kegiatan MWCNU Mandobo.",
  alternates: { canonical: "/berita" },
};

interface Props {
  searchParams: Promise<{ kategori?: string; urut?: string }>;
}

function buildHref(kategori?: string, urut?: "asc" | "desc") {
  const params = new URLSearchParams();
  if (kategori) params.set("kategori", kategori);
  if (urut === "asc") params.set("urut", "asc");
  const query = params.toString();
  return query ? `/berita?${query}` : "/berita";
}

export default async function BeritaPage({ searchParams }: Props) {
  const { kategori, urut } = await searchParams;
  const order: "asc" | "desc" = urut === "asc" ? "asc" : "desc";

  const categories = await listActiveCategories();
  const activeCategory = kategori
    ? categories.find((category) => category.slug === kategori)
    : undefined;

  const articles = await listPublishedArticles({
    limit: 12,
    categoryId: activeCategory?.id,
    order,
  });

  const title = activeCategory ? activeCategory.name : "Berita Terbaru";
  const description = activeCategory
    ? `Semua berita dalam kategori ${activeCategory.name} MWCNU Mandobo.`
    : "Kabar terbaru seputar kegiatan dan program MWCNU Mandobo.";

  return (
    <Container className="py-16 md:py-20">
      <SectionHeader kicker="Informasi" title={title} description={description} />

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip
            href={buildHref(undefined, order === "asc" ? "asc" : undefined)}
            active={!activeCategory}
          >
            Semua
          </FilterChip>
          {categories.map((category) => (
            <FilterChip
              key={category.id}
              href={buildHref(category.slug, order === "asc" ? "asc" : undefined)}
              active={activeCategory?.id === category.id}
            >
              {category.name}
            </FilterChip>
          ))}
        </div>

        <div className="border-border bg-card inline-flex items-center overflow-hidden rounded-full border">
          <SortButton href={buildHref(activeCategory?.slug, undefined)} active={order === "desc"}>
            Terbaru
          </SortButton>
          <SortButton href={buildHref(activeCategory?.slug, "asc")} active={order === "asc"}>
            Terlama
          </SortButton>
        </div>
      </div>

      {articles.length === 0 ? (
        <p className="text-muted-foreground text-sm">Belum ada berita.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </Container>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}

function SortButton({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}
