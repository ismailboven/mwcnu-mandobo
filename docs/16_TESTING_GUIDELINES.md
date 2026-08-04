# Testing Guidelines: MWCNU Mandobo Web Platform

---

## 1. Strategi (Testing Pyramid)

```
        ┌───────────────┐
        │    E2E (few)   │  Playwright — critical paths
        ├───────────────┤
        │ Component (some)│  Vitest + RTL
        ├───────────────┤
        │    Unit (many) │  Vitest — logic, schemas, utils
        └───────────────┘
        └── RLS / Integration (Supabase local)
```

| Lapisan | Alat | Target |
|---------|------|--------|
| Unit | Vitest | Zod schemas, utils (slug, date), repository mock |
| Component | Vitest + Testing Library | Form, dialog, card, search |
| Integration | Vitest + MSW / Supabase local | Service + Repository |
| E2E | Playwright | Publik & admin critical paths |
| RLS | Vitest + supabase local | Policy enforcement matrix |

---

## 2. Unit Test (Vitest)

### 2.1 Konfigurasi
```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    coverage: { provider: "v8", thresholds: { lines: 70, functions: 70 } },
  },
});
```

### 2.2 Contoh — Zod schema
```ts
import { ArticleCreateSchema } from "@/features/articles/schemas";

describe("ArticleCreateSchema", () => {
  it("validates minimal input", () => {
    const r = ArticleCreateSchema.safeParse({ title: "Judul cukup panjang", content: "x" });
    expect(r.success).toBe(true);
  });
  it("rejects too-short title", () => {
    const r = ArticleCreateSchema.safeParse({ title: "abc", content: "x" });
    expect(r.success).toBe(false);
  });
});
```

### 2.3 Contoh — util
```ts
import { formatDateID, slugify } from "@/lib/utils";

it("slugify produces kebab-case", () => {
  expect(slugify("Kegiatan Hari Santri 2026!")).toBe("kegiatan-hari-santri-2026");
});
it("formatDateID formats to Indonesian", () => {
  expect(formatDateID(new Date("2026-08-04"))).toBe("Senin, 4 Agustus 2026");
});
```

---

## 3. Component Test (Vitest + RTL)

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ArticleCard } from "@/components/domain/article-card";

it("renders title, category, and link", () => {
  render(<ArticleCard article={fixture} />);
  expect(screen.getByRole("link")).toHaveTextContent(fixture.title);
  expect(screen.getByText(fixture.category.name)).toBeInTheDocument();
});

