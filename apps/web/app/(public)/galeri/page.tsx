import type { Metadata } from "next";
import Image from "next/image";
import { Camera } from "lucide-react";
import { Badge, Card, CardContent } from "@mwcnu/ui";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { listAlbums } from "@/repositories/gallery-repository";

export const metadata: Metadata = {
  title: "Galeri Dokumentasi",
  description: "Dokumentasi foto dan rekaman arsip kegiatan MWCNU Mandobo.",
  alternates: { canonical: "/galeri" },
};

export default async function GaleriPage() {
  const albums = await listAlbums({ limit: 12 });

  return (
    <Container className="py-16 md:py-20">
      <SectionHeader
        kicker="Dokumentasi"
        title="Galeri Kegiatan"
        description="Arsip visual dan rekaman jejak langkah kegiatan Nahdlatul Ulama di Distrik Mandobo."
      />

      {albums.length === 0 ? (
        <p className="text-muted-foreground text-sm">Belum ada album galeri.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <Card
              key={album.id}
              className="group duration-base hover:shadow-medium overflow-hidden transition-all hover:-translate-y-0.5"
            >
              <div className="bg-muted relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={album.cover_url}
                  alt={album.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="duration-slow object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-3 right-3">
                  <Badge
                    variant="secondary"
                    className="bg-background/80 gap-1 text-xs backdrop-blur"
                  >
                    <Camera className="size-3" />
                    {album.photo_count} Foto
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="font-display text-foreground group-hover:text-primary text-lg font-bold transition-colors">
                  {album.title}
                </h3>

                {album.description && (
                  <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
                    {album.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
