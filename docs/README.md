# MWCNU Mandobo Web Platform — Dokumentasi

> Paket dokumentasi lengkap untuk platform digital resmi **Majelis Wakil Cabang Nahdlatul Ulama Distrik Mandobo**.
> Gunakan folder `docs/` ini sebagai konteks utama untuk semua AI assistant (Claude Code, Codex, Gemini CLI, Cursor, Windsurf, opencode).

---

## 📚 Daftar Dokumen

| # | Dokumen | Isi |
|---|---------|-----|
| 00 | [PROJECT_CHARTER](./00_PROJECT_CHARTER.md) | Visi eksekutif, scope, risiko, budget |
| 01 | [PRODUCT_VISION](./01_PRODUCT_VISION.md) | Vision, mission, USP, metrik sukses |
| 02 | [PRD](./02_PRD.md) | Product requirements & user stories |
| 03 | [USER_PERSONAS](./03_USER_PERSONAS.md) | Profil & kebutuhan pengguna |
| 04 | [INFORMATION_ARCHITECTURE](./04_INFORMATION_ARCHITECTURE.md) | Sitemap, navigasi, URL |
| 05 | [UI_UX_GUIDELINES](./05_UI_UX_GUIDELINES.md) | Prinsip UI/UX & aksesibilitas |
| 06 | [DESIGN_SYSTEM](./06_DESIGN_SYSTEM.md) | Warna, tipografi, spacing, radius, shadow |
| 07 | [COMPONENT_LIBRARY](./07_COMPONENT_LIBRARY.md) | Daftar komponen & aturan penggunaan |
| 08 | [DATABASE_DESIGN](./08_DATABASE_DESIGN.md) | Skema tabel, ERD, trigger, index |
| 09 | [BACKEND_ARCHITECTURE](./09_BACKEND_ARCHITECTURE.md) | Arsitektur berlapis & Repository Pattern |
| 10 | [API_SPECIFICATION](./10_API_SPECIFICATION.md) | Kontrak Server Actions & queries |
| 11 | [AUTHENTICATION](./11_AUTHENTICATION.md) | Alur login, session, middleware |
| 12 | [ROLE_PERMISSION](./12_ROLE_PERMISSION.md) | RBAC & RLS policies |
| 13 | [DEVELOPMENT_GUIDELINES](./13_DEVELOPMENT_GUIDELINES.md) | Aturan coding, git, commit |
| 14 | [FOLDER_STRUCTURE](./14_FOLDER_STRUCTURE.md) | Struktur repo & folder |
| 15 | [DEPLOYMENT](./15_DEPLOYMENT.md) | GitHub → Vercel → Supabase |
| 16 | [TESTING_GUIDELINES](./16_TESTING_GUIDELINES.md) | Vitest, Playwright, RLS suite |
| 17 | [SEO_GUIDELINES](./17_SEO_GUIDELINES.md) | Metadata, JSON-LD, sitemap |
| 18 | [PERFORMANCE](./18_PERFORMANCE.md) | Budget, ISR, image, bundle |
| 19 | [ROADMAP](./19_ROADMAP.md) | Fase, sprint, backlog |

## 🤖 File AI Assistant

| File | Untuk |
|------|-------|
| [AI_CONTEXT.md](./AI_CONTEXT.md) | ⭐⭐⭐ Manual utama — **wajib dibaca semua AI** |
| [CLAUDE.md](./CLAUDE.md) | Claude Code |
| [CODEX.md](./CODEX.md) | OpenAI Codex |
| [GEMINI.md](./GEMINI.md) | Gemini CLI |
| [CURSOR.md](./CURSOR.md) | Cursor / Windsurf |

---

## 🚀 Cara Memakai Paket Ini

1. **Manusia** — baca `00` → `01` → `02` untuk memahami produk & scope.
2. **AI Assistant** — instruksikan:
   > "Baca `docs/AI_CONTEXT.md` dan dokumen terkait sebelum membuat kode."
3. **Tim dev** — ikuti `13_DEVELOPMENT_GUIDELINES.md` dan `14_FOLDER_STRUCTURE.md`.

---

## ⚙️ Stack Ringkas

```
Frontend:  Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Lucide
           Framer Motion · React Hook Form · Zod · TanStack Query
Backend:   Supabase (PostgreSQL · Auth · Storage · Realtime · Edge Functions · RLS)
Deploy:    GitHub → Vercel → Supabase
```

## 🎨 Identitas

- **Konsep**: Modern Nusantara (bersih, elegan, islami, hangat)
- **Primary**: Hijau NU `#0F6A37` | **Secondary**: Gold `#C9A227`
- **Font**: Plus Jakarta Sans (display) + Inter (body)
- **Layout**: Bento Grid, Soft Shadow, Rounded XL

---

## 📝 Status Dokumen

| Item | Status |
|------|--------|
| 00–19 + AI_CONTEXT + Agent files | ✅ Selesai v1.0 |
| Migrasi SQL lengkap | ⏳ Fase implementasi |
| Repository template (apps/packages) | ⏳ Fase implementasi |

---

*Terakhir diperbarui: 2026-08-04 | Klasifikasi: Internal*
