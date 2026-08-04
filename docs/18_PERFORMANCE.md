# Performance Guidelines: MWCNU Mandobo Web Platform

---

## 1. Target (Budget)

| Metrik | Target |
|--------|--------|
| **Lighthouse Performance** | ≥ 95 |
| **LCP** | < 2.5s (mobile 4G) |
| **INP** | < 200ms |
| **CLS** | < 0.1 |
| **TTFB (edge/ISR)** | < 300ms |
| **Bundle JS (initial)** | < 170KB gzip |
| **Halaman detail** | < 150KB JS |

---

## 2. Rendering Strategy

| Halaman | Strategy | Alasan |
|---------|----------|--------|
| Beranda | **ISR** (revalidate 60) | konten sering berubah, perlu cepat |
| Berita list/detail | **ISR** 60s + incremental | cepat + up-to-date |
| Struktur, profil, statis | **ISR** 3600 | jarang berubah |
| Admin | **Dynamic** (`force-dynamic`) | data realtime + auth |
| Search | **Dynamic** | query user |
| 404 | Static | selalu ada |

```ts
// konten publik
export const revalidate = 60;
// admin
export const dynamic = "force-dynamic";
```

> Gunakan **Tag-based revalidation** setelah mutasi (`revalidateTag("articles")`) agar cache segar tanpa menunggu interval.

---

## 3. Bundle Optimization

### 3.1 Aturan
- **Server Components** untuk apa pun yang tidak butuh state.
- **`dynamic` import** untuk: lightbox, editor WYSIWYG, chart, audio player heavy.
- **Route-level code splitting** otomatis Next.js — jangan bocorkan admin code ke publik.
- Hati-hati `"use client"` di pohon besar — client boundary menarik seluruh subtree ke bundle.

### 3.2 Audit
```bash
pnpm build            # lihat first-load JS per route
npx @next/bundle-analyzer  # analisis dependency
```
- Dependency berat (mis. rich editor) hanya dimuat di halaman admin.
- Ikon: `lucide-react` (tree-shakeable).

---

## 4. Image Optimization

```tsx
import Image from "next/image";

// Cover artikel
<Image
  src={article.coverImageUrl}
  alt={article.title}
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  priority={isLcpImage}
  className="object-cover"
/>
```

| Aturan | Nilai |
|--------|-------|
| Format | WebP/AVIF (otomatis oleh next/image) |
| Ukuran max | 2000px; card 640px |
| `priority` | Hanya gambar LCP (hero) |
| `sizes` | Wajib untuk resp img |
| Lazy | Default `lazy` di bawah fold |
| Placeholder | `blur` (blurDataURL) untuk jaga CLS |
| Explicit dimensi | `fill` + parent `aspect-*`, atau width/height |

---

## 5. Font

```ts
import { Plus_Jakarta_Sans, Inter } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
```
- `next/font` (self-hosted, no layout shift).
- `display: swap`; subset latin.
- Hindari font weight berlebih (hanya 400, 500, 600, 700, 800).

---

## 6. Caching

| Layer | Cara |
|-------|------|
| **Next.js** | ISR + `revalidateTag` + `unstable_cache` untuk query berat |
| **Supabase** | Index optimal; gunakan `select` minimal (projection) |
| **Browser** | `Cache-Control` untuk aset statis (immutable) |
| **CDN** | Vercel edge cache default untuk ISR |

### Query yang sering dipanggil (cache di Server Component)
```ts
import { unstable_cache } from "next/cache";

const getNav = unstable_cache(
  async () => fetchNavData(),
  ["nav"],
  { revalidate: 300, tags: ["settings", "menus"] }
);
```

---

## 7. Data Fetching

- ✅ Projection: ambil hanya kolom yang dibutuhkan (`select("title,slug,excerpt,cover_image_url,published_at")`).
- ✅ Pagination (limit/offset atau keyset) — jangan `select(*)` tanpa batas.
- ✅ Batch query (single round-trip dengan `or`, `in`).
- ✅ Repository cache untuk data yang sama di beberapa komponen (React `cache()`).
- ❌ N+1 — jangan query per-item di loop.

```ts
import { cache } from "react";
export const getArticleWithRelations = cache(async (slug: string) => { ... });
```

---

## 8. Critical Path (LCP) Optimization

1. Hero image = LCP → `priority` + preload.
2. TTFB rendah → ISR/stale-while-revalidate.
3. Hindari layout shift: ukuran eksplisit, `aspect-ratio`, skeleton.
4. Render blocking: font swap, CSS inline kritis (Tailwind v4 murni utility).

---

## 9. JavaScript Reduction

| Aksi | Dampak |
|------|--------|
| Server Component untuk konten | kurangi besar JS |
| Avoid `useEffect` fetching | tidak ada double-render |
| `use client` sesempit mungkin | bundle kecil |
| TanStack Query hanya untuk area interaktif | — |
| Rich editor / chart via dynamic import | admin only |

---

## 10. Third-Party & Analytics

- Vercel Analytics/Speed Insights: **self-hosted, non-blocking** (`defer`).
- Google Fonts: via `next/font` (bukan link external).
- **Tanpa** tracker pihak ketiga lain (privacy + performance).
- Web vitals dikirim ke Vercel Speed Insights.

---

## 11. Performance Monitoring

| Alat | Metrik | Alert |
|------|--------|-------|
| **Vercel Speed Insights** | LCP/INP/CLS real user | p95 > budget |
| **Vercel Analytics** | traffic, route speed | — |
| **Lighthouse CI** | per PR (budget 95) | fail PR |
| **Sentry** | server timing, slow queries | slow queries > 1s |
| **Supabase** | query plan (EXPLAIN) | seq scan di tabel besar |

### Audit berkala (bulanan)
- [ ] Lighthouse prod (mobile) ≥ 95
- [ ] P95 INP < 200ms
- [ ] First-load JS per route < 170KB
- [ ] Tidak ada N+1 / seq scan baru
- [ ] Core Web Vitals hijau di Search Console

---

## 12. Anti-Pattern Performance

- ❌ Fetch di client tanpa server cache.
- ❌ `next/image` tanpa `sizes` / dimensi.
- ❌ Bundle admin ke halaman publik.
- ❌ `import * as` dari library besar.
- ❌ Interpolasi string SQL dari user (selalu param).
- ❌ Render ulang seluruh page untuk update kecil (pakai TanStack Query + optimis).

---

*Document Version: 1.0 | Last Updated: 2026-08-04 | Classification: Internal*
