import {
  CalendarDays,
  Download,
  Images,
  LayoutDashboard,
  Network,
  Newspaper,
  Settings,
  Tag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Berita", href: "/admin/berita", icon: Newspaper },
  { label: "Kategori", href: "/admin/kategori", icon: Tag },
  { label: "Agenda", href: "/admin/agenda", icon: CalendarDays, disabled: true },
  { label: "Galeri", href: "/admin/galeri", icon: Images, disabled: true },
  { label: "Unduhan", href: "/admin/unduhan", icon: Download, disabled: true },
  { label: "Struktur", href: "/admin/struktur", icon: Network, disabled: true },
  { label: "Pengaturan", href: "/admin/pengaturan", icon: Settings, disabled: true },
];
