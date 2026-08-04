import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { ComingSoon } from "@/components/shared/coming-soon";

export const metadata: Metadata = {
  title: "Galeri",
  description: "Galeri foto dan video kegiatan MWCNU Mandobo.",
  alternates: { canonical: "/galeri" },
};

export default function GaleriPage() {
  return (
    <Container className="py-16 md:py-20">
      <SectionHeader
        kicker="Dokumentasi"
        title="Galeri"
        description="Dokumentasi foto dan video kegiatan MWCNU Mandobo."
      />
      <ComingSoon />
    </Container>
  );
}
