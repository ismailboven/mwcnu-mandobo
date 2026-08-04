# Design System: MWCNU Mandobo Web Platform

> Dokumen ini adalah **satu-satunya sumber kebenaran** untuk token desain.
> Semua implementasi Tailwind wajib mengikuti token di bawah. Jangan pernah hardcode nilai warna/spacing/radius.

---

## 1. Design Tokens Overview

| Kategori | Ringkasan |
|----------|-----------|
| **Primary** | Hijau NU `#0F6A37` |
| **Secondary** | Gold `#C9A227` |
| **Mode** | Light + Dark (system default, toggle manual) |
| **Font** | Plus Jakarta Sans (display) + Inter (body) |
| **Radius** | Button 12, Card 20, Dialog 24, Input 12, Avatar full |
| **Shadow** | Soft, Medium, Floating |
| **Motion** | 150 / 200 / 300 ms |

---

## 2. Color

### 2.1 Light Mode

| Token | Value | Usage |
|-------|-------|-------|
| `background` | `#FAFAF9` | Page background (hangat) |
| `foreground` | `#101010` | Teks utama |
| `card` | `#FFFFFF` | Surface card |
| `card-foreground` | `#101010` | Teks di card |
| `primary` | `#0F6A37` | Tombol utama, link, aksen |
| `primary-foreground` | `#FFFFFF` | Teks di atas primary |
| `primary-hover` | `#0C5730` | Hover primary |
| `secondary` | `#C9A227` | Gold accent |
| `secondary-foreground` | `#FFFFFF` | Teks di atas gold |
| `muted` | `#F1F0EC` | Background muted (section) |
| `muted-foreground` | `#71717A` | Teks sekunder |
| `accent` | `#E7EFE8` | Highlight hijau lembut (hover bg) |
| `border` | `#E4E4E7` | Border default |
| `input` | `#E4E4E7` | Border input |
| `ring` | `#0F6A37` | Focus ring |
| `destructive` | `#DC2626` | Error/danger |
| `success` | `#16A34A` | Sukses |
| `warning` | `#D97706` | Peringatan |
| `info` | `#2563EB` | Informasi |

### 2.2 Dark Mode

| Token | Value | Usage |
|-------|-------|-------|
| `background` | `#0B0B0C` | Page background |
| `foreground` | `#F4F4F5` | Teks utama |
| `card` | `#121316` | Surface card |
| `card-foreground` | `#F4F4F5` | Teks di card |
| `primary` | `#2E9E5E` | Hijau lebih terang (kontras di gelap) |
| `primary-foreground` | `#FFFFFF` | Teks di atas primary |
| `secondary` | `#E0B93F` | Gold lebih terang |
| `muted` | `#1C1C1F` | Background muted |
| `muted-foreground` | `#A1A1AA` | Teks sekunder |
| `accent` | `#1A2B20` | Highlight hijau gelap |
| `border` | `#27272A` | Border default |
| `input` | `#27272A` | Border input |
| `ring` | `#2E9E5E` | Focus ring |

### 2.3 Brand / NU Heritage
| Token | Value | Usage |
|-------|-------|-------|
| `nu-green` | `#0F6A37` | Warna NU resmi (logo, formal) |
| `nu-dark` | `#0A3D20` | Gradien gelap hijau NU |
| `gold` | `#C9A227` | Aksen & dekorasi |
| `ivory` | `#F8F6F1` | Background hangat alternatif |
| `sand` | `#EFE9DC` | Aksen latar terang |

---

## 3. Typography

| Token | Font | Size (rem) | Line Height | Weight | Letter Spacing |
|-------|------|-----------|-------------|--------|----------------|
| `text-xs` | Inter | 0.75 | 1.4 | 400/500 | 0.02em |
| `text-sm` | Inter | 0.875 | 1.5 | 400/500 | — |
| `text-base` | Inter | 1 | 1.6 | 400 | — |
| `text-lg` | Inter | 1.125 | 1.6 | 400/500 | — |
| `text-xl` | Plus Jakarta Sans | 1.25 | 1.4 | 600 | — |
| `text-2xl` | Plus Jakarta Sans | 1.5 | 1.3 | 700 | — |
| `text-3xl` | Plus Jakarta Sans | 1.875 | 1.25 | 700 | -0.01em |
| `text-4xl` | Plus Jakarta Sans | 2.25 | 1.2 | 800 | -0.02em |
| `text-5xl` | Plus Jakarta Sans | 3 | 1.15 | 800 | -0.02em |
| `text-6xl` | Plus Jakarta Sans | 3.75 | 1.1 | 800 | -0.03em |

> Font di-load via `next/font/google`. Display: Plus Jakarta Sans (400–800). Body: Inter (400–600). Arabic: Amiri (untuk konten Arab, optional).

---

## 4. Spacing Scale

```
0   0px
px  1px
0.5 2px
1   4px
2   8px
3   12px
4   16px
5   20px
6   24px
7   28px
8   32px
9   36px
10  40px
11  44px
12  48px
14  56px
16  64px
20  80px
24  96px
28  112px
32  128px
```
> Hanya gunakan skala di atas. `gap-*`, `p-*`, `m-*`, `space-*` semua mengacu skala ini.

---

## 5. Radius

