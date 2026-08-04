# Backend Architecture: MWCNU Mandobo Web Platform

---

## 1. Arsitektur Berlapis

```
┌─────────────────────────────────────────────┐
│            Presentation (UI)                │
│  Server Components / Client Components      │
├─────────────────────────────────────────────┤
│               Features (domain)             │
│  articles / events / gallery / structure    │
├─────────────────────────────────────────────┤
│               Services (use cases)          │
│  Server Actions, use-cases, validasi Zod    │
├─────────────────────────────────────────────┤
│             Repository (data access)        │
│  Supabase client, query builder, typed DB   │
├─────────────────────────────────────────────┤
│              Infra (Supabase)               │
│  PostgreSQL, Storage, Auth, Realtime, Edge  │
└─────────────────────────────────────────────┘
```

**Aturan inti**: Component **tidak pernah** memanggil Supabase langsung. Data lewat Repository → Service → Component.

---

## 2. Stack & Pendekatan

| Aspek | Keputusan |
|-------|-----------|
| **Rendering** | Server Components first; Client Components hanya saat butuh interaktivitas |
| **Mutations** | **Server Actions** sebagai default (bukan API Routes) |
| **Data fetch** | Server Component langsung via Repository; klien pakai TanStack Query |
| **Validasi** | Zod di lapisan service (bukan hanya di form) |
| **State global** | Tidak ada Redux. Local state + TanStack Query cache |
| **Auth** | Supabase Auth + Middleware Next.js |
| **Typed DB** | `@supabase/supabase-js` + generated types (`supabase gen types`) |
| **Monitoring** | Vercel Analytics + Sentry |

---

## 3. Repository Pattern

### 3.1 Struktur
```
src/repositories/
├── article-repository.ts
├── event-repository.ts
├── gallery-repository.ts
├── document-repository.ts
├── structure-repository.ts
├── sermon-repository.ts
├── search-repository.ts
└── user-repository.ts
```

### 3.2 Kontrak
```ts
// Setiap repository meng-ekspos method domain (bukan query mentah)
export interface ArticleRepository {
  findPublished(slug: string): Promise<Article | null>;
  listPublished(opts: Pagination & Filter): Promise<PageResult<Article>>;
  listFeatured(limit: number): Promise<Article[]>;
  create(data: ArticleCreate): Promise<Article>;
  update(id: string, data: ArticleUpdate): Promise<Article>;
  delete(id: string): Promise<void>;
  incrementViews(id: string): Promise<void>;
}
```

### 3.3 Server Action = Service
```ts
"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { articleRepo } from "@/repositories/article-repository";
import { ArticleCreateSchema } from "@/features/articles/schemas";

export async function createArticleAction(input: unknown) {
  const parsed = ArticleCreateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten() };

  const sb = await createServerSupabase();
  const user = await requireEditor(sb);   // guard peran
  const article = await articleRepo.create(sb, parsed.data, user.id);

  await logActivity(sb, "article.create", article.id);
  revalidatePath("/berita");
  return { ok: true, data: article };
}
```

---

## 4. Supabase Client

| Klien | Lokasi | Penggunaan |
|-------|--------|-----------|
| `createServerSupabase()` | `lib/supabase/server.ts` | Server Component, Server Action, Middleware (pakai `@supabase/ssr`) |
| `createBrowserSupabase()` | `lib/supabase/client.ts` | Client Component (auth flow, realtime) |
| `createRouteSupabase()` | `lib/supabase/route.ts` | API Route (jarang dipakai) |
| `createAdminSupabase()` | `lib/supabase/admin.ts` | Service role — **hanya di server**, untuk operasi admin khusus (mis. buat user) |

> ⚠️ `service_role` key **tidak pernah** dipakai di client atau Server Action user-facing. Simpan di env server.

---

## 5. Server Actions vs API Routes

| Situasi | Pakai |
|---------|-------|
| Mutasi dari form/halaman internal | **Server Action** |
| Update data publik dari klien (like, download hit) | Server Action atau API route tipis |
| Public API untuk third-party (fase lanjut) | API Route |
| Upload file besar | API Route + Storage (streaming) |

### Aturan
- Server Action = `"use server"`, terbatas 64KB request.
- Return plain serializable object (jangan return client object).
- `revalidatePath` / `revalidateTag` setelah mutasi.
- Error handling: kembalikan `{ ok: false, code, message }`, bukan throw tanpa konteks.

---

## 6. Caching & ISR

| Halaman | Strategy |
|---------|----------|
| Home, Beranda sections | ISR `revalidate = 60` (atau tag-based) |
| Berita list | ISR 60s |
| Berita detail | ISR 60s + incremental |
| Struktur, profil, statis | ISR 3600 |
| Admin | `dynamic = "force-dynamic"` + auth |
| Search | Dynamic |

