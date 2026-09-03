import Image from "next/image";
import Link from "next/link";
import { formatDateShortID } from "@mwcnu/utils";
import { Badge } from "@mwcnu/ui";
import type { ArticleCard as ArticleCardData } from "@mwcnu/types";
import { DEFAULT_ARTICLE_IMAGE } from "@/lib/images";

export function ArticleCard({
  article,
  priority = false,
}: {
  article: ArticleCardData;
  priority?: boolean;
}) {
  const href = `/berita/${article.slug}`;

  return (
    <article className="group border-border bg-card shadow-soft duration-base hover:shadow-medium flex flex-col overflow-hidden rounded-2xl border transition-all hover:-translate-y-0.5">
      <Link href={href} className="bg-muted relative block aspect-[4/3] w-full overflow-hidden">
        <Image
          src={article.cover_image_url ?? DEFAULT_ARTICLE_IMAGE}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={priority}
          className="duration-base object-cover transition-transform group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-5">
        {article.category?.name ? (
          <Badge variant="default" className="w-fit">
            {article.category.name}
          </Badge>
        ) : null}
        <h3 className="font-display line-clamp-2 text-base leading-snug font-bold">
          <Link href={href} className="hover:text-primary transition-colors">
            {article.title}
          </Link>
        </h3>
        {article.excerpt ? (
          <p className="text-muted-foreground line-clamp-2 text-sm">{article.excerpt}</p>
        ) : null}
        {article.published_at ? (
          <time className="text-muted-foreground mt-auto pt-2 text-xs">
            {formatDateShortID(article.published_at)}
          </time>
        ) : null}
      </div>
    </article>
  );
}