| Token | Value | Penggunaan |
|-------|-------|-----------|
| `rounded-none` | 0 | — |
| `rounded-sm` | 6px | Chip kecil |
| `rounded-md` | 8px | Ikon box, tag |
| `rounded-lg` | 12px | **Button, Input, Badge** |
| `rounded-xl` | 16px | Card kecil, thumbnail |
| `rounded-2xl` | 20px | **Card standar** |
| `rounded-3xl` | 24px | **Dialog, Hero card, Drawer** |
| `rounded-full` | 9999px | Avatar, pill, badge penuh |

---

## 6. Shadow

| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `shadow-soft` | `0 1px 2px rgb(16 16 16 / 0.04), 0 4px 12px rgb(16 16 16 / 0.06)` | `0 1px 2px rgb(0 0 0 / 0.3), 0 4px 12px rgb(0 0 0 / 0.4)` |
| `shadow-medium` | `0 2px 4px rgb(16 16 16 / 0.06), 0 12px 24px rgb(16 16 16 / 0.1)` | `0 2px 4px rgb(0 0 0 / 0.4), 0 12px 24px rgb(0 0 0 / 0.5)` |
| `shadow-floating` | `0 8px 16px rgb(16 16 16 / 0.08), 0 24px 48px rgb(16 16 16 / 0.12)` | `0 8px 16px rgb(0 0 0 / 0.5), 0 24px 48px rgb(0 0 0 / 0.6)` |
| `shadow-glow` (primary) | `0 0 0 1px #0F6A37, 0 8px 24px rgb(15 106 55 / 0.25)` | `0 0 0 1px #2E9E5E, 0 8px 24px rgb(46 158 94 / 0.3)` |

> Default card = `shadow-soft` + `ring-1 ring-border`. Hover card = `shadow-medium`.

---

## 7. Motion & Duration

| Token | Duration | Easing | Penggunaan |
|-------|----------|--------|-----------|
| `--duration-fast` | 150ms | `ease-out` | Hover, active, focus |
| `--duration-base` | 200ms | `ease-in-out` | Transition umum, color |
| `--duration-slow` | 300ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Drawer, menu, accordion |
| `--duration-enter` | 400ms | spring | Page enter, dialog |

---

## 8. Breakpoints

| Tailwind | Min Width | Container | Notes |
|----------|-----------|-----------|-------|
| `sm` | 640px | max-w-xl | Tablets kecil |
| `md` | 768px | max-w-2xl | Tablet |
| `lg` | 1024px | max-w-4xl | Laptop kecil |
| `xl` | 1280px | max-w-6xl | Laptop |
| `2xl` | 1536px | max-w-7xl | Desktop besar |

> **Mobile-first**: tulis style tanpa prefix dulu, lalu `sm:`, `md:`, dst.

---

## 9. Icons & Imagery

| Aset | Standard |
|------|----------|
| **Icons** | Lucide (`lucide-react`), size default 20px (buttons), 24px (inline) |
| **Gambar** | `next/image` — selalu `fill` atau `sizes`, rasio: cover 16:9 / card 4:3 / avatar 1:1 |
| **Ilustrasi** | Minimalis, line-art, warna NU palette |
| **Pattern** | Subtle geometric islamic (SVG inline, opacity < 5%) hanya sebagai dekorasi bg |
| **Format** | WebP/AVIF via next/image; SVG untuk logo/ikon |

---

## 10. Tailwind v4 Setup (Referensi)

```css
/* globals.css */
@import "tailwindcss";
@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(0.985 0.004 90);
  --foreground: oklch(0.14 0 0);
  --card: oklch(1 0 0);
  --primary: oklch(0.36 0.12 152);
  --primary-hover: oklch(0.32 0.11 152);
  --secondary: oklch(0.68 0.12 90);
  --muted: oklch(0.955 0.006 85);
  --muted-foreground: oklch(0.53 0.01 260);
  --accent: oklch(0.93 0.02 152);
  --border: oklch(0.91 0.005 260);
  --ring: oklch(0.36 0.12 152);
}
.dark {
  --background: oklch(0.145 0.005 0);
  --card: oklch(0.2 0.005 0);
  --primary: oklch(0.65 0.12 152);
  --secondary: oklch(0.78 0.11 90);
  --muted: oklch(0.24 0.005 0);
  --muted-foreground: oklch(0.66 0.005 260);
  --border: oklch(0.28 0.005 260);
  --ring: oklch(0.65 0.12 152);
}
```

> Perhatian: Nilai hex di dokumen ini adalah sumber desain; konversi ke oklch/oklab dilakukan saat implementasi. Pastikan kontras tetap WCAG AA.

---

## 11. Anti-Pattern (Dilarang)

- ❌ Hardcode hex di komponen (wajib token).
- ❌ Radius lebih dari 24px untuk komponen fungsional.
- ❌ Bayangan keras (`shadow-black/30`) tanpa token.
- ❌ Mengganti font selain Plus Jakarta Sans / Inter.
- ❌ Membuat warna baru tanpa approval Design System owner.
- ❌ Inline style `style={{}}` — gunakan Tailwind.
- ❌ Emoji sebagai ikon UI (gunakan Lucide).

---

*Document Version: 1.0 | Last Updated: 2026-08-04 | Classification: Internal*
