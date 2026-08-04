# Product Requirements Document (PRD): MWCNU Mandobo Web Platform v1.0

---

## 1. Ringkasan Produk

| Field | Value |
|-------|-------|
| **Nama Produk** | MWCNU Mandobo Web Platform |
| **Versi** | 1.0 (MVP) |
| **Jenis** | Digital Platform organisasi (Company Profile + CMS + Arsip + Direktori) |
| **Pengguna Utama** | Pengurus, anggota/jamaah NU Mandobo, publik |
| **Platform** | Web (Mobile-first, Desktop-enhanced) |
| **Bahasa** | Bahasa Indonesia (v1.0) — arsitektur siap i18n |

---

## 2. Tujuan Produk

### 2.1 Goals Bisnis
1. Menyediakan sumber informasi resmi & terpercaya MWCNU Mandobo.
2. Membangun arsip digital terpusat (keputusan, notulen, dokumen hukum).
3. Meningkatkan transparansi dan tata kelola organisasi.
4. Mendukung dakwah modern & regenerasi kader.

### 2.2 Goals Teknis
1. Lighthouse Performance/Accessibility/SEO ≥ 95.
2. Server Components-first, time-to-interactive < 3s.
3. Arsitektur AI-Ready & mudah dirawat (Clean Architecture + Repository Pattern).

### 2.3 Non-Goals (v1.0)
- Mobile app native
- Member portal dengan dashboard pengurus
- Keuangan/keanggotaan/donasi
- Live streaming
- Multi-bahasa konten aktif

---

## 3. User Stories & Acceptance Criteria

> Format: `Sebagai [role], saya ingin [fitur], agar [benefit].`

### 3.1 Manajemen Konten
| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-001 | Sebagai **Editor**, saya ingin membuat berita dengan WYSIWYG/Markdown, agar berita tampil profesional | - Bisa membuat/edits/hapus berita<br>- Draft/publish/schedule<br>- Upload cover image (next/image optimized)<br>- Pilih kategori & tag |
| US-002 | Sebagai **Editor**, saya ingin menyematkan berita (pinned), agar berita penting tampil di Hero | - Maks 1-3 pinned active<br>- Sorting manual via drag/drop |
| US-003 | Sebagai **Editor**, saya ingin membuat pengumuman terpisah dari berita, agar info penting tidak tenggelam | - Tipe: info/sararan/himbauan<br>- Expired date otomatis<br>- Badge visual berbeda |
| US-004 | Sebagai **Admin**, saya ingin mengelola agenda/kalender, agar kegiatan tidak bentrok | - CRUD agenda + lokasi + waktu<br>- Export iCal<br>- Sinkron tampilan kalender |

### 3.2 Arsip & Download
| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-005 | Sebagai **Admin**, saya ingin mengunggah SK/Surat/Notulen, agar arsip terpusat | - Upload PDF, otomatis OCR searchable (fase 2)<br>- Metadata: nomor, tanggal, perihal, terkait pengurus/agenda<br>- RLS hanya pengurus yang bisa akses dokumen internal |
| US-006 | Sebagai **Publik**, saya ingin mengunduh dokumen publik (khutbah, panduan), agar dapat diakses tanpa login | - Download dengan hit counter<br>- File versioning |

