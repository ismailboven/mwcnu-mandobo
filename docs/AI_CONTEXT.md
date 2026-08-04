# AI_CONTEXT.md — Operating Manual untuk Semua AI Assistant

> ⭐⭐⭐ **WAJIB BACA SEBELUM MENULIS KODE APA PUN.**
> Dokumen ini adalah "otak" proyek MWCNU Mandobo Web Platform.
> Setiap AI (Claude Code, Codex, Gemini CLI, Cursor, Windsurf, opencode, dsb.) wajib membaca file ini dan mengikuti semua aturan di dalamnya.

---

## 1. Identitas & Peran

Anda adalah **Senior Software Engineer** yang sedang membangun website resmi **MWCNU Mandobo** (Majelis Wakil Cabang Nahdlatul Ulama Distrik Mandobo) — platform digital organisasi.

- **Nama Proyek**: MWCNU Mandobo Web Platform v1.0
- **Organisasi**: Nahdlatul Ulama, Distrik Mandobo, Kabupaten Boven Digoel, Papua Selatan
- **Visi Produk**: *"Modern Nusantara"* — bersih, elegan, islami, modern, hangat. Bukan gaya Arab, bukan gaya pemerintahan, bukan gaya korporat kaku.
- **Bahasa komunikasi**: Indonesia (desain & konten). Kode: identifier bahasa Inggris.

---

## 2. Stack Teknologi (JANGAN DIUBAH tanpa persetujuan)

| Layer | Teknologi |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **React** | React 19 |
| **Bahasa** | TypeScript (strict, tanpa `any`) |
| **Styling** | Tailwind CSS v4 + design tokens |
| **UI Primitives** | shadcn/ui (Radix UI) |
| **Icons** | Lucide |
| **Animasi** | Framer Motion |
| **Form** | React Hook Form + Zod |
| **Data fetching client** | TanStack Query |
| **Database/Backend** | Supabase (PostgreSQL, Auth, Storage, Realtime, Edge Functions) |
| **Keamanan data** | Row Level Security (RLS) — WAJIB |
| **Deploy** | Vercel |
| **CI/CD** | GitHub Actions |
| **Testing** | Vitest + Playwright |
| **Monitoring** | Vercel Analytics, Speed Insights, Sentry |

**Package manager**: pnpm. **Node**: ≥ 22.

---

## 3. Arsitektur (Wajib Diikuti)

```
Presentation (UI)
    ↓
Features (domain logic, per-modul)
    ↓
Services (use cases, Server Actions)
    ↓
Repository (data access → Supabase)
    ↓
Infra (Supabase: DB, Storage, Auth, Realtime)
```

### Aturan arsitektur
1. **Server Components first** — default semua halaman Server Component.
2. **`"use client"`** hanya untuk komponen yang butuh state/event/hooks interaktif.
3. **Tidak pernah** query Supabase langsung di component.
4. **Selalu** lewat Repository Pattern → Service → Component.
5. **Mutations**: Server Actions sebagai default (bukan API Routes).
6. **Tidak ada Redux** — gunakan TanStack Query + state lokal.
7. **Zod** validasi di lapisan service (bukan hanya di form).
8. **Server-only** untuk kode sensitive (env, service role) — package `server-only`.

---

## 4. Design System (WAJIB — JANGAN PERNAH MENGUBAH)

> Sumber lengkap: `docs/06_DESIGN_SYSTEM.md`

### 4.1 Warna
| Token | Light | Dark |
|-------|-------|------|
| **Primary (Hijau NU)** | `#0F6A37` | `#2E9E5E` |
| **Secondary (Gold)** | `#C9A227` | `#E0B93F` |
| Background | `#FAFAF9` | `#0B0B0C` |
| Foreground | `#101010` | `#F4F4F5` |
| Card | `#FFFFFF` | `#121316` |
| Muted | `#71717A` | `#A1A1AA` |

### 4.2 Typography
- Display/Heading: **Plus Jakarta Sans** (700–800)
- Body: **Inter** (400–600)
- Di-load via `next/font/google` (self-hosted, swap)

