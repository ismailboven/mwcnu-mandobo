# Component Library: MWCNU Mandobo Web Platform

> Daftar lengkap komponen UI. **Dilarang membuat komponen baru tanpa terlebih dahulu memeriksa dokumen ini.** Semua komponen dibangun di atas shadcn/ui (Radix UI + Tailwind), berada di `packages/ui` atau `src/components/ui`.

---

## 1. Level Komponen (Atomic)

| Level | Lokasi | Contoh |
|-------|--------|--------|
| **Atom** | `components/ui/*` | Button, Input, Badge, Avatar |
| **Molecule** | `components/*` | ArticleCard, SearchBar, AudioPlayer |
| **Organism** | `components/*` | Navbar, Hero, Footer, BentoSection |
| **Template** | `app/**/page.tsx` | Halaman = komposisi organism |
| **Feature** | `features/*` | article, event, gallery — orchestrasi data |

---

## 2. Komponen Dasar (shadcn/ui + kustomisasi)

### 2.1 Button
| Prop | Value |
|------|-------|
| **Variant** | `default` (primary solid), `secondary` (gold), `outline`, `ghost`, `link`, `destructive` |
| **Size** | `sm` (h-9), `default` (h-10), `lg` (h-11), `icon` (h-10 w-10) |
| **Radius** | `rounded-lg` (12px) |
| **Style** | `font-semibold`, `shadow-sm`, active `scale-[0.98]` |
| **Loading** | prop `loading` → spinner + disable |

### 2.2 Card
| Token | Value |
|-------|-------|
| **Radius** | `rounded-2xl` (20px) |
| **Surface** | `bg-card text-card-foreground ring-1 ring-border shadow-soft` |
| **Hover** | `shadow-medium hover:-translate-y-0.5 transition` (optional per varian) |
| **Parts** | `CardHeader` (title+desc), `CardContent`, `CardFooter` |

### 2.3 Input / Textarea
- Radius `rounded-lg`, height 10 (40px), focus ring primary
- Textarea: min-h-20, resize-y
- Error: border destructive + message + `aria-invalid`

### 2.4 Badge
- Varian: `default` (primary), `secondary` (gold), `outline`, `destructive`, `info`, `success`, `warning`
- Ukuran: `sm` / `default`; radius `rounded-full`
- Untuk tipe pengumuman: info=hijau, himbauan=gold, peringatan=destructive

### 2.5 Dialog
- Radius `rounded-3xl`, `shadow-floating`
- Mobile: full-screen bottom sheet; Desktop: centered, max-w
- Wajib: `aria-labelledby`, tombol close, close on Escape + overlay click

### 2.6 Dropdown Menu / Combobox
- Berbasis Radix `DropdownMenu` / `Popover` + `Command`
- Scroll max-h, searchable (combobox), keyboard navigation

### 2.7 Form
- `React Hook Form` + `Zod` resolver
- Komponen `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`
- Error inline, live validation

### 2.8 Toast
- `aria-live="polite"`, stack top-right (mobile: top)
- Varian: success/error/info/loading

### 2.9 Skeleton
- Shimmer halus, ukuran mengikuti konten target (hindari layout shift)

---

## 3. Komponen Domain (Molecule/Organism)

### 3.1 Navbar
- Sticky, `backdrop-blur` + `bg-background/80`, border-bottom
- Kiri: logo + nama; Tengah: menu; Kanan: search + dark toggle + CTA
- Mobile: hamburger drawer (kiri) + bottom nav (Home, Berita, Agenda, Lainnya)
- Active link: text-primary + indicator

### 3.2 Footer
- 4 kolom nav + kontak + medsos (font AWESOME → gunakan Lucide untuk ikon sosial)
- Copyright dinamis tahun, nama resmi, link kebijakan privasi

### 3.3 Hero
- **Varian A (Banner carousel)**: gambar full-bleed, overlay gradient, judul + CTA, dots/arrow, autoplay dengan pause on hover
- **Varian B (Statis)**: teks besar + visual bento, pattern islamic subtle
- Alt text wajib; gambar via next/image priority

### 3.4 ArticleCard
- Varian: `featured` (col-span-2, gambar besar), `default` (grid), `compact` (list)
- Isi: cover image, kategori badge, judul (2-line clamp), ringkasan (3-line clamp), tanggal + author
- Hover: gambar scale-105, card shadow meningkat

### 3.5 EventCard / AgendaCard
- Tanggal block (hari + bulan), judul, lokasi, waktu
- Status badge: upcoming (success), ongoing (info), completed (muted), cancelled (destructive)

### 3.6 GalleryCard / Lightbox
- Grid masonry/equal; klik → lightbox dengan prev/next keyboard
- Video badge jika media berisi video

