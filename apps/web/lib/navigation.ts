export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

export const NAV_LINKS: NavLink[] = [
  {
    label: "Tentang",
    href: "/tentang",
    children: [
      { label: "Sejarah", href: "/tentang/sejarah" },
      { label: "Visi & Misi", href: "/tentang/visi-misi" },
      { label: "Struktur", href: "/tentang/struktur" },
      { label: "Pengurus", href: "/tentang/pengurus" },
    ],
  },
  { label: "Berita", href: "/berita" },
  { label: "Agenda", href: "/agenda" },
  { label: "Kajian", href: "/kajian" },
  { label: "Galeri", href: "/galeri" },
  { label: "Unduhan", href: "/download" },
];

export const ORGANIZATION_NAME = "MWCNU Mandobo";
export const ORGANIZATION_FULL = "Majelis Wakil Cabang Nahdlatul Ulama Distrik Mandobo";

export const CONTACT = {
  email: "info@mwcnumandobo.or.id",
  address: "Distrik Mandobo, Kabupaten Boven Digoel, Papua Selatan, Indonesia",
};