### 4.3 Radius
- Button/Input: `12px` (`rounded-lg`)
- Card: `20px` (`rounded-2xl`)
- Dialog/Hero: `24px` (`rounded-3xl`)
- Avatar: `full`

### 4.4 Shadow
- Default card: `shadow-soft` + `ring-1 ring-border`
- Hover card: `shadow-medium`
- Dialog/overlay: `shadow-floating`

### 4.5 Spacing & Motion
- Gunakan skala spacing default Tailwind (4/8/12/16/24/32/48/64/96)
- Durasi: 150ms (fast) / 200ms (base) / 300ms (slow)

### 4.6 Layout
- **Bento Grid** untuk halaman utama — komposisi card, bukan section linear.
- Mobile-first. Breakpoint: 640/768/1024/1280/1536.
- Whitespace generous, content-first.

---

## 5. Komponen (Reuse Sebelum Rebuild)

> Daftar lengkap: `docs/07_COMPONENT_LIBRARY.md`

**Aturan:**
1. Periksa komponen existing **sebelum** membuat komponen baru.
2. Komponen dasar (Button, Card, Input, Dialog, dsb.) dari **shadcn/ui** — jangan fork.
3. Semua komponen domain menerima data via props (bukan query langsung).
4. Nama komponen: **PascalCase**. File: `kebab-case.tsx`.
5. Ikon: **Lucide** saja.
6. Komponen baru wajib didokumentasikan di `docs/07_COMPONENT_LIBRARY.md`.

---

## 6. Aturan Coding (Non-Negotiable)

| Aturan | Detail |
|--------|--------|
| TypeScript strict | `noUncheckedIndexedAccess`, tanpa `any` |
| Naming | Component `PascalCase`, variable `camelCase`, folder `kebab-case` |
| Folder | Feature-based: `features/<fitur>/components|actions|schemas|types` |
| Styling | Tailwind only — **tanpa inline style** |
| Semantik | `<article>`, `<nav>`, `<time>`, `<address>` dsb. |
| Aksesibilitas | WCAG AA — fokus visible, label, alt, touch 44px |
| SEO | Setiap page publik punya `metadata` / `generateMetadata` |
| Gambar | `next/image` + `sizes` + `alt` (jangan `<img>`) |
| Reusable | Jangan duplikasi kode |
| Responsive | Mobile-first, selalu |
| Error | Jangan expose internal; map ke `{ ok: false, code }` |
| Secret | Tidak pernah commit secret/env |

---

## 7. Database & RLS (Wajib)

> Sumber lengkap: `docs/08_DATABASE_DESIGN.md`, `docs/12_ROLE_PERMISSION.md`

1. Setiap perubahan skema = **migration SQL** di `supabase/migrations/`.
2. Setiap tabel punya **TypeScript type** (dari `supabase gen types`).
3. Semua tabel: `id uuid`, `created_at`, `updated_at`.
4. Trigger `set_updated_at()` di tabel ber-`updated_at`.
5. **RLS aktif** di semua tabel. Policy per-tabel terdefinisi.
6. Soft delete (`deleted_at`) untuk konten.
7. Index untuk kolom filter/sort.
8. Enum via PostgreSQL `create type` (bukan string bebas).

### Roles (hierarki)
`viewer (1)` < `editor (2)` < `admin (3)` < `super_admin (4)`

---

## 8. Pola Jawaban Saat Diminta Fitur Baru

Ketika diminta membuat fitur baru, ikuti alur berikut:

### Step 1 — Baca & Pahami
1. Baca `docs/AI_CONTEXT.md` (file ini).
2. Baca dokumen terkait: `02_PRD.md`, `04_INFORMATION_ARCHITECTURE.md`, `06_DESIGN_SYSTEM.md`, `07_COMPONENT_LIBRARY.md`, `08_DATABASE_DESIGN.md`, `10_API_SPECIFICATION.md`.
3. Cek komponen & repository yang sudah ada.

### Step 2 — Rencana (jika kompleks)
1. Jelaskan singkat pendekatan: schema → repository → service/action → UI.
2. Identifikasi RLS policies yang dibutuhkan.
3. Sebutkan komponen yang akan dipakai ulang.

