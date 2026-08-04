import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { ComingSoon } from "@/components/shared/coming-soon";

export const metadata: Metadata = {
  title: "Pengumuman",
  description: "Pengumuman resmi MWCNU Mandobo.",
  alternates: { canonical: "/pengumuman" },
};

export default function PengumumanPage() {
  return (
    <Container className="py-16 md:py-20">
      <SectionHeader
        kicker="Informasi"
        title="Pengumuman"
        description="Pengumuman resmi dan informasi penting dari MWCNU Mandobo."
      />
      <ComingSoon />
    </Container>
  );
}
