import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { formatDateShortID } from "@mwcnu/utils";
import { Badge, Card, CardContent } from "@mwcnu/ui";
import type { EventCard as EventCardData } from "@mwcnu/types";

const EVENT_STATUS_LABEL: Record<EventCardData["status"], string> = {
  upcoming: "Akan Datang",
  ongoing: "Berlangsung",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const EVENT_STATUS_VARIANT: Record<EventCardData["status"], "success" | "info" | "muted" | "destructive"> = {
  upcoming: "success",
  ongoing: "info",
  completed: "muted",
  cancelled: "destructive",
};

export function EventCard({ event }: { event: EventCardData }) {
  return (
    <Card className="transition-all duration-base hover:-translate-y-0.5 hover:shadow-medium">
      <CardContent className="flex gap-4 p-5">
        <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-accent py-2 text-primary">
          <span className="font-display text-xl font-extrabold leading-none">
            {new Date(event.starts_at).getDate()}
          </span>
          <span className="mt-1 text-[11px] font-semibold uppercase">
            {new Date(event.starts_at).toLocaleDateString("id-ID", { month: "short" })}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <Badge variant={EVENT_STATUS_VARIANT[event.status]}>{EVENT_STATUS_LABEL[event.status]}</Badge>
          <h3 className="mt-2 font-display text-base font-bold leading-snug line-clamp-2">
            <Link href={`/agenda/${event.slug}`} className="transition-colors hover:text-primary">
              {event.title}
            </Link>
          </h3>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              {formatDateShortID(event.starts_at)}
            </span>
            {event.location ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {event.location}
              </span>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
