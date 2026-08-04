import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { ComingSoon } from "@/components/shared/coming-soon";

export const metadata: Metadata = {
  title: "Kajian & Khutbah",
  description: "Kumpulan kajian dan khutbah MWCNU Mandobo dalam berbagai format.",
  alternates: { canonical: "/kajian" },
};

export default function KajianPage() {
  return (
    <Container className="py-16 md:py-20">
      <SectionHeader
        kicker="Dakwah"
        title="Kajian & Khutbah"
        description="Materi kajian, khutbah Jumat, dan arsip dakwah dalam format PDF, audio, dan video."
      />
      <ComingSoon />
    </Container>
  );
}
