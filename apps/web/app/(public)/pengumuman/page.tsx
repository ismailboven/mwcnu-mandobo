import type { Metadata } from "next";
import { AlertCircle, Bell, Info, Pin } from "lucide-react";
import { Badge, Card, CardContent } from "@mwcnu/ui";
import { formatDateID } from "@mwcnu/utils";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { listAnnouncements } from "@/repositories/announcement-repository";

export const metadata: Metadata = {
  title: "Pengumuman",
  description: "Pengumuman resmi dan informasi penting dari MWCNU Mandobo.",
  alternates: { canonical: "/pengumuman" },
};

const TYPE_CONFIG = {
  info: { label: "Informasi", icon: Info, variant: "secondary" as const },
  himbauan: { label: "Himbauan", icon: Bell, variant: "default" as const },
  peringatan: { label: "Peringatan", icon: AlertCircle, variant: "destructive" as const },
};

export default async function PengumumanPage() {
  const announcements = await listAnnouncements({ limit: 20 });

  return (
    <Container className="py-16 md:py-20">
      <SectionHeader
        kicker="Informasi"
        title="Pengumuman Resmi"
        description="Pengumuman dan edaran resmi Majelis Wakil Cabang Nahdlatul Ulama Distrik Mandobo."
      />

      {announcements.length === 0 ? (
        <p className="text-muted-foreground text-sm">Belum ada pengumuman aktif.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {announcements.map((item) => {
            const typeInfo = TYPE_CONFIG[item.announcement_type] ?? TYPE_CONFIG.info;
            const Icon = typeInfo.icon;

            return (
              <Card
                key={item.id}
                className={`duration-base hover:shadow-medium relative overflow-hidden transition-all hover:-translate-y-0.5 ${
                  item.is_pinned ? "border-primary/40 bg-card ring-primary/20 ring-1" : "bg-card"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={typeInfo.variant} className="inline-flex items-center gap-1">
                        <Icon className="size-3" />
                        {typeInfo.label}
                      </Badge>
                      {item.is_pinned && (
                        <span className="text-primary inline-flex items-center gap-1 text-xs font-semibold">
                          <Pin className="size-3" /> Disematkan
                        </span>
                      )}
                    </div>
                    {item.created_at && (
                      <time className="text-muted-foreground text-xs">
                        {formatDateID(item.created_at)}
                      </time>
                    )}
                  </div>

                  <h3 className="font-display text-foreground mt-4 text-xl font-bold">
                    {item.title}
                  </h3>

                  {item.content && (
                    <p className="text-muted-foreground mt-3 text-sm leading-relaxed text-pretty">
                      {item.content}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </Container>
  );
}
