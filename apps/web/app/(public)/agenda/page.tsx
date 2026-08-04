import type { Metadata } from "next";
import { EventCard } from "@/components/domain/event-card";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { listUpcomingEvents } from "@/repositories/event-repository";

export const metadata: Metadata = {
  title: "Agenda",
  description: "Agenda kegiatan dan kajian MWCNU Mandobo.",
  alternates: { canonical: "/agenda" },
};

export default async function AgendaPage() {
  const events = await listUpcomingEvents({ limit: 12 });

  return (
    <Container className="py-16 md:py-20">
      <SectionHeader
        kicker="Jadwal"
        title="Agenda Kegiatan"
        description="Jadwal kajian, rapat, dan kegiatan MWCNU Mandobo yang akan datang."
      />
      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada agenda.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </Container>
  );
}
