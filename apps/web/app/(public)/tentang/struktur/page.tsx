import type { Metadata } from "next";
import { Building, Landmark, Layers, Users } from "lucide-react";
import { Badge, Card, CardContent } from "@mwcnu/ui";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { listInstitutions } from "@/repositories/organization-repository";

export const metadata: Metadata = {
  title: "Struktur Organisasi",
  description: "Bagan Struktur Organisasi MWCNU Mandobo, Lembaga, dan Badan Otonom.",
  alternates: { canonical: "/tentang/struktur" },
};

export default async function StrukturPage() {
  const institutions = await listInstitutions();
  const lembagaList = institutions.filter((i) => i.category === "lembaga");
  const banomList = institutions.filter((i) => i.category === "banom");

  return (
    <Container className="py-16 md:py-20">
      <SectionHeader
        kicker="Bagan Organisasi"
        title="Struktur Organisasi MWCNU Mandobo"
        description="Tata hubungan hierarkis antara Majelis Syuriyah, Pengurus Tanfidziyah, Lembaga Pelaksana, dan Badan Otonom."
      />

      {/* Level 1: Syuriyah & Tanfidziyah */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-secondary/30 from-secondary/10 via-card to-card bg-gradient-to-br">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <span className="bg-secondary/20 text-secondary flex size-12 items-center justify-center rounded-2xl">
                <Landmark className="size-6" />
              </span>
              <div>
                <Badge variant="secondary">Majelis Syuriyah</Badge>
                <h3 className="font-display text-lg font-bold">Pimpinan Tertinggi Organisasi</h3>
              </div>
            </div>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              Bertugas menentukan arah kebijakan umum, mengawasi pelaksanaan program, serta
              memberikan fatwa dan bimbingan keagamaan bagi warga nahdliyin di Distrik Mandobo.
            </p>
            <div className="bg-background/60 border-border mt-4 space-y-1.5 rounded-xl border p-4 text-xs">
              <p className="text-foreground font-semibold">Struktur Inti:</p>
              <p className="text-muted-foreground">• Rais Syuriyah & Wakil Rais</p>
              <p className="text-muted-foreground">• Katib Syuriyah & Wakil Katib</p>
              <p className="text-muted-foreground">• A&apos;wan (Penasehat/Sesepuh)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30 from-primary/10 via-card to-card bg-gradient-to-br">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <span className="bg-primary/20 text-primary flex size-12 items-center justify-center rounded-2xl">
                <Building className="size-6" />
              </span>
              <div>
                <Badge variant="default">Pengurus Tanfidziyah</Badge>
                <h3 className="font-display text-lg font-bold">Pelaksana Harian (Eksekutif)</h3>
              </div>
            </div>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              Bertugas memimpin dan melaksanakan ketetapan organisasi, menyelenggarakan program
              kerja, serta mengelola administrasi dan hubungan kemitraan kemasyarakatan.
            </p>
            <div className="bg-background/60 border-border mt-4 space-y-1.5 rounded-xl border p-4 text-xs">
              <p className="text-foreground font-semibold">Struktur Inti:</p>
              <p className="text-muted-foreground">• Ketua Tanfidziyah & Para Wakil Ketua</p>
              <p className="text-muted-foreground">• Sekretaris & Wakil Sekretaris</p>
              <p className="text-muted-foreground">• Bendahara & Wakil Bendahara</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level 2: Lembaga-Lembaga */}
      <section className="mt-14">
        <div className="border-border mb-6 flex items-center gap-3 border-b pb-3">
          <Layers className="text-primary size-5" />
          <h2 className="font-display text-xl font-bold">Lembaga Teknis Pelaksana</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lembagaList.map((lem) => (
            <Card
              key={lem.id}
              className="duration-base hover:shadow-soft transition-all hover:-translate-y-0.5"
            >
              <CardContent className="p-5">
                <Badge variant="outline" className="text-xs font-semibold uppercase">
                  {lem.abbreviation ?? "Lembaga"}
                </Badge>
                <h3 className="font-display text-foreground mt-2 text-base font-bold">
                  {lem.name}
                </h3>
                {lem.description && (
                  <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                    {lem.description}
                  </p>
                )}
                {lem.chairman && (
                  <p className="text-primary border-border mt-4 border-t pt-3 text-xs font-medium">
                    Ketua: {lem.chairman}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Level 3: Badan Otonom */}
      <section className="mt-14">
        <div className="border-border mb-6 flex items-center gap-3 border-b pb-3">
          <Users className="text-secondary size-5" />
          <h2 className="font-display text-xl font-bold">Badan Otonom (Banom)</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {banomList.map((banom) => (
            <Card
              key={banom.id}
              className="duration-base hover:shadow-soft transition-all hover:-translate-y-0.5"
            >
              <CardContent className="p-5">
                <Badge variant="secondary" className="text-xs font-semibold">
                  {banom.abbreviation ?? "Banom"}
                </Badge>
                <h3 className="font-display text-foreground mt-2 text-base font-bold">
                  {banom.name}
                </h3>
                {banom.description && (
                  <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                    {banom.description}
                  </p>
                )}
                {banom.chairman && (
                  <p className="text-secondary border-border mt-4 border-t pt-3 text-xs font-medium">
                    Pimpinan: {banom.chairman}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </Container>
  );
}
