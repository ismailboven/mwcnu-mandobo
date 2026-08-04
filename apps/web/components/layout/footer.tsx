import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { CONTACT, ORGANIZATION_FULL } from "@/lib/navigation";

const FOOTER_COLUMNS = [
  {
    title: "Tentang",
    links: [
      { label: "Sejarah", href: "/tentang/sejarah" },
      { label: "Visi & Misi", href: "/tentang/visi-misi" },
      { label: "Struktur", href: "/tentang/struktur" },
      { label: "Pengurus", href: "/tentang/pengurus" },
    ],
  },
  {
    title: "Konten",
    links: [
      { label: "Berita", href: "/berita" },
      { label: "Agenda", href: "/agenda" },
      { label: "Kajian", href: "/kajian" },
      { label: "Galeri", href: "/galeri" },
      { label: "Unduhan", href: "/download" },
    ],
  },
  {
    title: "Organisasi",
    links: [
      { label: "Program Kerja", href: "/program-kerja" },
      { label: "Tokoh", href: "/tokoh" },
      { label: "Direktori Masjid", href: "/masjid" },
      { label: "Pengumuman", href: "/pengumuman" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-lg font-bold text-primary">MWCNU Mandobo</p>
            <p className="mt-2 text-sm text-muted-foreground">{ORGANIZATION_FULL}</p>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" />
                {CONTACT.email}
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                {CONTACT.address}
              </p>
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={`Footer ${column.title}`}>
              <p className="font-display text-sm font-bold">{column.title}</p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {ORGANIZATION_FULL}. Hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}
