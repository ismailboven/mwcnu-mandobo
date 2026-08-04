import Image from "next/image";
import Link from "next/link";
import { formatDateShortID } from "@mwcnu/utils";
import { Badge } from "@mwcnu/ui";
import type { ArticleCard as ArticleCardData } from "@mwcnu/types";

export function ArticleCard({
  article,
  priority = false,
}: {
  article: ArticleCardData;
  priority?: boolean;
}) {
  const href = `/berita/${article.slug}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-base hover:-translate-y-0.5 hover:shadow-medium">
      <Link href={href} className="relative block aspect-[4/3] w-full overflow-hidden bg-muted">
        {article.cover_image_url ? (
          <Image
            src={article.cover_image_url}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-base group-hover:scale-105"
          />
        ) : (
          <span className="grid size-full place-items-center font-display text-sm font-bold text-primary">
            NU Mandobo
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-5">
        {article.category?.name ? (
          <Badge variant="default" className="w-fit">
            {article.category.name}
          </Badge>
        ) : null}
        <h3 className="font-display text-base font-bold leading-snug line-clamp-2">
          <Link href={href} className="transition-colors hover:text-primary">
            {article.title}
          </Link>
        </h3>
        {article.excerpt ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
        ) : null}
        {article.published_at ? (
          <time className="mt-auto pt-2 text-xs text-muted-foreground">
            {formatDateShortID(article.published_at)}
          </time>
        ) : null}
      </div>
    </article>
  );
}
