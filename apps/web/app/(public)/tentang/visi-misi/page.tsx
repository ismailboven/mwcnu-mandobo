import type { Metadata } from "next";
import { Compass, Eye, HeartHandshake, ShieldCheck, Sparkles, Target } from "lucide-react";
import { Card, CardContent } from "@mwcnu/ui";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";

export const metadata: Metadata = {
  title: "Visi & Misi",
  description: "Visi, Misi, dan Nilai Utama MWCNU Mandobo.",
  alternates: { canonical: "/tentang/visi-misi" },
};

const MISSIONS = [
  {
    icon: ShieldCheck,
    title: "M1: Transparansi & Akuntabilitas",
    desc: "Menyediakan akses terbuka terhadap kebijakan, program kerja, dan tata kelola organisasi secara bertanggung jawab.",
  },
  {
    icon: HeartHandshake,
    title: "M2: Aksesibilitas Umat",
    desc: "Memastikan layanan dakwah, informasi keagamaan, dan administrasi dapat diakses mudah oleh seluruh lapisan masyarakat.",
  },
  {
    icon: Compass,
    title: "M3: Kelestarian Warisan Aswaja",
    desc: "Membangun arsip digital terpusat yang menjaga kemurnian sanad keilmuan dan sejarah perjuangan ulama di tanah Papua.",
  },
  {
    icon: Sparkles,
    title: "M4: Regenerasi & Kaderisasi",
    desc: "Mempersiapkan kader muda yang berwawasan luas, berakhlak mulia, dan cakap menguasai teknologi modern.",
  },
  {
    icon: Target,
    title: "M5: Dakwah Moderat (Wasathiyah)",
    desc: "Menyebarkan nilai-nilai Tawasuth (moderat), I'tidal (adil), Tasamuh (toleran), dan Tawazun (seimbang) dalam kehidupan berbangsa.",
  },
];

const VALUES = [
  {
    title: "Tawasuth",
    desc: "Sikap moderat yang berpijak pada keadilan dan menjauhi ekstremisme.",
  },
  { title: "Tasamuh", desc: "Sikap toleran dalam perbedaan serta menghormati keragaman sosial." },
  { title: "Tawazun", desc: "Sikap seimbang dalam relasi keagamaan, kemanusiaan, dan kebangsaan." },
  { title: "I'tidal", desc: "Tegak lurus membela kebenaran dan menempatkan sesuatu pada haknya." },
];

export default function VisiMisiPage() {
  return (
    <Container className="py-16 md:py-20">
      <SectionHeader
        kicker="Haluan Organisasi"
        title="Visi & Misi MWCNU Mandobo"
        description="Arah perjuangan dan komitmen Majelis Wakil Cabang Nahdlatul Ulama Distrik Mandobo dalam berkhidmah untuk umat dan bangsa."
      />

      {/* Vision Statement */}
      <div className="border-primary/30 from-primary/15 via-background to-secondary/10 shadow-soft relative mb-16 overflow-hidden rounded-3xl border bg-gradient-to-br p-8 md:p-12">
        <div className="text-primary flex items-center gap-3">
          <Eye className="size-6" />
          <span className="font-display text-sm font-bold tracking-wider uppercase">
            Visi Utama
          </span>
        </div>
        <blockquote className="font-display text-foreground mt-4 text-2xl leading-snug font-extrabold md:text-3xl">
          &ldquo;Menjadikan MWCNU Mandobo sebagai teladan organisasi NU berplatform digital yang
          transparan, aksesibel, dan berkelanjutan — membangun jembatan antara tradisi Nahdlatul
          Ulama dan kebutuhan zaman, tanpa meninggalkan identitas.&rdquo;
        </blockquote>
      </div>

      {/* Missions Grid */}
      <section className="mb-16">
        <h2 className="font-display mb-8 text-2xl font-bold">Misi Pembangunan</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MISSIONS.map((m) => (
            <Card
              key={m.title}
              className="duration-base hover:shadow-medium transition-all hover:-translate-y-0.5"
            >
              <CardContent className="p-6">
                <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-2xl">
                  <m.icon className="size-6" />
                </span>
                <h3 className="font-display mt-4 text-lg font-bold">{m.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{m.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section>
        <h2 className="font-display mb-8 text-2xl font-bold">
          Nilai-Nilai Dasar (Mabadi Khaira Ummah)
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((val) => (
            <Card key={val.title} className="border-secondary/30 bg-card">
              <CardContent className="p-6">
                <h3 className="font-display text-secondary text-xl font-extrabold">{val.title}</h3>
                <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{val.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </Container>
  );
}
