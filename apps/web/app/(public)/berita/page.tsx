import type { Metadata } from "next";
import { ArticleCard } from "@/components/domain/article-card";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { listPublishedArticles } from "@/repositories/article-repository";

export const metadata: Metadata = {
  title: "Berita",
  description: "Berita terbaru dan kegiatan MWCNU Mandobo.",
  alternates: { canonical: "/berita" },
};

export default async function BeritaPage() {
  const articles = await listPublishedArticles({ limit: 12 });

  return (
    <Container className="py-16 md:py-20">
      <SectionHeader
        kicker="Informasi"
        title="Berita Terbaru"
        description="Kabar terbaru seputar kegiatan dan program MWCNU Mandobo."
      />
      {articles.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada berita.</p>
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
