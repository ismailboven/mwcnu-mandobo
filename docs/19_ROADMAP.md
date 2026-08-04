# Roadmap: MWCNU Mandobo Web Platform

---

## 1. Fase & Milestone

| Fase | Fokus | Timeline | Keluar (Deliverable) |
|------|-------|----------|----------------------|
| **F0 — Foundation** | Setup repo, supabase, CI/CD, design system | Minggu 1–2 | Monorepo + deployment pipeline + design tokens |
| **F1 — MVP Core** | Berita, agenda, galeri, download, struktur | Minggu 3–7 | Public website live + CMS dasar |
| **F2 — Konten Lengkap** | Kajian, program, tokoh, timeline, masjid | Minggu 8–10 | Semua modul konten |
| **F3 — Tata Kelola** | RBAC penuh, arsip, activity log, search | Minggu 11–12 | Admin lengkap + search global |
| **F4 — Penguatan** | SEO, performance, aksesibilitas, UAT | Minggu 13–14 | Production launch |
| **v1.1** | Member portal, absensi, surat-menyurat, notifikasi | Q2 2026 | Portal anggota beta |
| **v2.0** | PWA / mobile app, streaming kajian | Q4 2026 | Mobile experience |
| **v2.1** | Keuangan, keanggotaan, donasi | Q1 2027 | Ekosistem keuangan |
| **v3.0** | AI-assisted content, chatbot dakwah | Q3 2027 | AI features |

---

## 2. Sprint Breakdown (MVP 12 Minggu)

### Sprint 1 — Foundation (wk 1–2)
- [ ] Monorepo setup (pnpm + turbo) + CI
- [ ] Supabase project + migrations awal
- [ ] Design tokens + shadcn/ui bootstrap
- [ ] Navbar/Footer/Hero + dark mode
- [ ] Env + deployment preview

### Sprint 2 — Data & Auth (wk 3)
- [ ] Schema lengkap + RLS + seed
- [ ] Auth (login, invite, middleware)
- [ ] RBAC guards
- [ ] Repository pattern skeleton

### Sprint 3 — Berita (wk 4)
- [ ] Kategori + tag + CRUD berita
- [ ] Editor markdown + upload cover
- [ ] Publish/schedule + pinned/featured
- [ ] Halaman list + detail + related

### Sprint 4 — Agenda & Pengumuman (wk 5)
- [ ] CRUD agenda + kalender
- [ ] iCal + tambah ke calendar
- [ ] Pengumuman + badge + expire
- [ ] Banner terjadwal + hero carousel

### Sprint 5 — Galeri & Download (wk 6)
- [ ] Album + media upload + lightbox
- [ ] Download center + dokumen
- [ ] Hit counters + analytics dasar

### Sprint 6 — Struktur & Profil (wk 7)
- [ ] Organization tree (custom component)
- [ ] Pengurus + masa khidmat
- [ ] Lembaga & Banom

### Sprint 7 — Konten Dakwah (wk 8)
- [ ] Kajian multi-format (PDF + audio)
- [ ] Timeline sejarah
- [ ] Tokoh NU

### Sprint 8 — Direktori & Search (wk 9)
- [ ] Direktori masjid + map
- [ ] Pencarian global (full-text + trgm)
- [ ] Program kerja + progress

### Sprint 9 — Admin & Tata Kelola (wk 10)
- [ ] Admin dashboard + overview
- [ ] Activity log
- [ ] Settings + menu + halaman statis
- [ ] Manajemen pengguna & role

### Sprint 10 — QA (wk 11)
- [ ] RLS test suite
- [ ] E2E critical paths
- [ ] Accessibility audit
- [ ] Lighthouse budget

### Sprint 11 — Optimasi (wk 12)
- [ ] Performance pass (bundle, image, cache)
- [ ] SEO audit + Search Console
- [ ] Content seeding (konten awal)
- [ ] UAT + go-live checklist

---

## 3. Backlog Prioritas (v1.0 → v1.1)

| Prioritas | Item | Fase |
|:---------:|------|------|
| P0 | Berita + pinned + featured | MVP |
| P0 | Agenda + kalender | MVP |
| P0 | Galeri album | MVP |
| P0 | Download center | MVP |
| P0 | Struktur interaktif | MVP |
| P0 | Auth + RBAC + RLS | MVP |
| P0 | Dark mode | MVP |
| P1 | Kajian PDF+audio | MVP |
| P1 | Pengumuman + banner | MVP |
| P1 | Search global | MVP |
| P1 | Program kerja | MVP |
| P2 | Timeline, tokoh, masjid | MVP |
| P2 | Activity log | MVP |
| P3 | Member portal beta | v1.1 |
| P3 | Absensi digital | v1.1 |
| P3 | Surat-menyurat | v1.1 |
| P4 | Notifikasi in-app/email | v1.1 |
| P4 | Keuangan & donasi | v2.1 |
| P5 | AI chatbot dakwah | v3.0 |

---

## 4. Definition of Done (per item backlog)

1. Kode selesai + typecheck/lint hijau
2. Migration SQL direview & test RLS lulus
3. E2E/unit test ditulis
4. UI responsif (mobile + desktop) + dark mode
5. Metadata SEO lengkap
6. Documentasi update (component library / AI_CONTEXT bila perlu)
7. PR di-review + merge ke dev

---

## 5. Risiko & Penanganan (per fase)

| Fase | Risiko | Mitigasi |
|------|--------|----------|
| F0 | Setup monorepo lambat | Pakai template starter; spike 1 hari |
| F1 | Editor konten kompleks | Mulai markdown sederhana → rich editor fase 2 |
| F2 | Konten awal tidak tersedia | Seeding konten paralel dengan development |
| F3 | RLS salah konfigurasi | RLS suite dari sprint 1, review keamanan |
| F4 | Launch delay | Feature-freeze minggu 11, prioritaskan P0 |

---

## 6. KPI Peluncuran & Pascalaunch

| Metrik | Target (3 bulan pasca-launch) |
|--------|-------------------------------|
| Monthly unique visitors | 5.000+ |
| Session duration | > 3 menit |
| Download/bulan | 500+ |
| Pengurus aktif (admin) | > 50% |
| Content fresh | < 7 hari |
| Lighthouse (semua) | ≥ 95 |

---

## 7. Keputusan yang Perlu Diambil (Open Decisions)

| # | Keputusan | Opsi | Deadline |
|---|-----------|------|----------|
| 1 | Monorepo vs single app | Monorepo / Single-app | F0 |
| 2 | Nama domain final | `mwcnumandobo.or.id` / lainnya | F0 |
| 3 | Supabase Pro sejak awal? | Free dulu / Pro | F1 |
| 4 | Rich editor (Tiptap) vs Markdown | Markdown dulu / Tiptap | F1 |
| 5 | Auth: perlu Google OAuth? | Ya / Tidak | F1 |
| 6 | Bahasa Inggris? | i18n only struktur / konten 2 bahasa | v2.0 |

---

*Document Version: 1.0 | Last Updated: 2026-08-04 | Classification: Internal*
