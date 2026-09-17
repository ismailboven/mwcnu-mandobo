import type { Metadata } from "next";
import Image from "next/image";
import { BookOpen, User } from "lucide-react";
import { Badge, Card, CardContent } from "@mwcnu/ui";
import { formatDateID } from "@mwcnu/utils";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { listPublishedSermons } from "@/repositories/sermon-repository";
import { DEFAULT_ARTICLE_IMAGE } from "@/lib/images";

export const metadata: Metadata = {
  title: "Kajian & Khutbah",
  description: "Kumpulan materi kajian, khutbah Jumat, dan arsip dakwah MWCNU Mandobo.",
  alternates: { canonical: "/kajian" },
};

export default async function KajianPage() {
  const sermons = await listPublishedSermons({ limit: 12 });

  return (
    <Container className="py-16 md:py-20">
      <SectionHeader
        kicker="Dakwah"
        title="Kajian & Khutbah"
        description="Materi kajian tematik, khutbah Jumat, dan rekaman dakwah berlandaskan Ahlussunnah wal Jama'ah An-Nahdliyah."
      />

      {sermons.length === 0 ? (
        <p className="text-muted-foreground text-sm">Belum ada materi kajian.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sermons.map((sermon) => (
            <Card
              key={sermon.id}
              className="group duration-base hover:shadow-medium overflow-hidden transition-all hover:-translate-y-0.5"
            >
              <div className="bg-muted relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={sermon.cover_image_url ?? DEFAULT_ARTICLE_IMAGE}
                  alt={sermon.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="duration-slow object-cover transition-transform group-hover:scale-105"
                />
                {sermon.series && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-background/80 text-xs backdrop-blur">
                      {sermon.series}
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                {sermon.speaker && (
                  <div className="text-primary flex items-center gap-2 text-xs font-semibold">
                    <User className="size-3.5" />
                    <span>{sermon.speaker}</span>
                  </div>
                )}

                <h3 className="font-display text-foreground group-hover:text-primary mt-2 line-clamp-2 text-lg font-bold transition-colors">
                  {sermon.title}
                </h3>

                {sermon.summary && (
                  <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-relaxed">
                    {sermon.summary}
                  </p>
                )}

                <div className="border-border text-muted-foreground mt-5 flex items-center justify-between border-t pt-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="text-secondary size-3.5" />
                    Kajian Aswaja
                  </span>
                  {sermon.published_at && (
                    <time dateTime={sermon.published_at}>{formatDateID(sermon.published_at)}</time>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