### Step 3 — Implementasi
- Ikuti arsitektur berlapis.
- Server Component dulu; client hanya jika perlu.
- Zod di service; `revalidate` setelah mutasi.
- Mobile-first + dark mode + aksesibilitas.

### Step 4 — Verifikasi
- Jalankan: `pnpm lint`, `pnpm typecheck`, `pnpm test` (jika ada test terkait).
- Pastikan RLS policy benar.
- Pastikan metadata SEO ada.

### Step 5 — Ringkas
- Laporkan file yang diubah + cara verifikasi, singkat.

---

## 9. Anti-Pattern (DILARANG)

- ❌ Query Supabase di component.
- ❌ `service_role` di client/browser.
- ❌ `any` / `as any`.
- ❌ Redux.
- ❌ `useEffect` untuk fetching data.
- ❌ Inline style `style={{}}`.
- ❌ Komponen baru tanpa cek existing.
- ❌ Hardcode warna/radius (wajib token).
- ❌ Menonaktifkan RLS.
- ❌ API Route untuk mutasi yang bisa Server Action.
- ❌ `<img>` manual (pakai `next/image`).
- ❌ Emoji sebagai ikon UI.
- ❌ Skema DB tanpa migration.
- ❌ Skip error handling.
- ❌ Bypass Zod di server.

---

## 10. Konvensi Commit

```
<type>(<scope>): <subject>

contoh: feat(article): tambah pinned news
        fix(search): handle query kosong
        docs(database): update RLS policy
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

**Branch**: `feature/`, `fix/`, `chore/`. Target PR: `dev`. Merge `dev → main` = production.

---

## 11. Struktur Folder Singkat

```
mwcnu-mandobo/
├── apps/web/          # Public website (Next.js)
├── apps/admin/        # Admin dashboard (Next.js)
├── packages/          # ui, config, types, utils, validations
├── docs/              # Dokumentasi (file ini ada di sini)
├── supabase/          # migrations, functions, seed
├── public/            # aset statis
└── .github/           # workflows CI/CD
```

Detail: `docs/14_FOLDER_STRUCTURE.md`

---

## 12. Referensi Cepat Antar Dokumen

| Kebutuhan | Baca |
|-----------|------|
| Visi & misi | `01_PRODUCT_VISION.md` |
| Kebutuhan fitur (PRD) | `02_PRD.md` |
| Personas | `03_USER_PERSONAS.md` |
| Navigasi & URL | `04_INFORMATION_ARCHITECTURE.md` |
| Prinsip UI/UX | `05_UI_UX_GUIDELINES.md` |
| Token desain | `06_DESIGN_SYSTEM.md` |
| Daftar komponen | `07_COMPONENT_LIBRARY.md` |
| Skema database | `08_DATABASE_DESIGN.md` |
| Arsitektur backend | `09_BACKEND_ARCHITECTURE.md` |
| Kontrak API/actions | `10_API_SPECIFICATION.md` |
| Autentikasi | `11_AUTHENTICATION.md` |
| Role & RLS | `12_ROLE_PERMISSION.md` |
| Aturan develop | `13_DEVELOPMENT_GUIDELINES.md` |
| Struktur folder | `14_FOLDER_STRUCTURE.md` |
| Deployment | `15_DEPLOYMENT.md` |
| Testing | `16_TESTING_GUIDELINES.md` |
| SEO | `17_SEO_GUIDELINES.md` |
| Performance | `18_PERFORMANCE.md` |
| Roadmap | `19_ROADMAP.md` |

---

## 13. Checklist Sebelum Selesai (Selalu)

- [ ] `pnpm lint` & `pnpm typecheck` hijau
- [ ] Tidak ada `any`
- [ ] RLS & auth guard benar
- [ ] Responsive (375px & 1440px) + dark mode
- [ ] Aksesibilitas (focus, label, alt, kontras)
- [ ] Metadata SEO lengkap (halaman publik)
- [ ] Menggunakan komponen existing / didokumentasikan
- [ ] Tidak ada secret
- [ ] Commit mengikuti convention

---

*Versi: 1.0 | Terakhir diperbarui: 2026-08-04 | Klasifikasi: Internal*
