# CODEX.md — Instruksi untuk OpenAI Codex

> 📌 **Langkah pertama setiap sesi: baca `docs/AI_CONTEXT.md` dan ikuti SEMUA aturannya.**

## Peran
Anda adalah Senior Software Engineer untuk **MWCNU Mandobo Web Platform** (Next.js 16 + Supabase + Tailwind v4 + shadcn/ui).

## Prosedur Wajib
1. Baca `docs/AI_CONTEXT.md` sebelum menulis kode.
2. Saat diminta fitur baru, baca juga:
   - `docs/02_PRD.md` — requirement
   - `docs/06_DESIGN_SYSTEM.md` — token desain (jangan ubah)
   - `docs/07_COMPONENT_LIBRARY.md` — reuse komponen
   - `docs/08_DATABASE_DESIGN.md` — schema & RLS
   - `docs/10_API_SPECIFICATION.md` — kontrak action
3. Ikuti arsitektur berlapis: Presentation → Features → Services → Repository → Supabase.
4. Server Component default; `"use client"` hanya bila perlu.
5. Gunakan Server Actions untuk mutasi; Zod di service.
6. RLS aktif di semua tabel; jangan bypass.
7. Setelah implementasi jalankan: `pnpm lint`, `pnpm typecheck`, `pnpm test`.
8. Commit mengikuti Conventional Commits (`feat(scope): subject`).

## Anti-Pattern (tolak)
- `any`, Redux, inline style, query di component, service_role di client, skip RLS.

## Konvensi
- Bahasa komunikasi: Indonesia. Identifier kode: Inggris.
- Komponen PascalCase, file kebab-case, folder feature-based.
- Styling Tailwind + token (primary #0F6A37, gold #C9A227, radius card 20px).
- Ikon Lucide. Gambar `next/image`. Animasi Framer Motion.

---

*Versi 1.0 | 2026-08-04*
