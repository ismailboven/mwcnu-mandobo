import type { Metadata } from "next";
import { CheckCircle2, Clock } from "lucide-react";
import { Badge, Card, CardContent } from "@mwcnu/ui";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { listPrograms } from "@/repositories/program-repository";

export const metadata: Metadata = {
  title: "Program Kerja",
  description: "Agenda dan rencana strategis program kerja MWCNU Mandobo periode 2026-2030.",
  alternates: { canonical: "/program-kerja" },
};

export default async function ProgramKerjaPage() {
  const programs = await listPrograms();

  return (
    <Container className="py-16 md:py-20">
      <SectionHeader
        kicker="Rencana Strategis"
        title="Program Kerja Organisasi"
        description="Rencana kerja dan capaian target strategis MWCNU Mandobo dalam bidang dakwah, pendidikan, sosial, dan ekonomi umat."
      />

      <div className="space-y-8">
        {programs.map((program) => (
          <Card
            key={program.id}
            className="duration-base hover:shadow-medium overflow-hidden transition-all"
          >
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs font-semibold">
                    {program.field ?? "Program Umum"}
                  </Badge>
                  {program.period && (
                    <span className="text-muted-foreground text-xs font-medium">
                      Periode: {program.period}
                    </span>
                  )}
                </div>
                <Badge
                  variant={program.status === "completed" ? "success" : "default"}
                  className="text-xs capitalize"
                >
                  {program.status === "active" ? "Sedang Berjalan" : program.status}
                </Badge>
              </div>

              <h3 className="font-display text-foreground mt-4 text-xl font-bold md:text-2xl">
                {program.title}
              </h3>

              {program.description && (
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {program.description}
                </p>
              )}

              {/* Program Items / Milestones */}
              {program.items && program.items.length > 0 && (
                <div className="border-border mt-6 space-y-4 border-t pt-6">
                  <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    Capaian & Rincian Kegiatan:
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {program.items.map((item) => (
                      <div
                        key={item.id}
                        className="border-border bg-muted/40 space-y-2 rounded-xl border p-4"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-display text-foreground text-sm font-bold">
                            {item.title}
                          </p>
                          {item.progress === 100 ? (
                            <CheckCircle2 className="text-success size-4 shrink-0" />
                          ) : (
                            <Clock className="text-secondary size-4 shrink-0" />
                          )}
                        </div>
                        {item.description && (
                          <p className="text-muted-foreground text-xs">{item.description}</p>
                        )}
                        <div className="pt-2">
                          <div className="text-muted-foreground mb-1 flex justify-between text-xs font-medium">
                            <span>Progress</span>
                            <span>{item.progress}%</span>
                          </div>
                          <div className="bg-border h-2 w-full overflow-hidden rounded-full">
                            <div
                              className="bg-primary h-full transition-all"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
