import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeader({
  kicker,
  title,
  description,
  href,
}: {
  kicker?: string;
  title: string;
  description?: string;
  href?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {kicker ? (
          <p className="text-sm font-semibold uppercase tracking-wider text-secondary">{kicker}</p>
        ) : null}
        <h2 className="mt-1 font-display text-2xl font-bold text-balance md:text-3xl">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-xl text-sm text-muted-foreground text-pretty">{description}</p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          Lihat Semua
          <ArrowRight className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}
