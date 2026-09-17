import type { Metadata } from "next";
import { Mail, Phone, UserCheck } from "lucide-react";
import { Badge, Card, CardContent } from "@mwcnu/ui";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { listLeaders } from "@/repositories/organization-repository";

export const metadata: Metadata = {
  title: "Susunan Pengurus",
  description: "Susunan Pengurus Syuriyah dan Tanfidziyah MWCNU Mandobo Periode 2026-2030.",
  alternates: { canonical: "/tentang/pengurus" },
};

export default async function PengurusPage() {
  const leaders = await listLeaders();
  const syuriyah = leaders.filter((l) => l.category === "Syuriyah");
  const tanfidziyah = leaders.filter((l) => l.category === "Tanfidziyah");

  return (
    <Container className="py-16 md:py-20">
      <SectionHeader
        kicker="Struktural"
        title="Pengurus MWCNU Mandobo"
        description="Jajaran pengurus Syuriyah dan Tanfidziyah Majelis Wakil Cabang Nahdlatul Ulama Distrik Mandobo Masa Khidmat 2026–2030."
      />

      {/* Syuriyah Section */}
      <section className="mb-14">
        <div className="border-border mb-6 flex items-center gap-3 border-b pb-3">
          <Badge variant="secondary" className="text-sm font-semibold">
            Majelis Syuriyah
          </Badge>
          <span className="text-muted-foreground text-xs">
            Pimpinan Tertinggi & Pembina Spiritual
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {syuriyah.map((leader) => (
            <LeaderCard key={leader.id} leader={leader} />
          ))}
        </div>
      </section>

      {/* Tanfidziyah Section */}
      <section>
        <div className="border-border mb-6 flex items-center gap-3 border-b pb-3">
          <Badge variant="default" className="text-sm font-semibold">
            Pengurus Tanfidziyah
          </Badge>
          <span className="text-muted-foreground text-xs">
            Pelaksana Program & Operasional Organisasi
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tanfidziyah.map((leader) => (
            <LeaderCard key={leader.id} leader={leader} />
          ))}
        </div>
      </section>
    </Container>
  );
}

function LeaderCard({
  leader,
}: {
  leader: (typeof listLeaders extends () => Promise<infer T> ? T : never)[number];
}) {
  return (
    <Card className="duration-base hover:shadow-medium overflow-hidden transition-all hover:-translate-y-0.5">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary font-display flex size-14 shrink-0 items-center justify-center rounded-2xl text-xl font-extrabold">
            {leader.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-primary text-xs font-semibold tracking-wider uppercase">
              {leader.position_title}
            </span>
            <h3 className="font-display text-foreground truncate text-base font-bold">
              {leader.name}
            </h3>
            <p className="text-muted-foreground text-xs">Masa Khidmat: 2026–2030</p>
          </div>
        </div>

        {leader.bio && (
          <p className="text-muted-foreground mt-4 line-clamp-3 text-xs leading-relaxed">
            {leader.bio}
          </p>
        )}

        <div className="border-border text-muted-foreground mt-4 flex items-center gap-3 border-t pt-4 text-xs">
          {leader.phone && (
            <a
              href={`tel:${leader.phone}`}
              className="hover:text-primary inline-flex items-center gap-1 transition-colors"
            >
              <Phone className="size-3.5" />
              Kontak
            </a>
          )}
          {leader.email && (
            <a
              href={`mailto:${leader.email}`}
              className="hover:text-primary inline-flex items-center gap-1 transition-colors"
            >
              <Mail className="size-3.5" />
              Email
            </a>
          )}
          <span className="text-success ml-auto inline-flex items-center gap-1 text-xs font-medium">
            <UserCheck className="size-3.5" /> Aktif
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
