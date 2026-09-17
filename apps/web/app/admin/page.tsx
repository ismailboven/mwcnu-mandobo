import Link from "next/link";
import { ArrowUpRight, CalendarDays, Download, FileText, Plus, Tag } from "lucide-react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@mwcnu/ui";
import { getAdminDashboardStats } from "@/repositories/dashboard-repository";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  const overview = [
    { label: "Total Berita", value: stats.articleCount, icon: FileText, href: "/admin/berita" },
    { label: "Kategori Aktif", value: stats.categoryCount, icon: Tag, href: "/admin/kategori" },
    { label: "Agenda Kegiatan", value: stats.eventCount, icon: CalendarDays, href: "/agenda" },
    { label: "Dokumen & Arsip", value: stats.documentCount, icon: Download, href: "/download" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Ringkasan Sistem</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Panel kendali dan status operasional data MWCNU Mandobo.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1.5 px-3 py-1">
            <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
            Sistem Aktif
          </Badge>
          <Button asChild size="sm" variant="outline" className="gap-1.5">
            <Link href="/" target="_blank">
              Lihat Web Publik
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Counters */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overview.map((item) => (
          <Card
            key={item.label}
            className="hover:border-primary/40 hover:shadow-soft transition-all"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                {item.label}
              </CardTitle>
              <item.icon className="text-primary size-4" />
            </CardHeader>
            <CardContent>
              <p className="font-display text-foreground text-3xl font-extrabold">{item.value}</p>
              <Link
                href={item.href}
                className="text-primary mt-3 inline-flex items-center gap-1 text-xs font-semibold hover:underline"
              >
                Kelola Modul
                <ArrowUpRight className="size-3" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold">Aksi Cepat Pengelolaan</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Button asChild className="h-auto justify-start gap-2 py-3">
            <Link href="/admin/berita/baru">
              <Plus className="size-4" />
              <span>Tulis Berita Baru</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto justify-start gap-2 py-3">
            <Link href="/admin/kategori">
              <Tag className="text-primary size-4" />
              <span>Kelola Kategori</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto justify-start gap-2 py-3">
            <Link href="/admin/berita">
              <FileText className="text-secondary size-4" />
              <span>Daftar Semua Berita</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
