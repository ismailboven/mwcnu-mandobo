# SEO Guidelines: MWCNU Mandobo Web Platform

---

## 1. Prinsip

- SEO dimulai dari **arsitektur & konten**, bukan trik.
- Semua halaman publik wajib: title unik, meta description, canonical, OG.
- Structured data (JSON-LD) untuk konten utama.
- Sitemap & robots dinamis, auto-update.
- Fokus: **organisasi lokal + konten dakwah**. Targetkan pencarian seperti *"MWCNU Mandobo"*, *"pengajian Mandobo"*, *"jadwal kajian Boven Digoel"*.

---

## 2. Metadata (Next.js App Router)

### 2.1 Root Layout
```ts
// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: {
    default: "MWCNU Mandobo — Nahdlatul Ulama Distrik Mandobo",
    template: "%s | MWCNU Mandobo",
  },
  description: "Platform digital resmi Majelis Wakil Cabang Nahdlatul Ulama Distrik Mandobo. Berita, agenda, kajian, struktur organisasi, dan arsip.",
  openGraph: { type: "website", locale: "id_ID", ... },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};
```

### 2.2 Halaman Statis & Dinamis
```ts
export const metadata: Metadata = {
  title: "Berita",
  description: "Berita terbaru MWCNU Mandobo.",
  alternates: { canonical: "/berita" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getPublishedBySlug(params.slug);
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/berita/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.coverImageUrl }],
      publishedTime: article.publishedAt,
    },
  };
}
```

### 2.3 Rule Metadata
| Rule | Standard |
|------|----------|
| Title | 50–60 karakter, keyword utama di depan |
| Description | 120–160 karakter, CTA ringan |
| Canonical | Wajib semua halaman (hindari duplikat) |
| OG image | 1200×630, teks besar (auto-generate via `opengraph-image.tsx`) |
| H1 | Satu per halaman, relevan dengan query |

---

## 3. URL & Struktur

- Path: `kebab-case`, deskriptif (lihat 04_INFORMATION_ARCHITECTURE.md).
- Slug immutable setelah publish.
- Hindari parameter untuk konten penting (kanonikalkan `/berita?page=2` ke sitemap pagination).
- Trailing slash: konsisten tanpa.

---

## 4. Structured Data (JSON-LD)

### 4.1 Organization (halaman tentang & footer)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MWCNU Mandobo",
  "url": "https://mwcnumandobo.or.id",
  "logo": "https://mwcnumandobo.or.id/logo.png",
  "sameAs": ["https://facebook.com/...", "https://instagram.com/..."]
}
```

### 4.2 Article
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "image": "...",
  "datePublished": "2026-08-04T00:00:00+09:00",
  "dateModified": "...",
  "author": { "@type": "Person", "name": "..." },
  "publisher": { "@type": "Organization", "name": "MWCNU Mandobo", "logo": {...} }
}
```

### 4.3 Event (agenda)
```json
{
  "@type": "Event",
  "name": "...",
  "startDate": "2026-08-10T09:00:00+09:00",
  "endDate": "...",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": { "@type": "Place", "name": "...", "address": "..." }
}
```

### 4.4 Lainnya
| Tipe | Halaman |
|------|---------|
| `WebSite` + `SearchAction` | root (untuk searchbox rich result) |
| `BreadcrumbList` | semua detail |
| `Person` | tokoh & pengurus |
| `Place` | masjid |

---

## 5. Sitemap & Robots

```ts
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, events, sermons, pages] = await Promise.all([...]);
  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...articles.map(a => ({ url: `${base}/berita/${a.slug}`, lastModified: a.updatedAt, changeFrequency: "weekly" as const, priority: 0.8 })),
    // events, sermons, tokoh, masjid, dsb.
  ];
}
```

```ts
// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/member", "/api/"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
```

> Pastikan sitemap tidak mengandung halaman draft/internal.

---

## 6. SEO Teknis

| Aspek | Implementasi |
|-------|--------------|
| **Perfomance (Core Web Vitals)** | detail di 18_PERFORMANCE.md |
| **Mobile-first** | render penuh di 375px |
| **Image** | `next/image` + WebP/AVIF + explicit `sizes` + `alt` |
| **Heading order** | h1 → h2 → h3 tanpa lompat |
| **Semantik** | `article`, `time`, `address`, `nav` |
| **Internal linking** | terkait, breadcrumb, tag/category links |
| **No-JS** | Server Components → konten tampil tanpa JS |
| **Preload** | font & LCP image |
| **Caching** | ISR untuk konten publik |

---

## 7. Konten & Keyword

### 7.1 Topik Utama (konten harus selalu berkualitas)
- Kegiatan MWCNU (Isro' Mi'raj, Maulid, Hari Santri, Peringatan Harlah NU)
- Kajian & pengajian rutin
- Program pendidikan (LP Ma'arif), sosial, ekonomi
- Struktur & kepengurusan
- Tokoh & sejarah NU Mandobo

### 7.2 Long-tail
Contoh judul:
- "Jadwal Pengajian Rutin MWCNU Mandobo Bulan Ini"
- "Struktur Pengurus MWCNU Mandobo 2025–2030"
- "Download Khutbah Jumat PDF"

---

## 8. Local SEO

- Pastikan alamat & koordinat konsisten (NAP: Name, Address, Phone) di kontak & footer.
- JSON-LD `Organization` + `Place` untuk masjid.
- Tambahkan di Google Business Profile (jika ada sekretariat fisik).
- Gunakan "Distrik Mandobo, Kabupaten Boven Digoel, Papua Selatan" secara konsisten di konten.

---

## 9. Social Sharing

- OG image auto-generate (`opengraph-image.tsx`) dengan template brand: judul + logo + hijau NU.
- Tombol share: WhatsApp, Facebook, X, Telegram, copy link (icon Lucide, tanpa tracker).
- Twitter Card `summary_large_image`.

---

## 10. Analytics & Measurement

| Alat | Metrik |
|------|--------|
| Vercel Analytics | Traffic, engagement, referrers |
| Google Search Console | Index coverage, queries, CTR |
| Bing Webmaster | parallel submit |
| Custom event | Download hit, search success (untuk North Star) |

---

## 11. Checklist Halaman Baru

- [ ] `metadata` / `generateMetadata` lengkap
- [ ] Canonical benar
- [ ] Satu H1 relevan
- [ ] JSON-LD sesuai tipe
- [ ] Alt text semua gambar
- [ ] Internal link (breadcrumb / terkait / nav)
- [ ] Diuji: no-JS render, mobile viewport, Lighthouse SEO ≥ 95

---

*Document Version: 1.0 | Last Updated: 2026-08-04 | Classification: Internal*
