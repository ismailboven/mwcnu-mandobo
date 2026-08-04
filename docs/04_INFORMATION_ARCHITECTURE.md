# Information Architecture (IA): MWCNU Mandobo Web Platform

---

## 1. Prinsip IA

1. **Satu tingkat lebih dalam dari Home** — mayoritas konten bisa diakses maksimal 3 klik dari halaman mana pun.
2. **Label bahasa Indonesia yang jelas** — tanpa jargon teknis.
3. **Konsisten** — pola URL, navigasi, dan penamaan seragam di semua modul.
4. **SEO-friendly** — hierarki mencerminkan pentingnya konten; slug deskriptif.
5. **Evolusi** — struktur siap menampung member portal (fase 2) tanpa rombak besar.

---

## 2. Sitemap Publik

```
/ (Beranda)
├── /tentang
│   ├── /tentang/sejarah
│   ├── /tentang/visi-misi
│   ├── /tentang/struktur
│   └── /tentang/pengurus
├── /berita
│   ├── /berita (index + filter kategori)
│   └── /berita/[slug] (detail)
├── /agenda
│   └── /agenda/[slug]
├── /kajian
│   ├── /kajian (index)
│   └── /kajian/[slug]
├── /galeri
│   ├── /galeri (album list)
│   └── /galeri/[slug] (album detail)
├── /download
│   └── /download/[slug]
├── /pengumuman
├── /lembaga (Lembaga & Banom)
├── /program-kerja
├── /masjid (Direktori)
├── /tokoh
├── /sejarah (Timeline)
├── /cari?q=[keyword]
└── /kontak
```

### Admin (subdomain atau `/admin`)
```
/admin
├── /admin/dashboard
├── /admin/berita
├── /admin/agenda
├── /admin/kajian
├── /admin/galeri
├── /admin/download
├── /admin/pengumuman
├── /admin/struktur
├── /admin/pengurus
├── /admin/lembaga
├── /admin/program
├── /admin/tokoh
├── /admin/masjid
├── /admin/banner
├── /admin/arsip
├── /admin/pengguna
├── /admin/settings
└── /admin/activity-log
```

---

## 3. Struktur Navigasi

### 3.1 Navigasi Utama (Navbar Desktop)
```
[Logo MWCNU]  Tentang ▾  Berita  Agenda  Kajian  Galeri  Download  Lembaga ▾  [🔍] [Kontak]
```
- Dropdown "Tentang": Sejarah, Visi & Misi, Struktur, Pengurus
- Dropdown "Lembaga": daftar Lembaga & Banom
- Search icon → expandable input atau halaman `/cari`

### 3.2 Navigasi Mobile (Bottom Nav + Hamburger)
- Bottom navigation (4 utama): Beranda, Berita, Agenda, Lainnya
- "Lainnya" → drawer berisi sisa menu

### 3.3 Footer Navigation
- Kolom 1: Tentang (sejarah, visi-misi, struktur, pengurus)
- Kolom 2: Konten (berita, agenda, kajian, galeri, download)
- Kolom 3: Organisasi (lembaga, banom, program kerja, tokoh, masjid)
- Kolom 4: Kontak (alamat, email, telp, medsos) + newsletter opsional

### 3.4 Breadcrumb
- Pola: `Home / Berita / [Judul]`
- Khusus halaman detail; tidak untuk Home

---

## 4. URL Convention

| Rule | Contoh |
|------|--------|
| `kebab-case` | `/berita/latihan-dasar-kepemimpinan` |
| Tanpa ekstensi | `/tentang/struktur` (bukan `.html`) |
| Lowercase | `/Kajian` ❌ → `/kajian` ✅ |
| Singular untuk detail | `/berita/[slug]` |
| Query hanya untuk filter | `/cari?q=...` `/berita?kategori=pendidikan` |
| Hindari tanggal di URL | `/berita/[slug]` bukan `/berita/2026/08/x` |
| Trailing slash | Konsisten tanpa trailing slash |

### Slug Rules
- Auto-generate dari judul saat publish
- Immutable setelah publish (untuk stabilitas SEO)
- Max 80 karakter
- Hapus stopword (di, ke, yang, dan)

---

## 5. Content Model & Hubungan

```
                    ┌──────────────┐
                    │   categories │
                    └──────┬───────┘
                           │ 1:N
                    ┌──────▼───────┐        ┌────────┐
  ┌────────────────►│   articles   │◄───────│  tags  │
  │                 └──────────────┘        └────────┘
  │                 ┌──────────────┐
  │                 │    events    │
  │                 └──────────────┘
  │                 ┌──────────────┐
  │                 │ announcements│
  │                 └──────────────┘
  │                 ┌──────────────┐
  │                 │  downloads   │─────► documents (file)
  │                 └──────────────┘
  │                 ┌──────────────┐
  │                 │   sermons    │─────► media (audio/video/pdf)
  │                 └──────────────┘
  │                 ┌──────────────┐
  │                 │  galleries   │─────► albums ───► media
  │                 └──────────────┘
  │                 ┌──────────────┐
  │                 │   banners    │
  │                 └──────────────┘
  │                 ┌──────────────┐
  │                 │    leaders   │─────► departments / institutions / banoms
  │                 └──────────────┘
  │                 ┌──────────────┐
  │                 │ timeline_event│
  │                 └──────────────┘
  │                 ┌──────────────┐
  │                 │   figures    │
  │                 └──────────────┘
  │                 ┌──────────────┐
  │                 │   mosques    │
  │                 └──────────────┘
  │                 ┌──────────────┐
  │                 │  programs    │─────► program_items
  │                 └──────────────┘
  │                 ┌──────────────┐
  │                 │   settings   │◄── global config (nav, hero, kontak)
  │                 └──────────────┘
```

**Prinsip**: Content adalah entitas **top-level**. Kategori bukan hierarki URL (pakai query/filter), karena organisasi NU sering menempatkan satu berita di beberapa kategori konteks.

---

## 6. Kartu/Labelling Bahasa Indonesia (Konsisten)

| Konsep | Label Publik | Label Admin |
|--------|-------------|-------------|
| Article | Berita | Berita |
| Event | Agenda | Agenda/Kegiatan |
| Announcement | Pengumuman | Pengumuman |
| Download | Unduhan | Download Center |
| Sermon/Kajian | Kajian | Kajian & Khutbah |
| Gallery | Galeri | Galeri |
| Structure | Struktur | Struktur Organisasi |
| Leader | Pengurus | Pengurus |
| Institution/Banom | Lembaga | Lembaga & Banom |
| Program | Program Kerja | Program Kerja |
| Figure | Tokoh | Tokoh |
| Mosque | Masjid | Direktori Masjid |

---

## 7. Navigasi Fase 2 (Member Portal) — Antisipasi

```
/member
├── /member/dashboard
├── /member/agenda-saya
├── /member/arsip
├── /member/profil
└── /member/absensi
```
> Diperkenalkan di v1.1 tanpa mengubah navigasi publik.

---

## 8. Alur User Critical Paths

| Task | Path (klik) |
|------|-------------|
| Baca berita terbaru | Home → Berita → Artikel |
| Cek jadwal kajian | Home → Agenda → Detail kajian |
| Unduh khutbah | Home → Kajian → Detail → Download PDF |
| Lihat siapa ketua | Home → Tentang → Struktur |
| Cari pengurus | Home → 🔍 → "ketua" → Profil pengurus |
| Cek pengumuman | Home → Pengumuman |

---

*Document Version: 1.0 | Last Updated: 2026-08-04 | Classification: Internal*