### 3.3 Struktur & Profil
| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-007 | Sebagai **Admin**, saya ingin mengelola struktur organisasi interaktif, agar regenerasi mudah dipahami | - Tree navigable, klik node → detail pengurus<br>- Masa khidmat (periode, status aktif)<br>- Multi-level: MWCNU → Lembaga → Banom |
| US-008 | Sebagai **Admin**, saya ingin mengelola profil pengurus, agar informasi lengkap | - Nama, jabatan, periode, biografi, foto, kontak |
| US-009 | Sebagai **Admin**, saya ingin mengelola Lembaga & Banom, agar representasi organisasi akurat | - Kategori: Lembaga (LP Ma'arif, RMI, LTMNU, dll) & Banom (GP Ansor, IPNU, IPPNU, Fatayat, dll) |

### 3.4 Konten Dakwah
| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-010 | Sebagai **Editor**, saya ingin membuat konten kajian multi-format, agar dakwah menjangkau semua kalangan | - Satu entitas kajian: PDF + Audio + Video<br>- Playlist & progress tracking |
| US-011 | Sebagai **Admin**, saya ingin mengelola timeline sejarah organisasi, agar sejarah terdokumentasi | - Timeline dengan tahun, peristiwa, foto |
| US-012 | Sebagai **Admin**, saya ingin mengelola biografi tokoh NU lokal, agar kader mengenal tokoh | - Biografi, kontribusi, foto |

### 3.5 Direktori & Navigasi
| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-013 | Sebagai **Admin**, saya ingin mengelola direktori masjid, agar jamaah mudah menemukan lokasi | - Nama, alamat, pengurus, koordinat map |
| US-014 | Sebagai **Publik**, saya ingin pencarian global yang cepat, agar mudah menemukan konten | - Full-text search (Postgres + trigram)<br>- Filter: berita/kajian/dokumen/pengurus<br>- Result dalam < 200ms |

### 3.6 Sistem & Tata Kelola
| ID | User Story | Acceptance Criteria |
|----|-----------|---------------------|
| US-015 | Sebagai **Admin**, saya ingin mengelola banner kegiatan terjadwal, agar kampanye otomatis | - Banner + start/end date + link target<br>- Rotasi otomatis |
| US-016 | Sebagai **Admin**, saya ingin dark mode default dari awal, agar aksesibilitas nyaman | - System preference + manual toggle<br>- Persist di cookie/localStorage |
| US-017 | Sebagai **Admin**, saya ingin melihat activity log, agar audit trail jelas | - Log action + actor + timestamp<br>- Filter berdasarkan tipe |

---

## 4. Fitur Detail (Functional Requirements)

### 4.1 Modul Berita
- **Kategori**: Hierarki 2 level (misal: `Kegiatan` → `Kegiatan Santri`)
- **Tag**: Multi-tag, filterable
- **Status**: `draft` / `published` / `scheduled` / `archived`
- **Konten**: Markdown + optional embed (YouTube)
- **SEO**: slug, meta description, OG image, JSON-LD `Article`
- **Featured**: `is_featured`, `is_pinned`, max 3 pinned
- **Slug Unik**: auto-generate dari judul, editable, immutable setelah publish

### 4.2 Modul Agenda/Events
- Field: judul, deskripsi, tanggal mulai/akhir, waktu, lokasi, tipe (kajian/rapat/peringatan), pengurus PIC, lampiran
- Status: `upcoming` / `ongoing` / `completed` / `cancelled` (di-compute)
- Export iCal (`.ics`)
- Integrasi "Tambah ke Google Calendar" link

### 4.3 Modul Galeri
- Album → Media (foto/video)
- Foto: multiple upload, auto-thumbnail, EXIF tanggal opsional
- Video: embed (YouTube) atau file upload (storage)
- Lightbox viewer dengan keyboard navigation

### 4.4 Modul Download Center
- Kategori dokumen: Khutbah, Panduan, Formulir, AD/ART, SK, Surat, Notulen, Laporan
- File di Supabase Storage dengan folder terstruktur
- Metadata: nomor dokumen, tanggal, perihal, visibility (`public`/`internal`)
- Hit counter + recent downloads widget

### 4.5 Modul Struktur Organisasi
- Tree: `MWCNU` root → Level pengurus → Lembaga → Banom
- Node properties: posisi/jabatan, nama pengurus, periode (mulai-akhir), status, kontak
- Interaksi: klik node → panel detail; expand/collapse; search pengurus
- Render: custom Tree component (bukan gambar)

### 4.6 Modul Program Kerja
- Grup per bidang (Bidang Dakwah, Pendidikan, Sosial, Hukum, dll)
- Item: nama program, deskripsi, target, status (`planned`/`active`/`done`), progress %
- Progres bar + timeline

### 4.7 Modul Timeline Sejarah
- Item: tahun (range opsional), judul peristiwa, deskripsi, media
- Sorted ascending; 2 kolom (kiri/kanan) di desktop, single column di mobile

### 4.8 Modul Tokoh
- Field: nama, gelar, kelahiran/wafat, jabatan historis, kontribusi, foto, quotes
- Kategori: Ulama, Akademisi, Pejabat, Aktivis

### 4.9 Modul Direktori Masjid
- Field: nama, alamat, kecamatan/desa, koordinat (lat/lng), imam/khatib, kontak, kapasitas
- Map embed (Leaflet/MapLibre — open source, tanpa tracking)

### 4.10 Modul Kajian/Khutbah
- Satu entitas = judul + ringkasan + format:
  - PDF (link storage)
  - Audio (MP3 streaming, progress)
  - Video (embed/file)
- Playlist per seri kajian (opsional)
- Like/share counter

### 4.11 Modul Banner
- CRUD banner: gambar, judul opsional, subtitle opsional, link target, `start_at`, `end_at`, `is_active`
- Rotasi otomatis (interval), auto-hide setelah end_at
- Posisi: Hero carousel + inline banner

### 4.12 Modul Pengumuman
- Tipe: `info` / `himbauan` / `peringatan`
- Badge warna berbeda per tipe
- Expired otomatis (`expires_at`); tampil dengan countdown

### 4.13 Pencarian Global
- Trigger: navbar search + `/cari?q=...`
- Sumber: articles, events, downloads, leaders, kajian, tokoh
- Postgres full-text search + pg_trgm untuk fuzzy
- Highlight snippet + filter tab per tipe konten

### 4.14 Modul Pengguna & Admin
- Auth: email + password, magic link, OAuth Google (opsional)
- Profil pengguna, avatar, ubah password
- Notifikasi in-app (untuk admin: approval content, dll — fase 1.1)

---

## 5. Non-Functional Requirements

| Kategori | Requirement | Standar |
|----------|-------------|---------|
| **Performance** | LCP, CLS, INP | < 2.5s, < 0.1, < 200ms |
| **Performance** | Lighthouse | ≥ 95 (Performance, A11y, SEO) |
| **Availability** | Uptime | 99.9% |
| **Security** | RLS aktif di semua tabel publik-readable | Semua query lewat RLS |
| **Security** | Rate limiting | Auth & search endpoint |
| **Accessibility** | WCAG | AA |
| **SEO** | Sitemap, robots, structured data | Semua halaman publik |
| **Privacy** | No third-party tracker | Kecuali Vercel Analytics (first-party) |
| **Compliance** | Data | PDP (UU 27/2022), region SG |

---

## 6. MVP Priority (MoSCoW)

### Must Have (v1.0)
- Berita + Kategori + Pinned
- Agenda & Kalender
- Galeri (album)
- Download center
- Struktur organisasi interaktif
- Profil pengurus + masa khidmat
- Lembaga & Banom
- Pengumuman
- Banner terjadwal
- Dark mode
- Auth + RBAC + RLS
- SEO + Sitemap + JSON-LD
- Pencarian global
- Responsive mobile-first

### Should Have (v1.0)
- Program kerja per bidang
- Timeline sejarah
- Tokoh NU lokal
- Kajian multi-format (PDF + Audio)
- Activity log
- Statistik konten sederhana

### Could Have (v1.0)
- Direktori masjid + map
- Kajian video + playlist
- iCal export
- Like/share counter

### Won't Have (v1.0)
- Member portal, keuangan, donasi, chatbot, live streaming

---

## 7. Alur Kerja (User Flow Utama)

### 7.1 Publik → Membaca Berita
```
Home → Daftar Berita → Buka Artikel → Baca → Share/Download → Artikel Terkait
```

### 7.2 Publik → Cari Konten
```
Navbar 🔍 → Ketik keyword → Result dengan filter → Klik → Halaman detail
```

### 7.3 Admin → Publish Berita
```
Login → Dashboard → Berita → Buat Baru → Isi (WYSIWYG) → Upload cover → Preview → Publish/Schedule
```

### 7.4 Admin → Kelola Struktur
```
Login → Dashboard → Struktur → Tambah Node → Pilih Parent → Input jabatan/pengurus → Simpan
```

---

## 8. Data Model Ringkas (referensi detail di 08_DATABASE_DESIGN.md)

| Entity | Tujuan |
|--------|--------|
| `users` | Profil + auth (Supabase Auth) |
| `roles` / `user_roles` | RBAC |
| `articles`, `categories`, `tags` | Berita |
| `events` | Agenda |
| `announcements` | Pengumuman |
| `downloads`, `documents` | Arsip |
| `galleries`, `albums`, `media` | Galeri |
| `leaders`, `departments`, `institutions`, `banoms` | Struktur |
| `programs`, `program_items` | Program kerja |
| `timeline_events` | Sejarah |
| `figures` | Tokoh |
| `mosques` | Direktori masjid |
| `sermons` | Kajian/Khutbah |
| `banners` | Banner |
| `settings`, `menus`, `pages` | Sistem |
| `activity_logs` | Audit |

---

## 9. Asumsi & Pembuka

- Tim akses GitHub Organization.
- Supabase project dibuat sprint 1, region **Singapore**.
- Domain `mwcnumandobo.or.id` (target).
- Konten awal siap migrasi dari media sosial & dokumen fisik.

---

*Document Version: 1.0 | Last Updated: 2026-08-04 | Classification: Internal*
