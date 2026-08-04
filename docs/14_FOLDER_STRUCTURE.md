# Folder Structure: MWCNU Mandobo Web Platform

---

## 1. Repositori Monorepo (pnpm workspace)

```
mwcnu-mandobo/
├── apps/
│   ├── web/                     # Public website (Next.js)
│   └── admin/                   # Admin dashboard (Next.js, di-phase-1 bersamaan dengan web)
├── packages/
│   ├── ui/                      # Shared UI components (design system)
│   ├── config/                  # ESLint, TS, Prettier, Tailwind presets
│   ├── types/                   # Shared domain types & Supabase generated types
│   ├── utils/                   # cn(), date, slug, formatters
│   └── validations/             # Shared Zod schemas
├── docs/                        # Dokumentasi (dokumen ini)
├── supabase/
│   ├── migrations/              # SQL migrations (urut berdasarkan timestamp)
│   ├── functions/               # Edge Functions
│   ├── seed.sql                 # Data awal (roles, settings, konten contoh)
│   └── config.toml              # Supabase CLI config
├── public/                      # Aset statis (logo, favicon, default images)
├── .github/
│   ├── workflows/               # CI/CD
│   └── pull_request_template.md
├── .husky/                      # Git hooks
├── turbo.json                   # Turborepo config
├── package.json
├── pnpm-workspace.yaml
└── .env.example
```

> Catatan: Jika monorepo terasa berat untuk tim kecil, opsi ringan: **single Next.js app** dengan struktur feature-based (section 3). Keputusan dicatat di README & roadmap.

---

## 2. apps/web (Struktur App Router)

```
apps/web/
├── app/
│   ├── layout.tsx               # Root layout (fonts, providers, header/footer)
│   ├── page.tsx                 # Beranda (Bento Grid)
│   ├── (public)/
│   │   ├── berita/
│   │   │   ├── page.tsx         # Daftar berita + filter
│   │   │   └── [slug]/page.tsx  # Detail berita
│   │   ├── agenda/
│   │   ├── kajian/
│   │   ├── galeri/
│   │   ├── download/
│   │   ├── pengumuman/
│   │   ├── lembaga/
│   │   ├── program-kerja/
│   │   ├── tokoh/
│   │   ├── masjid/
│   │   ├── sejarah/
│   │   ├── tentang/
│   │   │   ├── page.tsx
│   │   │   ├── sejarah/
│   │   │   ├── struktur/
│   │   │   └── pengurus/
│   │   ├── cari/
│   │   └── kontak/
│   ├── (auth)/
│   │   ├── masuk/               # Login
│   │   ├── daftar/
│   │   └── reset-password/
│   ├── admin/                   # Admin (dilindungi middleware)
│   │   ├── layout.tsx           # AdminShell + guard
│   │   ├── dashboard/
│   │   ├── berita/
│   │   ├── agenda/
│   │   ├── galeri/
│   │   ├── download/
│   │   ├── struktur/
│   │   ├── pengurus/
│   │   ├── lembaga/
│   │   ├── program/
│   │   ├── tokoh/
│   │   ├── masjid/
│   │   ├── banner/
│   │   ├── arsip/
│   │   ├── pengguna/
│   │   ├── settings/
│   │   └── activity-log/
│   ├── api/                     # Route handlers (search, upload, ics, webhook)
│   │   ├── search/route.ts
│   │   ├── upload/route.ts
│   │   ├── events/route.ts
│   │   └── webhooks/route.ts
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── manifest.ts
│   └── opengraph-image.tsx      # Default OG image generator
├── components/
│   ├── ui/                      # shadcn/ui (Button, Card, Dialog...)
│   ├── domain/                  # ArticleCard, Hero, Footer...
│   ├── layout/                  # Navbar, Footer, Providers
│   └── shared/                  # EmptyState, SectionHeader...
├── features/
│   ├── articles/
│   │   ├── components/          # ArticleList, ArticleDetail
│   │   ├── queries.ts           # React Query hooks
│   │   ├── actions.ts           # Server Actions
│   │   ├── schemas.ts           # Zod
│   │   └── types.ts
│   ├── events/
│   ├── gallery/
│   ├── documents/
│   ├── structure/
│   ├── sermons/
│   ├── search/
│   └── auth/
├── repositories/                # Data access layer (Supabase)
├── lib/
│   ├── supabase/
│   │   ├── server.ts
│   │   ├── client.ts
│   │   ├── route.ts
│   │   └── admin.ts
│   ├── seo/                     # metadata builders + JSON-LD
│   ├── utils/
│   ├── validations/
│   └── auth.ts
├── types/
│   ├── database.ts              # Generated: supabase gen types
│   └── index.ts
├── hooks/                       # Shared hooks (useDebounce, useMediaQuery...)
├── middleware.ts
├── next.config.ts
├── tsconfig.json
└── vitest.config.ts
```

---

## 3. Single-App Alternative (Tim Kecil)

Jika tidak memakai monorepo:
```
src/
├── app/ (seperti di atas, tanpa packages)
├── components/
├── features/
├── repositories/
├── lib/
├── types/
├── hooks/
├── styles/globals.css
├── middleware.ts
└── next.config.ts
```
Prinsip **feature-based** tetap berlaku: fitur berdiri sendiri (komponen + action + schema + types dalam satu folder fitur).

---

## 4. Konvensi Folder

| Aturan | Contoh |
|--------|--------|
| Folder route: `kebab-case` | `app/(public)/berita` |
| Grup route tanpa segment URL: `(nama)` | `(public)`, `(auth)` |
| Dynamic segment: `[param]` | `[slug]` |
| Layout & template khusus: `layout.tsx`, `template.tsx` |
| Loading/error/not-found: `loading.tsx`, `error.tsx`, `not-found.tsx` |
| 404 global: `app/not-found.tsx` |
| Komponen fitur di `features/<fitur>/components` | — |
| Repository global di `repositories/` | — |

---

## 5. Batasan Impor (Import Boundaries)

```
app/            → boleh import components, features, repositories, lib
features/*      → boleh import components, repositories, lib (TIDAK app/)
repositories/   → boleh import lib, types (TIDAK components, features, app)
lib/            → util & infra murni (TIDAK import features)
packages/*      → stateless, tidak import dari apps
```

> Gunakan ESLint `import/no-restricted-paths` untuk menegakkan batasan ini di CI.

---

## 6. Naming Files

| Type | Contoh |
|------|--------|
| Page | `page.tsx` |
| Layout | `layout.tsx` |
| Component | `article-card.tsx` (export `ArticleCard`) |
| Server Action | `actions.ts` (dalam fitur) |
| Schema | `schemas.ts` |
| Hooks | `use-debounce.ts` (export `useDebounce`) |
| Repository | `article-repository.ts` |
| Types | `types.ts` |
| CSS module | `*.module.css` (hanya jika perlu) |

---

*Document Version: 1.0 | Last Updated: 2026-08-04 | Classification: Internal*
