import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { ComingSoon } from "@/components/shared/coming-soon";

export const metadata: Metadata = {
  title: "Struktur Organisasi",
  description: "Struktur organisasi MWCNU Mandobo yang interaktif.",
  alternates: { canonical: "/tentang/struktur" },
};

export default function StrukturPage() {
  return (
    <Container className="py-16 md:py-20">
      <SectionHeader
        kicker="Organisasi"
        title="Struktur Organisasi"
        description="Struktur pengurus MWCNU, lembaga, dan banom dalam tampilan pohon interaktif."
      />
      <ComingSoon description="Pohon struktur interaktif akan hadir pada MVP. Anda dapat mengklik setiap node untuk melihat detail pengurus dan masa khidmat." />
    </Container>
  );
}
