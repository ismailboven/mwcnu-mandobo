# Development Guidelines: MWCNU Mandobo Web Platform

> Aturan wajib yang dipatuhi seluruh developer & AI assistant di repositori ini.

---

## 1. Lingkungan & Tooling

| Tool | Versi/Config |
|------|--------------|
| Node.js | ≥ 22 (rekomendasi LTS 24) |
| Package manager | **pnpm** (monorepo) |
| Language | TypeScript (strict) |
| Linter | ESLint (flat config) + `eslint-plugin-tailwindcss` |
| Formatter | Prettier |
| Git hooks | Husky + lint-staged |
| Test | Vitest (unit) + Playwright (e2e) |

### Script Standar
```bash
pnpm dev          # dev server
pnpm build        # production build (typecheck + lint + build)
pnpm lint         # eslint
pnpm typecheck    # tsc --noEmit
pnpm format       # prettier
pnpm test         # vitest run
pnpm test:e2e     # playwright
pnpm db:reset     # supabase reset (local)
```

---

## 2. TypeScript Strict

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "verbatimModuleSyntax": true,
    "moduleResolution": "bundler",
    "target": "ES2022"
  }
}
```

**Aturan:**
- ❌ `any` — dilarang. Gunakan `unknown` + narrow, atau generic.
- ✅ Semua function punya return type eksplisit (di publik API).
- ✅ Akses array gunakan `noUncheckedIndexedAccess` guard.

---

## 3. Naming Convention

| Item | Convention | Contoh |
|------|-----------|--------|
| Component file | `kebab-case.tsx` | `article-card.tsx` |
| Component name | `PascalCase` | `ArticleCard` |
| Variable/function | `camelCase` | `getArticles` |
| Constant | `UPPER_SNAKE_CASE` | `MAX_PINNED` |
| Type/Interface | `PascalCase` | `ArticleCardProps` |
| Folder (feature) | `kebab-case` | `src/features/article-posts/` |
| DB table | `snake_case` (jamak) | `articles` |
| DB column | `snake_case` | `cover_image_url` |
| Slug/URL | `kebab-case` | `/berita/...` |
| CSS class | Tailwind (tidak custom kecuali perlu) | — |
| Git branch | `feature/`, `fix/`, `chore/` | `feature/article-pinned` |
| Commit | Conventional | `feat: ...` |

---

## 4. Git Workflow

### 4.1 Branching (GitHub Flow ringan)
```
main (production)
  └── dev (staging)            ← PR merge ke sini
        └── feature/xxx        ← PR dari feature ke dev
        └── fix/xxx
```

### 4.2 Commit Convention (Conventional Commits)
```
<type>(<scope>): <subject>

feat(article): add pinned feature
fix(search): handle empty query
docs(database): add RLS policies
refactor(auth): extract requireLevel helper
chore(deps): upgrade next
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

### 4.3 PR Checklist
- [ ] Branch dari `dev`, target `dev`
- [ ] Tipe commit benar, subject ≤ 50 char
- [ ] Typecheck + lint + test hijau
- [ ] Screenshot (mobile + desktop) untuk perubahan UI
- [ ] Migration SQL sudah direview (jika ada)
- [ ] Update docs yang terdampak (AI_CONTEXT, component library, dsb.)

---

## 5. Coding Rules

### 5.1 Umum
- ✅ Reusable component; **jangan duplikasi**.
- ✅ Semantik HTML (`<article>`, `<nav>`, `<time>`, dsb).
- ✅ Mobile-first.
- ✅ Gunakan helper `cn()` (clsx + tailwind-merge).
- ❌ Inline style.
- ❌ `useEffect` untuk fetching.
- ❌ Redux (tidak dipakai).

### 5.2 Server/Client Boundary
- Default: Server Component.
- Tambah `"use client"` **hanya** jika perlu state/event/hooks.
- Jangan import server-only module ke client component.

### 5.3 Data
- ✅ Repository Pattern (query tidak di component).
- ✅ Server Actions untuk mutasi.
- ✅ Zod validasi di service.
- ❌ `any` di response data.

### 5.4 Style
- ✅ Semua styling via Tailwind + design tokens.
- ✅ Ikon Lucide.
- ✅ Animasi Framer Motion (hanya yang perlu).
- ✅ Aksesibilitas (focus, label, alt).

---

## 6. SEO Rules

- Setiap `page.tsx` publik wajib `export const metadata: Metadata`.
- Gunakan helper `buildMetadata()` (lib/seo).
- `generateMetadata` untuk halaman dinamis (slug).
- JSON-LD untuk: `Organization`, `Article`, `Event`, `BreadcrumbList`, `WebSite`.
- Sitemap + robots dinamis.
- Detail: **17_SEO_GUIDELINES.md**

---

## 7. Database Rules

- ✅ Semua skema lewat migration (`supabase/migrations/`).
- ✅ Setiap tabel punya TypeScript type (generate).
- ✅ Trigger `set_updated_at` di tabel ber-`updated_at`.
- ✅ RLS aktif & policies terdefinisi.
- ✅ Index untuk kolom filter/sort.
- ❌ Ubah DB langsung di dashboard (wajib migration).

---

## 8. Testing Rules

- Unit test untuk: helper, validasi Zod, repository mock, hooks.
- Component test (Vitest + RTL) untuk komponen interaktif.
- E2E (Playwright) untuk critical paths publik & admin.
- RLS test (lihat 12 & 16).
- Minimal coverage 70% untuk logic domain.

---

## 9. Code Review Checklist

- [ ] Sesuai arsitektur (Presentation/Features/Services/Repository)
- [ ] Tidak ada `any`, typecheck hijau
- [ ] RLS & auth guard benar
- [ ] Server Action error handling + revalidate
- [ ] Accessibility & responsive
- [ ] Tidak ada secret di kode/commit
- [ ] Test ditulis / diperbarui

---

## 10. Environment Variables

- `.env.example` adalah sumber kebenaran.
- Jangan commit `.env*` (kecuali `.env.example`).
- Kelompokkan: `NEXT_PUBLIC_*` (client-safe) vs server-only.

---

## 11. Dokumentasi

- Perubahan besar wajib update:
  - `docs/AI_CONTEXT.md` (aturan inti)
  - `docs/07_COMPONENT_LIBRARY.md` (komponen baru)
  - `docs/08_DATABASE_DESIGN.md` (skema baru)
- Gunakan bahasa Indonesia untuk konten, English untuk code identifiers.

---

*Document Version: 1.0 | Last Updated: 2026-08-04 | Classification: Internal*
