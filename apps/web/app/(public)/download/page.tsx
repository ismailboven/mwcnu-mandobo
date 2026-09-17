import type { Metadata } from "next";
import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { Badge, Button, Card, CardContent } from "@mwcnu/ui";
import { formatDateID, cn } from "@mwcnu/utils";
import type { DocumentCategory } from "@mwcnu/types";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { listPublishedDocuments } from "@/repositories/document-repository";

export const metadata: Metadata = {
  title: "Unduhan & Dokumen Resmi",
  description:
    "Download center Surat Keputusan (SK), modul panduan, materi khutbah, dan formulir resmi MWCNU Mandobo.",
  alternates: { canonical: "/download" },
};

const CATEGORIES: { label: string; value: DocumentCategory | "all" }[] = [
  { label: "Semua Dokumen", value: "all" },
  { label: "Surat Keputusan (SK)", value: "sk" },
  { label: "Panduan & Juklak", value: "panduan" },
  { label: "Khutbah & Materi", value: "khutbah" },
  { label: "Formulir", value: "formulir" },
];

interface Props {
  searchParams: Promise<{ kategori?: string }>;
}

function formatBytes(bytes?: number | null): string {
  if (!bytes) return "PDF";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

export default async function DownloadPage({ searchParams }: Props) {
  const { kategori } = await searchParams;
  const currentCategory = (kategori as DocumentCategory | "all") || "all";

  const documents = await listPublishedDocuments({
    category: currentCategory === "all" ? undefined : (currentCategory as DocumentCategory),
    limit: 50,
  });

  return (
    <Container className="py-16 md:py-20">
      <SectionHeader
        kicker="Arsip & Regulasi"
        title="Download Center Dokumen"
        description="Akses dokumen resmi, modul panduan pengurus, pedoman administrasi, dan formulir keanggotaan."
      />

      {/* Filter Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = currentCategory === cat.value;
          const href = cat.value === "all" ? "/download" : `/download?kategori=${cat.value}`;

          return (
            <Link
              key={cat.value}
              href={href}
              className={cn(
                "inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-xs"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>

      {documents.length === 0 ? (
        <p className="text-muted-foreground text-sm">Tidak ada dokumen pada kategori ini.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {documents.map((doc) => (
            <Card
              key={doc.id}
              className="duration-base hover:border-primary/40 hover:shadow-soft flex flex-col justify-between overflow-hidden transition-all"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
                    <FileText className="size-5" />
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs font-semibold tracking-wider uppercase"
                  >
                    {doc.category}
                  </Badge>
                </div>

                <h3 className="font-display text-foreground mt-3 text-base font-bold">
                  {doc.title}
                </h3>

                {doc.description && (
                  <p className="text-muted-foreground mt-2 line-clamp-2 text-xs leading-relaxed">
                    {doc.description}
                  </p>
                )}

                {doc.document_number && (
                  <p className="text-muted-foreground mt-2 font-mono text-xs">
                    No: {doc.document_number}
                  </p>
                )}

                <div className="border-border text-muted-foreground mt-4 flex items-center justify-between border-t pt-4 text-xs">
                  <span>
                    {doc.issued_date ? formatDateID(doc.issued_date) : "Resmi MWCNU"} •{" "}
                    {formatBytes(doc.file_size_bytes)}
                  </span>
                  <Button asChild size="sm" variant="outline" className="h-8 gap-1.5">
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer" download>
                      <Download className="size-3.5" />
                      Unduh
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
