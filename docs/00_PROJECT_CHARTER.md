# Project Charter: MWCNU Mandobo Web Platform v1.0

---

## 1. Project Overview

| Field | Value |
|-------|-------|
| **Project Name** | MWCNU Mandobo Web Platform |
| **Version** | 1.0 |
| **Organization** | Majelis Wakil Cabang Nahdlatul Ulama Distrik Mandobo |
| **Project Sponsor** | Ketua MWCNU Mandobo |
| **Project Manager** | [Nama Project Manager] |
| **Technical Lead** | [Nama Technical Lead] |
| **Start Date** | [Tanggal Mulai] |
| **Target Launch** | [Tanggal Target Launch] |

---

## 2. Business Justification

### 2.1 Problem Statement
MWCNU Mandobo saat ini belum memiliki platform digital resmi yang terintegrasi. Informasi organisasi tersebar di media sosial, WhatsApp Group, dan dokumen fisik, menyebabkan:
- Kesulitan akses informasi resmi bagi pengurus, anggota, dan publik
- Tidak ada arsip terpusat untuk keputusan, notulen, dan dokumen hukum
- Komunikasi internal tidak terstruktur
- Branding organisasi tidak konsisten di dunia digital

### 2.2 Solution
Membangun **Digital Platform** terpusat yang melayani:
- **Profil Organisasi** — Sejarah, visi misa, struktur, pengurus
- **Informasi Publik** — Berita, agenda, pengumuman, kajian
- **Arsip Digital** — SK, surat, notulen, dokumen keputusan
- **Direktori** — Masjid, lembaga, tokoh NU lokal
- **Member Portal** — (Fase 2) Dashboard pengurus, absensi, program kerja
- **Interaksi** — Pencarian global, dark mode, aksesibilitas

### 2.3 Strategic Alignment
Platform ini mendukung:
- **Transformasi Digital NU** — Menyelaraskan dengan program NU Digital
- **Good Governance** — Transparansi pengelolaan organisasi
- **Regenerasi** — Mempermudah kader muda mengakses sejarah & struktur
- **Dakwah Modern** — Menjangkau jamaah melalui kanal digital

---

## 3. Scope

### 3.1 In Scope (v1.0)
- ✅ Website publik responsive (Mobile-first)
- ✅ CMS Berita & Kategori (WYSIWYG + Markdown)
- ✅ Manajemen Agenda & Kalender
- ✅ Galeri Foto/Video (Album-based)
- ✅ Download Center (Dokumen, PDF, Audio, Video)
- ✅ Struktur Organisasi Interaktif (Tree-based)
- ✅ Profil Pengurus + Masa Khidmat
- ✅ Lembaga & Banom (Badan Otonom)
- ✅ Program Kerja per Bidang
- ✅ Timeline Sejarah Organisasi
- ✅ Tokoh NU Lokal (Biografi)
- ✅ Direktori Masjid (Basic)
- ✅ Khutbah & Kajian (Multi-format)
- ✅ Arsip Keputusan (SK, Surat, Notulen)
- ✅ Banner Kegiatan (Scheduled)
- ✅ Featured/Pinned News
- ✅ Pengumuman (Terpisah dari Berita)
- ✅ Pencarian Global (Full-text)
- ✅ Dark Mode
- ✅ Multi-role Auth (Admin, Editor, Viewer)
- ✅ RBAC + RLS (Row Level Security)
- ✅ SEO Optimized (Schema.org, Sitemap, Meta)
- ✅ Performance > 95 Lighthouse
- ✅ WCAG AA Accessibility

### 3.2 Out of Scope (v1.0)
- ❌ Mobile App (iOS/Android)
- ❌ Member Portal dengan dashboard pengurus
- ❌ Sistem Keuangan/Keanggotaan
- ❌ E-Learning / LMS
- ❌ Live Streaming terintegrasi
- ❌ Chat/Forum internal
- ❌ Notifikasi Push/Email otomatis
- ❌ Multi-language (hanya Bahasa Indonesia)
- ❌ API Public untuk third-party

### 3.3 Future Phases
| Phase | Focus | Timeline |
|-------|-------|----------|
| **v1.1** | Member Portal, Absensi, Surat Menyurat | Q2 2026 |
| **v2.0** | Mobile App (React Native), PWA | Q4 2026 |
| **v2.1** | Keuangan, Keanggotaan, Donasi | Q1 2027 |
| **v3.0** | AI-assisted Content, Chatbot Dakwah | Q3 2027 |

---

