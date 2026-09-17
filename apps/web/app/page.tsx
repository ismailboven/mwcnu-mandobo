import Link from "next/link";
import { ArrowRight, BookOpen, FileDown, Images, Landmark, Network, Newspaper } from "lucide-react";
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
      <section className="border-border from-primary/10 via-background to-background relative overflow-hidden border-b bg-gradient-to-b">
        <Container className="grid items-center gap-10 py-20 md:grid-cols-2 md:py-28">
          <div>
            <Badge variant="secondary">Platform Digital Resmi</Badge>
            <h1 className="font-display mt-4 text-4xl font-extrabold text-balance md:text-6xl">
              Tradisi yang Hidup, <span className="text-primary">Teknologi yang Bermakna</span>
            </h1>
            <p className="text-muted-foreground mt-5 max-w-xl text-lg text-pretty">
              {ORGANIZATION_FULL} — menyediakan berita, agenda, kajian, dan arsip organisasi secara
              transparan dan aksesibel.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                className="gap-2 font-bold shadow-md transition-all hover:shadow-lg"
              >
                <Link href="/berita">
                  <Newspaper className="size-4" />
                  <span>Baca Berita</span>
                  <ArrowRight className="size-4 opacity-70" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-border/80 hover:border-primary/60 bg-card/70 font-semibold backdrop-blur"
              >
                <Link href="/tentang/struktur">
                  <Network className="text-primary size-4" />
                  <span>Lihat Struktur</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {STATS.map((stat) => (
              <Card key={stat.label} className="bg-card/80 p-6 backdrop-blur">
                <CardContent className="p-0">
                  <p className="font-display text-primary text-3xl font-extrabold">{stat.value}</p>
                  <p className="text-muted-foreground mt-1 text-sm">{stat.label}</p>
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

      <section className="border-border bg-muted/40 border-y py-16 md:py-20">
        <Container>
          <SectionHeader
            kicker="Organisasi"
            title="Lembaga & Banom"
            description="Struktur pendukung perjuangan dan pengembangan NU di Distrik Mandobo."
            href="/program-kerja"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {ORG_TEASERS.map((item) => (
              <Card
                key={item.title}
                className="duration-base hover:shadow-medium transition-all hover:-translate-y-0.5"
              >
                <CardContent className="p-6">
                  <span className="bg-primary/10 text-primary grid size-12 place-items-center rounded-2xl">
                    <item.icon className="size-6" />
                  </span>
                  <h3 className="font-display mt-4 text-lg font-bold">{item.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="from-primary to-primary-hover text-primary-foreground bg-gradient-to-br">
              <CardContent className="p-8">
                <BookOpen className="size-8" />
                <h2 className="font-display mt-4 text-2xl font-bold">Kajian & Khutbah</h2>
                <p className="text-primary-foreground/80 mt-2 text-sm">
                  Unduh materi kajian, khutbah Jumat, dan arsip dakwah dalam berbagai format.
                </p>
                <Button asChild variant="secondary" className="mt-6">
                  <Link href="/kajian">Jelajahi Kajian</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8">
                <FileDown className="text-primary size-8" />
                <h2 className="font-display mt-4 text-2xl font-bold">Unduhan & Arsip</h2>
                <p className="text-muted-foreground mt-2 text-sm">
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
