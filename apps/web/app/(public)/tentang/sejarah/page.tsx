import type { Metadata } from "next";
import { History, Milestone } from "lucide-react";
import { Badge, Card, CardContent } from "@mwcnu/ui";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { listTimelineEvents, listFigures } from "@/repositories/history-repository";

export const metadata: Metadata = {
  title: "Sejarah & Tokoh",
  description: "Jejak sejarah pendirian dan tokoh perintis Nahdlatul Ulama di Distrik Mandobo.",
  alternates: { canonical: "/tentang/sejarah" },
};

export default async function SejarahPage() {
  const [timeline, figures] = await Promise.all([listTimelineEvents(), listFigures()]);

  return (
    <Container className="py-16 md:py-20">
      <SectionHeader
        kicker="Napak Tilas"
        title="Sejarah MWCNU Mandobo"
        description="Perjalanan khidmah dakwah Nahdlatul Ulama dari masa perintisan hingga era transformasi digital di Boven Digoel."
      />

      {/* Timeline Section */}
      <section className="mb-16">
        <div className="border-border mb-8 flex items-center gap-3 border-b pb-3">
          <History className="text-primary size-5" />
          <h2 className="font-display text-xl font-bold">Lini Masa Sejarah</h2>
        </div>

        <div className="border-primary/30 relative ml-3 space-y-8 border-l-2 pl-6">
          {timeline.map((item) => (
            <div key={item.id} className="group relative">
              <div className="bg-primary text-primary-foreground absolute top-1 -left-3.5 flex size-6 items-center justify-center rounded-full text-xs shadow-xs">
                <Milestone className="size-3" />
              </div>
              <Badge variant="secondary" className="font-mono text-xs font-bold">
                {item.year_start} {item.year_end ? `– ${item.year_end}` : ""}
              </Badge>
              <h3 className="font-display text-foreground mt-2 text-lg font-bold">{item.title}</h3>
              {item.description && (
                <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Figures Section */}
      <section>
        <div className="border-border mb-8 flex items-center gap-3 border-b pb-3">
          <h2 className="font-display text-xl font-bold">Tokoh & Sesepuh</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {figures.map((fig) => (
            <Card
              key={fig.id}
              className="bg-card duration-base hover:shadow-medium overflow-hidden transition-all"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs font-semibold capitalize">
                    {fig.category}
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    Lahir: {fig.birth_place ?? "Indonesia"}, {fig.birth_year ?? "1960"}
                  </span>
                </div>
                <h3 className="font-display text-foreground mt-3 text-lg font-bold">{fig.name}</h3>
                {fig.bio && (
                  <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{fig.bio}</p>
                )}
                {fig.quote && (
                  <blockquote className="border-secondary text-secondary-foreground/90 bg-secondary/5 mt-4 rounded-r-lg border-l-2 py-2 pl-3 text-xs italic">
                    &ldquo;{fig.quote}&rdquo;
                  </blockquote>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </Container>
  );
}
