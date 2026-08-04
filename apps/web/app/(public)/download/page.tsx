import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { ComingSoon } from "@/components/shared/coming-soon";

export const metadata: Metadata = {
  title: "Unduhan",
  description: "Download center dokumen resmi MWCNU Mandobo.",
  alternates: { canonical: "/download" },
};

export default function DownloadPage() {
  return (
    <Container className="py-16 md:py-20">
      <SectionHeader
        kicker="Arsip"
        title="Unduhan & Dokumen"
        description="Akses SK, surat, notulen, panduan, dan dokumen resmi organisasi."
      />
      <ComingSoon />
    </Container>
  );
}
