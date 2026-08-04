import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { ComingSoon } from "@/components/shared/coming-soon";

export const metadata: Metadata = {
  title: "Pengurus",
  description: "Profil pengurus MWCNU Mandobo.",
  alternates: { canonical: "/tentang/pengurus" },
};

export default function PengurusPage() {
  return (
    <Container className="py-16 md:py-20">
      <SectionHeader
        kicker="Organisasi"
        title="Pengurus MWCNU Mandobo"
        description="Susunan pengurus beserta masa khidmat periode aktif."
      />
      <ComingSoon description="Daftar pengurus lengkap dengan masa khidmat akan hadir pada MVP." />
    </Container>
  );
}