it("opens dialog on confirm delete", async () => {
  const user = userEvent.setup();
  render(<DeleteConfirmDialog onConfirm={vi.fn()} />);
  await user.click(screen.getByRole("button", { name: /hapus/i }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
});
```

---

## 4. Repository Integration (Supabase Local)

```bash
supabase start          # database + auth + storage lokal
supabase db reset       # aplikasikan migrations + seed
```

```ts
// repositories/article-repository.integration.test.ts
import { createClient } from "@supabase/supabase-js";
// gunakan service role untuk setup test data, anon untuk assertions RLS
describe("ArticleRepository", () => {
  it("only returns published articles to anon", async () => {
    // insert draft + published (service role)
    // query via anon client
    const { data } = await listPublished(anonClient);
    expect(data.items.some((a) => a.status === "draft")).toBe(false);
  });
});
```

---

## 5. RLS Test Suite (Wajib per sprint)

File: `supabase/tests/rls.test.ts` — matrix:

| # | Skenario | Setup | Expected |
|---|----------|-------|----------|
| 1 | anon read published article | insert published | ✅ select |
| 2 | anon read draft article | insert draft | ❌ no rows |
| 3 | viewer insert article | login viewer | ❌ 403/empty |
| 4 | editor insert article | login editor | ✅ |
| 5 | editor delete document | login editor | ❌ |
| 6 | editor delete own article (soft) | login editor | ✅ (status change) |
| 7 | admin update role | login admin | ❌ (hanya super_admin) |
| 8 | userA read userB profile private | login A | ❌ |
| 9 | expired announcement hidden | insert expired | ❌ |
| 10 | internal document to anon | visibility=internal | ❌ |

```ts
it("anon cannot read draft articles", async () => {
  await seedPublishedArticle(svc);        // service role
  await seedDraftArticle(svc);
  const anon = createAnonClient();
  const { data } = await anon.from("articles").select("id");
  expect(data.length).toBe(1);            // hanya published
});
```

---

## 6. E2E (Playwright)

### 6.1 Proyek
```jsonc
{
  "projects": [
    { "name": "chromium" },
    { "name": "mobile", "use": { ...devices["iPhone 13"] } },
    { "name": "webkit" }
  ]
}
```

### 6.2 Critical Paths (specs)
| File | Path |
|------|------|
| `home.spec.ts` | Home menampilkan hero, berita, agenda, footer |
| `article.spec.ts` | List → detail → related → share |
| `search.spec.ts` | Ketik query → result → filter → klik detail |
| `agenda.spec.ts` | Kalender → detail agenda → tambah calendar |
| `download.spec.ts` | Unduh dokumen publik → counter naik |
| `structure.spec.ts` | Struktur tree → klik node → detail pengurus |
| `admin-article.spec.ts` | Login → buat berita → publish → tampil publik |
| `admin-doc.spec.ts` | Upload SK internal → tidak bisa diakses anon |
| `auth.spec.ts` | Login gagal → lockout; magic link flow |
| `a11y.spec.ts` | `@axe-core/playwright` di halaman utama |

### 6.3 Contoh
```ts
import { test, expect } from "@playwright/test";

test("publish article appears on public", async ({ page }) => {
  await page.goto("/admin/berita");
  await page.getByRole("link", { name: "Buat Berita" }).click();
  await page.getByLabel("Judul").fill("Kegiatan Isro' Mi'raj 2026");
  await page.getByRole("button", { name: "Publish" }).click();
  await page.goto("/berita");
  await expect(page.getByText("Kegiatan Isro' Mi'raj 2026")).toBeVisible();
});
```

### 6.4 Setup
- Base URL dari env `E2E_BASE_URL` (localhost saat dev, staging di CI).
- Seed data deterministik via `supabase db reset` + fixtures.
- Isolasi: setiap spec pakai user test sendiri.

---

## 7. Accessibility Testing

| Alat | Kapan |
|------|-------|
| `@axe-core/playwright` | E2E smoke per halaman publik |
| Lighthouse CI | Accessible + Performance + SEO per PR |
| Manual keyboard | Fokus, dialog, focus trap |
| Screen reader | NVDA/VoiceOver untuk form & struktur |

---

## 8. Performance Regression (Lighthouse CI)

`.github/workflows/lighthouse.yml` (atau Vercel Speed Insights):
```yaml
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v12
  with:
    urls: |
      https://preview.vercel.app/
      https://preview.vercel.app/berita
    budgetPath: .github/lh-budget.json
```

`.github/lh-budget.json`:
```json
{
  "performance": 95,
  "accessibility": 95,
  "best-practices": 95,
  "seo": 95,
  "categories": {
    "performance": { "minScore": 0.95 }
  }
}
```

---

## 9. Coverage & Reporting

- Unit+component: coverage > 70% (logic domain).
- E2E: tidak wajib coverage, wajib **critical paths hijau**.
- Dashboard: `pnpm test -- --reporter=html` + upload artifact ke PR.
- CI fail jika: coverage < threshold, RLS suite fail, atau Lighthouse < 95.

---

## 10. Anti-Pattern Testing

- ❌ Test implementasi detail (query selector rapuh) — pakai role/text.
- ❌ Snapshot besar yang rapuh.
- ❌ Mock seluruh repository sehingga logika RLS tak pernah diuji.
- ❌ Test tanpa isolation (data menempel antar test).
- ❌ Skipped test tanpa issue tracker.

---

*Document Version: 1.0 | Last Updated: 2026-08-04 | Classification: Internal*
