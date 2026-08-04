import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatDateID } from "@mwcnu/utils";
import { Container } from "@/components/layout/container";
import { listUpcomingEvents } from "@/repositories/event-repository";

interface Props {
  params: Promise<{ slug: string }>;
}

export const metadata: Metadata = {
  title: "Detail Agenda",
};

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const events = await listUpcomingEvents({ limit: 50 });
  const event = events.find((item) => item.slug === slug);
  if (!event) notFound();

  return (
    <Container className="py-16 md:py-20">
      <article className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-balance">{event.title}</h1>
        <dl className="mt-6 space-y-3 rounded-2xl border border-border bg-card p-6 text-sm shadow-soft">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Waktu</dt>
            <dd>{formatDateID(event.starts_at)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Lokasi</dt>
            <dd>{event.location ?? "-"}</dd>
          </div>
        </dl>
      </article>
    </Container>
  );
}
