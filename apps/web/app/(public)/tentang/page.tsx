import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/shared/section-header";
import { ORGANIZATION_FULL } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Tentang",
  description: "Profil dan visi misi MWCNU Mandobo.",
  alternates: { canonical: "/tentang" },
};

export default function TentangPage() {
  return (
    <Container className="py-16 md:py-20">
      <SectionHeader kicker="Profil" title="Tentang MWCNU Mandobo" />
      <div className="mx-auto max-w-3xl space-y-6 text-pretty leading-relaxed text-muted-foreground">
        <p>
          {ORGANIZATION_FULL} adalah wadah perjuangan Nahdlatul Ulama di tingkat kecamatan (Majelis
          Wakil Cabang) yang berada di Distrik Mandobo, Kabupaten Boven Digoel, Provinsi Papua
          Selatan.
        </p>
        <p>
          Platform digital ini dihadirkan untuk mendukung tata kelola organisasi yang transparan,
          arsip yang terpusat, serta dakwah yang menjangkau seluruh lapisan masyarakat — dengan tetap
          menjaga nilai-nilai Ahlussunnah wal Jama&apos;ah: Tawasuth, I&apos;tidal, Tasamuh, dan Tawazun.
        </p>
      </div>
    </Container>
  );
}
