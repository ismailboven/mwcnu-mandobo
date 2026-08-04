import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatDateID } from "@mwcnu/utils";
import { Container } from "@/components/layout/container";
import { getPublishedArticleBySlug } from "@/repositories/article-repository";

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

  return (
    <Container className="py-16 md:py-20">
      <article className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-balance md:text-4xl">{article.title}</h1>
        {article.published_at ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Dipublikasikan {formatDateID(article.published_at)}
          </p>
        ) : null}
        {article.excerpt ? (
          <p className="mt-6 border-l-2 border-secondary pl-4 text-lg text-muted-foreground text-pretty">
            {article.excerpt}
          </p>
        ) : null}
        <div className="mt-8 whitespace-pre-line border-t border-border pt-8 text-pretty leading-relaxed">
          {article.content}
        </div>
      </article>
    </Container>
  );
}
