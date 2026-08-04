# UI/UX Guidelines: MWCNU Mandobo Web Platform

---

## 1. Design Philosophy

> **"Modern Nusantara"** — Bersih, elegan, islami, modern, hangat.
> Bukan Arab, bukan Government, bukan Corporate. Identitas NU + standar estetika produk digital kelas dunia (Apple, Linear, Stripe, Vercel, Notion).

### Prinsip Inti
1. **Content over Chrome** — Konten adalah bintang; UI tidak berteriak.
2. **Bento Grid** — Komposisi modul berbasis grid card, bukan section linear panjang.
3. **Soft & Warm** — Shadow lembut, radius besar, warna hangat, tidak kaku.
4. **Mobile-First** — 375px sebagai baseline; enhancement di desktop.
5. **Meaningful Motion** — Animasi memperjelas, bukan sekadar hiasan.
6. **Inclusive** — WCAG AA, accessible labels, focus visible.
7. **Performance** — Desain tidak pernah mengorbankan kecepatan.

---

## 2. Layout Rules

### 2.1 Bento Grid Home
```
┌──────────────────────────────────────────────┐
│  Navbar                                      │
├──────────────────────────────────────────────┤
│  Hero (Banner)         [1 col x 1 row]       │
├────────────────────────┬─────────────────────┤
│  Berita Utama (large)  │  Agenda (side)      │
├────────────────────────┴─────────────────────┤
│  Profil  │  Pengurus  │  Statistik           │
├────────────────────────┬─────────────────────┤
│  Banom │ Lembaga       │  Kajian             │
├────────────────────────┼─────────────────────┤
│  Galeri                │  Download           │
├────────────────────────┴─────────────────────┤
│  Footer                                      │
└──────────────────────────────────────────────┘
```
- Semua section = **card**; tidak ada strip panjang tanpa batas.
- Card utama (featured) `col-span-2`, card pendukung `col-span-1`.
- Pada mobile semua card menjadi 1 kolom.

### 2.2 Grid Base
| Breakpoint | Container | Columns | Gutter |
|------------|-----------|---------|--------|
| Mobile < 640px | fluid (16px padding) | 4 (tampil 1-2) | 12px |
| sm 640px | max-w-xl | 4 | 16px |
| md 768px | max-w-2xl | 8 | 16px |
| lg 1024px | max-w-4xl | 8 | 24px |
| xl 1280px | max-w-6xl | 12 | 24px |
| 2xl 1536px | max-w-7xl | 12 | 32px |

### 2.3 Whitespace
- Section vertical padding: `py-16` (mobile) → `py-24` (desktop)
- Card internal padding: `p-6` (24px) standar, `p-8` (32px) untuk card hero
- Antar card: `gap-6` (24px)

---

## 3. Typography

| Penggunaan | Font | Size (mobile → desktop) | Weight | Line Height |
|------------|------|-------------------------|--------|-------------|
| Display (Hero) | Plus Jakarta Sans | 36 → 64 | 800 | 1.1 |
| Heading 1 (H1) | Plus Jakarta Sans | 28 → 40 | 700 | 1.2 |
| Heading 2 (H2) | Plus Jakarta Sans | 24 → 32 | 700 | 1.25 |
| Heading 3 (H3) | Plus Jakarta Sans | 20 → 24 | 700 | 1.3 |
| Heading 4 (H4) | Plus Jakarta Sans | 18 → 20 | 600 | 1.35 |
| Body | Inter | 16 | 400/500 | 1.6 |
| Body Small | Inter | 14 | 400 | 1.5 |
| Caption | Inter | 12 | 400/500 | 1.4 |
| Label/Button | Plus Jakarta Sans | 14 | 600 | 1.2 |
| Arabic (opsional) | Amiri | — | — | 1.8 |

### Rules
- Max line length: 65–75 karakter (prose).
- H1 hanya satu per halaman.
- Judul tidak pernah ALL-CAPS kecuali label mikro (badge).
- Gunakan `text-balance` untuk judul (Tailwind v4 / text-wrap).
- Numerik gunakan `tabular-nums` di tabel/statistik.

---

## 4. Color Application

