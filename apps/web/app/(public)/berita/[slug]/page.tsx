import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { formatDateID } from "@mwcnu/utils";
import { ArticleCard } from "@/components/domain/article-card";
import { Container } from "@/components/layout/container";
import {
  getNextArticleBySlug,
  getPublishedArticleBySlug,
  listRandomArticles,
} from "@/repositories/article-repository";
import { DEFAULT_ARTICLE_IMAGE } from "@/lib/images";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    ...(article.excerpt ? { description: article.excerpt } : {}),
    alternates: { canonical: `/berita/${article.slug}` },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) notFound();

  const [nextArticle, feed] = await Promise.all([
    getNextArticleBySlug(slug),
    listRandomArticles({ excludeSlug: slug, limit: 3 }),
  ]);

  return (
    <Container className="py-16 md:py-20">
      <article className="mx-auto max-w-3xl">
        {article.category ? (
          <Link
            href={`/berita?kategori=${article.category.slug}`}
            className="border-primary/30 bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors"
          >
            {article.category.name}
          </Link>
        ) : null}
        <h1 className="font-display mt-3 text-3xl font-bold text-balance md:text-4xl">
          {article.title}
        </h1>
        {article.published_at ? (
          <p className="text-muted-foreground mt-4 text-sm">
            Dipublikasikan {formatDateID(article.published_at)}
          </p>
        ) : null}
        <div className="border-border bg-muted relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl border">
          <Image
            src={article.cover_image_url ?? DEFAULT_ARTICLE_IMAGE}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
        {article.excerpt ? (
          <p className="border-secondary text-muted-foreground mt-6 border-l-2 pl-4 text-lg text-pretty">
            {article.excerpt}
          </p>
        ) : null}
        <div
          className="rich-text-content border-border mt-8 border-t pt-8"
          dangerouslySetInnerHTML={{ __html: article.content ?? "" }}
        />
      </article>

      {nextArticle ? (
        <nav className="mx-auto mt-10 max-w-3xl">
          <Link
            href={`/berita/${nextArticle.slug}`}
            className="group border-border bg-card hover:border-primary/40 flex items-center justify-between gap-4 rounded-2xl border p-5 transition-colors"
          >
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Berita Berikutnya
              </p>
              <p className="font-display group-hover:text-primary mt-1 line-clamp-2 text-base font-bold transition-colors">
                {nextArticle.title}
              </p>
            </div>
            <ArrowRight className="text-primary size-5 shrink-0" />
          </Link>
        </nav>
      ) : null}

      {feed.length > 0 ? (
        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-secondary text-sm font-semibold tracking-wider uppercase">
                Baca Juga
              </p>
              <h2 className="font-display mt-1 text-2xl font-bold">Berita Lainnya</h2>
            </div>
            <Link
              href="/berita"
              className="text-primary inline-flex shrink-0 items-center gap-1 text-sm font-semibold hover:underline"
            >
              Lihat Semua
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {feed.map((item) => (
              <ArticleCard key={item.id} article={item} />
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}