```ts
export const revalidate = 60;          // page level
export const dynamic = "force-dynamic"; // admin

// Revalidate tag setelah mutasi
revalidateTag("articles");
// lalu fetch pakai next: { tags: ["articles"] }
```

---

## 7. Edge Functions (Supabase)

Dipakai untuk task yang tidak cocok di Next.js:

| Kasus | Contoh |
|-------|--------|
| **Webhook** | Publish terjadwal, notifikasi |
| **Resize gambar** | Generate thumbnail galeri (image processing) |
| **OCR** | Dokumen PDF searchable (fase 2) |
| **Ekspor** | Generate iCal, export CSV |

Pattern: deploy via Supabase CLI, protected dengan `Authorization` header (service role).

---

## 8. Realtime

| Penggunaan | Scope |
|------------|-------|
| Admin dashboard live counter | `realtime` supabase, channel per-table |
| Notifikasi in-app (fase 1.1) | `broadcast` channel |
| Halaman publik | **Tidak dipakai** (pakai ISR saja) |

Aturan: aktifkan realtime **per tabel** yang dibutuhkan, bukan default semua tabel.

---

## 9. Error Handling

1. **Repository**: lemparkan error domain (`ArticleNotFoundError`).
2. **Service/Server Action**: tangkap + map ke `{ ok: false, code }`.
3. **UI**: komponen `ErrorBoundary` + toast.
4. **Logging**: 
   - Development: `console.error` terstruktur.
   - Production: Sentry (`@sentry/nextjs`), breadcrumbs + user context.
5. Jangan expose detail error internal ke klien/publik.

---

## 10. Security

| Aspek | Implementasi |
|-------|--------------|
| **RLS** | Semua query via `authenticated`/`anon` role; **tanpa `bypass_rls`** di app |
| **Server-only** | Kode sensitive (env, service role) di `server-only` package |
| **Rate limit** | Auth: Supabase built-in + retry policy; Search API: Vercel rate limit (fase lanjut) |
| **CORS** | Ketat, hanya origin resmi |
| **Headers** | `X-Frame-Options`, `X-Content-Type-Options`, CSP via `next.config` |
| **Input** | Zod di service; parameterized query (kita pakai client SDK, aman dari injection) |
| **File** | Validasi MIME & ukuran server-side sebelum upload |

---

## 11. Directory Structure (Backend)

```
src/
├── app/                  # Next.js app router (route handlers + pages)
├── components/           # UI + domain components
├── features/             # Per-modul: queries, mutations, schemas, ui
├── repositories/         # Data access layer (Supabase)
├── services/             # Use cases & business logic (bila > action sederhana)
├── lib/
│   ├── supabase/         # client/server/route/admin
│   ├── seo/              # metadata builders, JSON-LD
│   ├── utils/            # cn(), date, slug, dsb
│   └── validations/      # Zod schemas shared
├── types/                # Domain types (dari Supabase generated + custom)
├── middleware.ts         # Auth session refresh
└── server-only/          # Package `server-only` markers
```

---

## 12. Pengambilan Data yang Direkomendasikan

### Server Component (default)
```tsx
// app/berita/page.tsx (Server Component)
import { articleRepo } from "@/repositories/article-repository";

export default async function BeritaPage() {
  const result = await articleRepo.listPublished({ page: 1, limit: 12 });
  return <ArticleList initial={result} />;
}
```

### Client Component (interaktif — pagination/infinite)
```tsx
"use client";
export function ArticleList({ initial }: Props) {
  const { data } = useInfiniteQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
    initialData: initial,
  });
  // ...
}
```

### Mutasi (Server Action)
```tsx
<form action={createArticleAction}>
  <FormInput name="title" />
  <button>Simpan</button>
</form>
```

---

## 13. Logging Aktivitas

- Wajib dicatat untuk semua mutasi: `activity_logs` (actor, action, entity, metadata).
- Dilakukan **di dalam Server Action** setelah mutasi berhasil.
- Gunakan `security definer` function untuk insert (agar anon tidak bisa menulis log sendiri):

```sql
create or replace function public.log_activity(
  p_action text, p_entity_type text, p_entity_id uuid, p_metadata jsonb default '{}'
) returns void security definer set search_path = public as $$
begin
  insert into public.activity_logs (actor_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), p_action, p_entity_type, p_entity_id, p_metadata);
end; $$ language plpgsql;
```

---

## 14. Anti-Pattern Backend

- ❌ Query Supabase langsung di komponen.
- ❌ Meletakkan logika bisnis di file `page.tsx` (kecuali trivial).
- ❌ Memakai `service_role` di client / browser.
- ❌ Mempercayai input tanpa Zod server-side.
- ❌ API Route untuk mutasi yang bisa pakai Server Action.
- ❌ `useEffect` untuk fetching (gunakan Server Component / TanStack Query).
- ❌ Menyimpan file besar di database (pakai Storage).

---

*Document Version: 1.0 | Last Updated: 2026-08-04 | Classification: Internal*