## 4. Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Lighthouse Performance** | ≥ 95 | Chrome DevTools / PageSpeed |
| **Lighthouse Accessibility** | ≥ 95 | axe-core / WAVE |
| **Lighthouse SEO** | ≥ 95 | Lighthouse SEO audit |
| **Core Web Vitals** | All Green | LCP < 2.5s, CLS < 0.1, INP < 200ms |
| **Time to Interactive** | < 3s | WebPageTest |
| **Uptime** | 99.9% | Vercel Analytics / UptimeRobot |
| **Search Index Coverage** | 100% halaman publik | Google Search Console |
| **Admin Adoption** | 100% pengurus aktif | Analytics custom event |
| **Content Freshness** | < 7 hari rata-rata | CMS last-updated audit |

---

## 5. Stakeholders

| Role | Name | Responsibility |
|------|------|----------------|
| **Sponsor** | Ketua MWCNU Mandobo | Approval budget, strategic direction |
| **Product Owner** | Sekretaris/Umum | Requirements, prioritization, UAT |
| **Tech Lead** | [Nama] | Architecture, code review, deployment |
| **Frontend Dev** | [Nama] | UI/UX implementation, components |
| **Backend/DevOps** | [Nama] | Supabase, DB, Auth, CI/CD |
| **Content Admin** | Bidang Humas/Penerangan | Content creation, moderation |
| **Designer** | [Nama] | Design system, branding, assets |
| **QA** | [Nama] | Testing, accessibility audit |

---

## 6. Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Scope creep** | High | High | Strict change control via PRD, phase-gate |
| **Content migration delay** | High | Medium | Parallel content prep during dev, bulk import tool |
| **Supabase vendor lock-in** | Low | High | Repository pattern, abstract Supabase client |
| **Performance degradation** | Medium | High | CI perf budget, ISR, image optimization |
| **Security breach (RLS misconfig)** | Low | Critical | RLS test suite, audit checklist, staging review |
| **Design inconsistency** | Medium | Medium | Design system tokens, component library, Storybook |
| **Team knowledge gap (Next.js 16, RSC)** | Medium | Medium | Pair programming, tech spikes, documentation |

---

## 7. Budget & Resources

### 7.1 Technology Costs (Estimated Monthly)
| Service | Tier | Est. Cost |
|---------|------|-----------|
| **Vercel** | Pro | $20/bln |
| **Supabase** | Pro | $25/bln |
| **Domain + SSL** | Custom | ~$15/thn |
| **Monitoring** | Vercel Analytics + Sentry | Free tier |
| **Total** | | **~$45/bln** |

### 7.2 Human Resources
- 1x Tech Lead (Part-time)
- 1x Frontend Developer (Full-time)
- 1x Backend/DevOps (Part-time)
- 1x Content Admin (Part-time)
- 1x Designer (As needed)

---

## 8. Governance

### 8.1 Decision Making
- **Technical decisions** → Tech Lead (escalasi ke Sponsor jika > 2 hari)
- **Product decisions** → Product Owner
- **Design decisions** → Designer + Product Owner
- **Content decisions** → Bidang Humas/Penerangan

### 8.2 Communication Cadence
| Meeting | Frequency | Attendees |
|---------|-----------|-----------|
| **Daily Standup** | Hari kerja | Dev Team |
| **Sprint Planning** | 2 minggu sekali | Full Team |
| **Sprint Review** | 2 minggu sekali | Full Team + Stakeholders |
| **Retrospective** | 2 minggu sekali | Dev Team |
| **Steering Committee** | Bulanan | Sponsor, PO, Tech Lead |

### 8.3 Change Control
Semua perubahan scope wajib melalui:
1. Change Request Form (GitHub Issue dengan label `change-request`)
2. Impact Analysis (Tech Lead)
3. Approval (Product Owner + Sponsor jika budget/timeline berubah)
4. Update PRD & Roadmap

---

## 9. Assumptions & Dependencies

### 9.1 Assumptions
- Tim memiliki akses ke repositori GitHub Organization
- Supabase project sudah disiapkan (atau akan dibuat di sprint 1)
- Domain `mwcnumandobo.or.id` (atau sejenis) tersedia
- Branding guide (logo, warna, font) sudah final
- Konten awal (profil, pengurus, sejarah) siap migrasi

### 9.2 Dependencies
- **Supabase** — Auth, Database, Storage, Realtime, Edge Functions
- **Vercel** — Hosting, Edge Network, ISR, Analytics
- **GitHub** — Source control, CI/CD, Issues, Projects
- **shadcn/ui** — Component primitives (Radix UI + Tailwind)
- **Lucide** — Icon library
- **Framer Motion** — Animation library

---

## 10. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Project Sponsor** | | | |
| **Product Owner** | | | |
| **Technical Lead** | | | |

---

*Document Version: 1.0 | Last Updated: 2026-08-04 | Classification: Internal*