| Elemen | Penggunaan |
|--------|-----------|
| **Primary (#0F6A37)** | Tombol utama, link aktif, navbar, heading aksen |
| **Gold (#C9A227)** | Aksen dekoratif, badge, highlight, divider tipis |
| **Background** | Putih hangat (`#FAFAF9`) / gelap (`#0B0B0C`) |
| **Surface** | Card background (putih / `#121316` dark) |
| **Text** | Near-black (`#101010`) / near-white (`#F4F4F5`) |
| **Muted** | `#71717A` (light) / `#A1A1AA` (dark) |

> Detail token lengkap: **06_DESIGN_SYSTEM.md**

---

## 5. Interaction & States

### 5.1 States (semua komponen interaktif)
1. **Default** — rest state
2. **Hover** — elevation/ink lebih jelas (durasi 150ms)
3. **Active/Pressed** — scale 0.98
4. **Focus** — visible ring `ring-2 ring-primary ring-offset-2` (WAJIB, keyboard)
5. **Disabled** — opacity 50%, cursor not-allowed
6. **Loading** — spinner/skeleton, jangan hilangkan konten (layout shift)

### 5.2 Micro-interaction
- Hover card: shadow meningkat + translateY(2px) + ring subtle
- Button: 150ms ease-out, active scale
- Page transition (server navigasi): fade 200ms
- Hanya gunakan Framer Motion untuk elemen yang benar-benar membutuhkan

### 5.3 Motion Timing
| Nama | Durasi | Easing |
|------|--------|--------|
| `fast` | 150ms | ease-out |
| `base` | 200ms | ease-in-out |
| `slow` | 300ms | cubic-bezier(0.16, 1, 0.3, 1) |
| `enter` | 400ms | spring (motion) |

### 5.4 Respect Reduced Motion
- `prefers-reduced-motion: reduce` → matikan animasi non-esensial.

---

## 6. Accessibility (WCAG AA)

| Area | Standard |
|------|----------|
| Contrast | ≥ 4.5:1 teks normal, ≥ 3:1 teks besar |
| Focus | Selalu terlihat (ring primary) |
| Keyboard | Semua interaktif dapat dicapai tab; Escape menutup dialog/drawer |
| Labels | Setiap input punya `<label>` terhubung |
| Alt text | Semua gambar bermakna punya `alt` deskriptif |
| Landmark | `header`, `nav`, `main`, `footer`, `aside` |
| Heading order | h1 → h2 → h3 tanpa skip level |
| Touch target | Minimum 44x44px |
| ARIA | Hanya jika dibutuhkan; jangan abuse role |
| Live regions | Notifikasi/toast pakai `aria-live="polite"` |

---

## 7. Content & Copy

- Bahasa Indonesia formal namun hangat.
- Gunakan kata "anda" atau "saudara" konsisten.
- Judul halaman: `<title>` + H1 konsisten.
- CTA jelas: "Baca Berita", "Unduh PDF", "Lihat Agenda" — bukan "Klik di sini".
- Tombol verb-first.
- Tanggal format: `Senin, 4 Agustus 2026` (publik), `2026-08-04` (teknis/admin).
- Angka pakai titik ribuan & koma desimal (format Indonesia).

---

## 8. Empty / Error / Loading States

| State | Aturan |
|-------|--------|
| **Loading** | Skeleton shimmer (komponen Skeleton) — bukan spinner penuh untuk konten |
| **Empty** | Ilustrasi ikon + pesan ramah + CTA ("Belum ada berita. Kembali ke Beranda") |
| **Error (API)** | Card error + tombol "Coba Lagi" (retry) |
| **404** | Halaman khusus: "Halaman tidak ditemukan" + link ke Home + pencarian |
| **403** | "Anda tidak memiliki akses" + kontak admin |

---

## 9. Responsive Behavior

| Component | Mobile | Desktop |
|-----------|--------|---------|
| Bento Grid | 1 kolom | 12-col, span sesuai prioritas |
| Navbar | Logo + hamburger + bottom nav | Menu penuh |
| Hero | 1 slide, teks besar | 2 kolom (teks + visual) |
| Cards | 1 col | 2-4 col |
| Data Table (admin) | Card-stack | Tabel penuh |
| Dialog | Full-screen bottom sheet | Centered modal |

---

## 10. Form UX

1. Label selalu di atas field (stacked), bukan placeholder-as-label.
2. Placeholder hanya contoh (`Contoh: 0812xxxx`).
3. Validasi inline real-time setelah blur (React Hook Form + Zod).
4. Error message: singkat, manusiawi, sebut solusi ("Masukkan alamat email yang valid").
5. Submit button disabled saat loading, tampilkan spinner + "Menyimpan...".
6. Field wajib ditandai `*` dan dijelaskan.
7. Autofill & autocapitalize sesuai tipe input (email, tel, url).

---

## 11. Visual Checklist Sebelum "Done"

- [ ] Mobile 375px & desktop 1440px tampil benar
- [ ] Dark mode konsisten
- [ ] Focus ring terlihat di semua interaktif
- [ ] Semua gambar punya alt + ukuran rasio
- [ ] Tidak ada teks yang terpotong/overflow
- [ ] Loading/empty/error state ada
- [ ] Lighthouse A11y ≥ 95
- [ ] Navigasi keyboard lengkap tanpa mouse

---

*Document Version: 1.0 | Last Updated: 2026-08-04 | Classification: Internal*
