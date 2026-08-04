import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@mwcnu/ui";
import { Container } from "@/components/layout/container";

export const metadata = {
  title: "Manajemen Berita",
};

export default function AdminBeritaPage() {
  return (
    <Container>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Manajemen Berita</h1>
        <Button asChild>
          <Link href="/admin/berita/baru">Buat Berita</Link>
        </Button>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Modul CRUD berita (WYSIWYG/Markdown, pinned, jadwal publish) akan hadir di sprint 3.
      </p>
      <Button asChild variant="ghost" className="mt-6">
        <Link href="/admin">
          <ArrowLeft className="size-4" />
          Kembali ke Dashboard
        </Link>
      </Button>
    </Container>
  );
}