### 3.7 DownloadCard
- Ikon tipe file (PDF/audio/video/doc), judul, ukuran, tgl, tombol unduh + hit counter

### 3.8 OrganizationTree
- Komponen **kustom** (bukan library berat): recursive node, expand/collapse, klik → detail panel
- Node: jabatan + nama + periode; visual connector garis hijau
- Dukungan keyboard (arrow expand)

### 3.9 Timeline
- Vertikal, item berselang-seling (desktop), single column (mobile)
- Dot primary + garis muted; item = year badge + judul + deskripsi

### 3.10 StatisticCard
- Angka besar (tabular-nums) + label + ikon + optional trend

### 3.11 ProgramCard
- Judul program, deskripsi, progress bar, status badge, target

### 3.12 AudioPlayer / VideoPlayer
- Audio: custom player (play/pause, seek, speed) dengan progress persist per user (localStorage)
- Video: native `video` + poster, atau embed YouTube responsif (16:9)

### 3.13 SermonCard
- Judul + ringkasan + format icons (PDF/audio/video) + speaker + durasi

### 3.14 LeaderCard
- Foto, nama, jabatan, periode, status (Aktif/Selesai), kontak

### 3.15 InstitutionCard
- Nama lembaga/banom, deskripsi singkat, ketua, link detail

### 3.16 MosqueCard
- Nama, alamat, gambar, CTA "Lihat Map" (Leaflet/MapLibre popup)

### 3.17 SearchBar / SearchResult
- Input + debounce (300ms), dropdown hasil + filter tab (Semua/Berita/Agenda/Kajian/Dokumen)
- Empty state, loading skeleton, highlight keyword

### 3.18 Pagination
- Prev/next + nomor halaman, `aria-label`, active state primary

### 3.19 Breadcrumb
- Auto dari route, chevron separator, last item = current (aria-current)

### 3.20 SectionHeader
- Kicker (small label gold), judul H2, optional CTA "Lihat Semua →"
- Konsisten di semua section bento

### 3.21 EmptyState / ErrorState
- Ikon Lucide + pesan ramah + CTA

---

## 4. Komponen Admin (apps/admin)

- **Sidebar**: navigasi modul, collapsible, ikon + label
- **DataTable**: sorting, filter, search, pagination, row actions (kolom aksi)
- **FormDialog**: dialog berisi form CRUD (RHF + Zod)
- **FileUpload**: drag-drop ke Supabase Storage, preview, progress
- **StatusBadge**: draft/publish/scheduled/archived
- **ImagePicker**: pilih/upload dari galeri
- **Combobox Select**: kategori/tag/guru dengan search
- **ConfirmDialog**: konfirmasi hapus
- **Toaster** / **InlineAlert**

---

## 5. Aturan Penggunaan

1. **Reuse before rebuild** — periksa daftar ini + komponen existing sebelum buat baru.
2. **Semua komponen base** dari shadcn/ui (jangan fork library tanpa alasan).
3. Komponen domain selalu **receive data via props** (server component / repository), tidak query langsung.
4. Nama komponen **PascalCase**; file `kebab-case.tsx`.
5. Props di luar shadcn default mengikuti pola: `variant`, `size`, `disabled`, `loading`, `className`.
6. **Tanpa inline style**; semua styling Tailwind + token.
7. Ikon selalu Lucide.
8. Tambahkan komponen ke dokumen ini saat dibuat (dokumentasi hidup).

---

## 6. Daftar Komponen Resmi (Index)

### ui/ (Atom)
- Button, Badge, Card, Input, Textarea, Label, Select, Combobox, Checkbox, RadioGroup, Switch, Dialog, AlertDialog, Popover, Tooltip, DropdownMenu, Sheet (drawer), Tabs, Accordion, Table, Avatar, Skeleton, Separator, Breadcrumb, Pagination, Toast/Toaster, ScrollArea, Command, Progress, Slider, ToggleGroup, Calendar (date picker)

### domain/ (Molecule)
- Navbar, Footer, Hero, ArticleCard, EventCard, GalleryCard, DownloadCard, OrganizationTree, Timeline, StatisticCard, ProgramCard, AudioPlayer, VideoPlayer, SermonCard, LeaderCard, InstitutionCard, MosqueCard, SearchBar, SearchResult, SectionHeader, EmptyState, ErrorState, Lightbox, SocialShare, PageHeader, AuthorBadge, CategoryBadge, TagList, RelatedPosts

### admin/
- AdminSidebar, AdminHeader, DataTable, FormDialog, FileUpload, StatusBadge, ImagePicker, ConfirmDialog, AdminShell, StatsOverview

---

*Document Version: 1.0 | Last Updated: 2026-08-04 | Classification: Internal*
