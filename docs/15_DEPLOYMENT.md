# Deployment: MWCNU Mandobo Web Platform

---

## 1. Pipeline Utama

```
[Developer] → Push ke GitHub → CI (check) → Deploy Preview (Vercel)
                   │                                        │
                   └── PR ke dev ──────────────────────────► Preview (dev)
                   └── merge ke main ──────────────────────► Production (Vercel)
                                                                    │
                                                              Supabase (prod)
```

| Environment | Domain | Tujuan |
|-------------|--------|--------|
| **Preview** | `*-git-*.vercel.app` | Review per-PR |
| **Staging (dev)** | `staging.mwcnumandobo.or.id` | UAT, integration |
| **Production** | `mwcnumandobo.or.id` (www) | Live |

---

## 2. Repository & Branch

- `main` → production (protected: wajib PR + status check)
- `dev` → staging (protected: wajib PR)
- `feature/*`, `fix/*`, `chore/*` → preview

### Branch Protection (main & dev)
- [x] Require pull request before merging
- [x] Require status check: `ci` (lint + typecheck + test)
- [x] Dismiss stale approvals
- [x] Require conversation resolution

---

## 3. CI (GitHub Actions)

`.github/workflows/ci.yml`:
```yaml
name: CI
on:
  push:
    branches: [main, dev]
  pull_request:
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 24, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
```

### Quality Gate
- ESLint: no warnings
- TypeScript: strict pass
- Vitest: all green
- Build: success
- (Opsional) `vercel pull` untuk env di preview

---

## 4. Vercel

### 4.1 Project Setup
| Setting | Value |
|---------|-------|
| Framework | Next.js |
| Install command | `pnpm install` |
| Build command | `pnpm build` |
| Output | `apps/web/.next` (monorepo) |
| Node version | 22+ (set via `engines`) |
| Root directory | `apps/web` |
| Regions | `sin1` (Singapore) + auto |

### 4.2 Env (Production)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-only, tidak untuk preview publik tanpa guard
NEXT_PUBLIC_SITE_URL=https://mwcnumandobo.or.id
NEXT_PUBLIC_SITE_NAME=MWCNU Mandobo
SENTRY_AUTH_TOKEN=                # jika Sentry
NEXT_PUBLIC_SENTRY_DSN=
```

### 4.3 ISR & Edge
- ISR aktif otomatis (Next.js) dengan `revalidate`.
- Pastikan `export const runtime` memenuhi kebutuhan (edge optional).

### 4.4 Deploy Protection
- Production: auto deploy dari `main`.
- Preview: untuk reviewer & pengurus via Vercel auth (Opsional — atau buka publik dengan guard).

---

## 5. Supabase

### 5.1 Project Setup
| Item | Value |
|------|-------|
| Region | **Singapore (asia-southeast-1)** |
| Auth | Email+password, enable email confirm, disable open signup di produksi |
| Plan | Free → Pro (saat perlu 1GB+ DB / PITR) |

### 5.2 CLI Workflow (local → remote)
```bash
supabase start            # local dev stack
supabase db reset         # reset local dari migrations
supabase db push          # apply migration ke remote (dengan review)
supabase functions deploy search-utils --project-ref <ref>
supabase storage link
```

> **Aturan**: Jangan pernah ubah skema langsung di dashboard produksi. Selalu via migration + review.

### 5.3 Backup & Recovery
- Supabase Pro: PITR (point-in-time recovery) aktif.
- Export manual mingguan: `supabase db dump --data-only` ke `supabase/backups/`.

### 5.4 Branching (Opsional)
- Supabase **Preview Branching** untuk tiap PR (butuh Pro) — sangat disarankan agar migration diuji.

---

## 6. Domain & DNS

| Record | Target |
|--------|--------|
| `A` / `CNAME` root | Vercel (dari dashboard Vercel → Domains) |
| `CNAME www` | `cname.vercel-dns.com` |
| `CNAME staging` | ke Vercel alias |

- SSL: Let's Encrypt otomatis oleh Vercel.
- Provider domain: registrar manapun (recommended: Cloudflare for DNS + free CDN).

---

## 7. Monitoring & Observability

| Tool | Fungsi | Alert |
|------|--------|-------|
| **Vercel Analytics** | Web Vitals, traffic, engagement | threshold CPU/time |
| **Vercel Speed Insights** | LCP/INP/CLS real user | degradasi > 10% |
| **Sentry** | Error tracking (frontend + server actions) | error rate > 1% |
| **UptimeRobot / BetterStack** | Uptime HTTP check | down > 60s |
| **Supabase Dashboard** | DB load, active connections | CPU > 80% |

---

## 8. Rollback Strategy

| Jenis | Cara |
|-------|------|
| **Kode** | Vercel Instant Rollback (ke deployment sebelumnya) |
| **Data** | PITR (restore ke timestamp) / migration down (jika ditulis) |
| **Config** | Revert env + redeploy |
| **Storage** | Versioning file; restore dari backup |

> Latihan rollback dijadwalkan tiap 3 bulan sekali (game day).

---

## 9. Checklist Go-Live

- [ ] DNS pointing benar + SSL hijau
- [ ] Env production lengkap & tidak ada secret di repo
- [ ] Supabase: email confirm ON, open signup OFF, RLS terverifikasi
- [ ] Robots.txt + sitemap terindex (Google Search Console)
- [ ] Redirect `http → https`, `www → non-www` (pilih satu)
- [ ] Uptime monitor + Sentry + Analytics aktif
- [ ] 404/error/empty state diuji di produksi
- [ ] Backup pertama dijalankan
- [ ] Lighthouse prod ≥ 95 (Performance/A11y/SEO)

---

## 10. Cost Estimate (Opsional naik ke Pro)

| Item | Free | Pro |
|------|:----:|:---:|
| Vercel | ✅ | $20/bln |
| Supabase | ✅ | $25/bln |
| Domain | ~$15/thn | — |
| Sentry | ✅ | $0 (small) |
| **Total/bln** | **$0–$5** | **~$45** |

> Mulai dari Free tier; naikkan saat: DB > 500MB, butuh PITR, volume edge function tinggi.

---

*Document Version: 1.0 | Last Updated: 2026-08-04 | Classification: Internal*
