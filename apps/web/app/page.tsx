import Link from "next/link";
import { BookOpen, FileDown, Images, Landmark } from "lucide-react";
import { Badge, Button, Card, CardContent } from "@mwcnu/ui";
import { ArticleCard } from "@/components/domain/article-card";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { ORGANIZATION_FULL } from "@/lib/navigation";
import { listPublishedArticles } from "@/repositories/article-repository";

const STATS = [
  { value: "12", label: "Lembaga & Banom" },
  { value: "5+", label: "Program Bidang" },
  { value: "30+", label: "Masjid Terdata" },
  { value: "100%", label: "Transparan" },
];

const ORG_TEASERS = [
  {
    icon: BookOpen,
    title: "LP Ma'arif",
    description: "Pendidikan & pengembangan kader di bawah naungan MWCNU Mandobo.",
  },
  {
    icon: Landmark,
    title: "RMI",
    description: "Rabithah Ma'ahid Islamiyah — pembinaan pesantren & madrasah.",
  },
  {
    icon: Images,
    title: "LTM PBNU",
    description: "Lembaga Ta'mir Masjid — penguatan kemakmuran masjid.",
  },
];

export default async function HomePage() {
  const articles = await listPublishedArticles({ limit: 4 });

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/10 via-background to-background">
        <Container className="grid items-center gap-10 py-20 md:grid-cols-2 md:py-28">
          <div>
            <Badge variant="secondary">Platform Digital Resmi</Badge>
            <h1 className="mt-4 font-display text-4xl font-extrabold text-balance md:text-6xl">
              Tradisi yang Hidup,{" "}
              <span className="text-primary">Teknologi yang Bermakna</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground text-pretty">
              {ORGANIZATION_FULL} — menyediakan berita, agenda, kajian, dan arsip organisasi secara
              transparan dan aksesibel.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/berita">Baca Berita</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/tentang/struktur">Lihat Struktur</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {STATS.map((stat) => (
              <Card key={stat.label} className="bg-card/80 p-6 backdrop-blur">
                <CardContent className="p-0">
                  <p className="font-display text-3xl font-extrabold text-primary">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <SectionHeader
            kicker="Informasi"
            title="Berita Terbaru"
            description="Kabar dan kegiatan terbaru seputar MWCNU Mandobo."
            href="/berita"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((article, index) => (
              <ArticleCard key={article.id} article={article} priority={index === 0} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-muted/40 py-16 md:py-20">
        <Container>
          <SectionHeader
            kicker="Organisasi"
            title="Lembaga & Banom"
            description="Struktur pendukung perjuangan dan pengembangan NU di Distrik Mandobo."
            href="/program-kerja"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {ORG_TEASERS.map((item) => (
              <Card key={item.title} className="transition-all duration-base hover:-translate-y-0.5 hover:shadow-medium">
                <CardContent className="p-6">
                  <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <item.icon className="size-6" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-primary to-primary-hover text-primary-foreground">
              <CardContent className="p-8">
                <BookOpen className="size-8" />
                <h2 className="mt-4 font-display text-2xl font-bold">Kajian & Khutbah</h2>
                <p className="mt-2 text-sm text-primary-foreground/80">
                  Unduh materi kajian, khutbah Jumat, dan arsip dakwah dalam berbagai format.
                </p>
                <Button asChild variant="secondary" className="mt-6">
                  <Link href="/kajian">Jelajahi Kajian</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8">
                <FileDown className="size-8 text-primary" />
                <h2 className="mt-4 font-display text-2xl font-bold">Unduhan & Arsip</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Akses SK, surat, notulen, dan dokumen resmi organisasi di Download Center.
                </p>
                <Button asChild variant="outline" className="mt-6">
                  <Link href="/download">Buka Unduhan</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
