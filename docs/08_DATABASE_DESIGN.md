# Database Design: MWCNU Mandobo Web Platform

> PostgreSQL via Supabase. Semua perubahan skema lewat **migration SQL** (folder `supabase/migrations/`).
> Semua tabel wajib: `id uuid primary key default gen_random_uuid()`, `created_at`, `updated_at`.

---

## 1. Prinsip

1. **RLS aktif** di semua tabel (kecuali tabel sistem internal yang di-expose via security definer function).
2. **Soft delete** untuk konten (flag `deleted_at`).
3. **Snake_case** untuk kolom; `kebab-case` untuk slug.
4. Semua relasi pakai FK dengan `ON DELETE` sesuai konteks.
5. Trigger `set_updated_at()` di semua tabel dengan `updated_at`.
6. Index pada kolom yang sering di-filter/sort/join.
7. Enum via `create type` PostgreSQL (bukan string bebas).
8. Naming: tabel jamak (`articles`, `events`), kolom deskriptif (`is_published`).

---

## 2. ERD Ringkas

```
auth.users (Supabase)
   │ 1
   ▼
profiles ──┬──< user_roles >── roles
           │
           ├──< leaders (posisi pengurus)
           ├──< activity_logs (actor)
           └──< comments/likes (future)

categories <── articles ──> article_tags <── tags
events
announcements
downloads ──> documents
sermons ──> sermon_media
galleries <── albums ──> album_media <── media
departments <── leaders
institutions <── leaders
banoms <── leaders
organizations <──< leaders (struktur tree)
programs <── program_items
timeline_events
figures
mosques
banners
settings
menus <── menu_items
pages
```

---

## 3. Skema Tabel

### 3.1 Identity & RBAC

```sql
-- roles
create type public.role_name as enum ('super_admin', 'admin', 'editor', 'viewer');

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  name public.role_name not null unique,
  description text
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  bio text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  role_id uuid references public.roles(id) on delete cascade,
  unique (user_id, role_id)
);
```

### 3.2 Berita

```sql
create type public.article_status as enum ('draft', 'published', 'scheduled', 'archived');

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  parent_id uuid references public.categories(id) on delete set null,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,                    -- markdown / html
  cover_image_url text,
  category_id uuid references public.categories(id) on delete set null,
  author_id uuid references auth.users(id) on delete set null,
  status public.article_status default 'draft',
  is_featured boolean default false,
  is_pinned boolean default false,
  pinned_order int default 0,
  published_at timestamptz,
  scheduled_for timestamptz,
  view_count int default 0,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.article_tags (
  article_id uuid references public.articles(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (article_id, tag_id)
);
```

### 3.3 Agenda & Pengumuman

```sql
create type public.event_status as enum ('upcoming', 'ongoing', 'completed', 'cancelled');
create type public.event_type as enum ('kajian', 'rapat', 'peringatan', 'pelatihan', 'sosial');

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  event_type public.event_type not null,
  status public.event_status default 'upcoming',
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  location_url text,
  organizer text,
  pic_name text,
  pic_phone text,
  cover_image_url text,
  is_featured boolean default false,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create type public.announcement_type as enum ('info', 'himbauan', 'peringatan');

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  announcement_type public.announcement_type default 'info',
  is_pinned boolean default false,
  expires_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 3.4 Galeri & Media

```sql
create table public.albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  cover_media_id uuid,             -- diisi setelah media upload
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create type public.media_type as enum ('image', 'video', 'audio', 'document', 'other');

create table public.media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,      -- path di Supabase Storage
  public_url text,
  media_type public.media_type not null,
  mime_type text,
  size_bytes bigint,
  width int,
  height int,
  alt_text text,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

create table public.album_media (
  album_id uuid references public.albums(id) on delete cascade,
  media_id uuid references public.media(id) on delete cascade,
  sort_order int default 0,
  primary key (album_id, media_id)
);

create table public.galleries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  album_id uuid references public.albums(id) on delete cascade
);
```

### 3.5 Download & Dokumen

```sql
create type public.document_category as enum (
  'khutbah', 'panduan', 'formulir', 'ad_art', 'sk', 'surat', 'notulen', 'laporan', 'lainnya'
);
create type public.document_visibility as enum ('public', 'internal');

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  category public.document_category not null,
  visibility public.document_visibility default 'public',
  document_number text,            -- nomor SK/surat
  issued_date date,
  subject text,
  file_url text not null,
  file_size_bytes bigint,
  mime_type text,
  version int default 1,
  related_article_id uuid references public.articles(id) on delete set null,
  related_event_id uuid references public.events(id) on delete set null,
  download_count int default 0,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.downloads (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.documents(id) on delete cascade,
  downloaded_by uuid references auth.users(id) on delete set null,  -- null = anonim
  ip_hash text,
  created_at timestamptz default now()
);
```

### 3.6 Struktur Organisasi

```sql
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  parent_id uuid references public.organizations(id) on delete cascade,
  kind text not null,              -- 'mwcnu' | 'lembaga' | 'banom' | 'unit'
  slug text not null unique,
  description text,
  logo_url text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.positions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  title text not null,             -- 'Ketua', 'Wakil Ketua I', 'Sekretaris'...
  sort_order int default 0,
  unique (organization_id, title)
);

create table public.leaders (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete cascade,
  position_id uuid references public.positions(id) on delete cascade,
  name text not null,
  term_start date,
  term_end date,
  is_active boolean default true,
  bio text,
  photo_url text,
  phone text,
  email text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Lembaga & Banom
create table public.institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  abbreviation text,
  description text,
  category text not null,          -- 'lembaga' | 'banom'
  logo_url text,
  website text,
  chairman text,
  contact_email text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 3.7 Program Kerja

```sql
create table public.programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  field text,                      -- 'Dakwah', 'Pendidikan', 'Sosial'...
  period text,                     -- '2025-2030'
  status text default 'active',    -- planned | active | completed
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.program_items (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references public.programs(id) on delete cascade,
  title text not null,
  description text,
  progress int default 0 check (progress between 0 and 100),
  status text default 'planned',
  target_date date,
  sort_order int default 0
);
```

### 3.8 Konten Dakwah

```sql
create table public.sermons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  speaker text,
  series text,
  cover_image_url text,
  published_at timestamptz,
  view_count int default 0,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.sermon_media (
  id uuid primary key default gen_random_uuid(),
  sermon_id uuid references public.sermons(id) on delete cascade,
  media_type public.media_type not null,  -- audio | video | document(pdf)
  media_id uuid references public.media(id) on delete set null,
  title text,
  duration_seconds int,
  sort_order int default 0
);
```

### 3.9 Konten Sejarah & Tokoh

```sql
create table public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  year_start int not null,
  year_end int,
  title text not null,
  description text,
  media_id uuid references public.media(id) on delete set null,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.figures (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  title text,                       -- gelar
  category text,                    -- 'ulama' | 'akademisi' | 'pejabat' | 'aktivis'
  birth_place text,
  birth_year int,
  death_year int,
  bio text,
  photo_url text,
  quote text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 3.10 Direktori Masjid

```sql
create table public.mosques (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  address text,
  village text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  imam_name text,
  khatib_name text,
  contact_phone text,
  capacity int,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 3.11 Banner

```sql
create table public.banners (
  id uuid primary key default gen_random_uuid(),
  title text,
  subtitle text,
  image_url text not null,
  link_url text,
  start_at timestamptz,
  end_at timestamptz,
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 3.12 Sistem

```sql
create table public.settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz default now()
);

create table public.menus (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,          -- 'navbar' | 'footer' | 'bottom'
  is_active boolean default true
);

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid references public.menus(id) on delete cascade,
  parent_id uuid references public.menu_items(id) on delete cascade,
  label text not null,
  url text,
  page_id uuid,
  sort_order int default 0,
  is_external boolean default false
);

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text,
  meta_description text,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create type public.log_level as enum ('info', 'warning', 'error');

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,            -- 'article.create', 'document.delete'...
  entity_type text,
  entity_id uuid,
  metadata jsonb,
  level public.log_level default 'info',
  ip_hash text,
  created_at timestamptz default now()
);
```

---

## 4. Index yang Disarankan

```sql
create index idx_articles_status_published on articles (status, published_at desc);
create index idx_articles_category on articles (category_id);
create index idx_articles_slug on articles (slug);
create index idx_events_starts on events (starts_at);
create index idx_documents_category on documents (category);
create index idx_activity_logs_created on activity_logs (created_at desc);
create index idx_leaders_org on leaders (organization_id, sort_order);

-- Full-text search
alter table articles add column search_vector tsvector;
create index idx_articles_search on articles using gin (search_vector);
create index idx_articles_title_trgm on articles using gin (title gin_trgm_ops);
```

### Trigger untuk search_vector
```sql
create or replace function public.articles_search_trigger() returns trigger as $$
begin
  new.search_vector :=
    setweight(to_tsvector('simple', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(new.excerpt, '')), 'B');
  return new;
end; $$ language plpgsql;

create trigger trg_articles_search
  before insert or update on public.articles
  for each row execute function public.articles_search_trigger();
```

---

## 5. Common Triggers

```sql
-- updated_at otomatis
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end; $$ language plpgsql;

-- Daftarkan trigger di setiap tabel ber-`updated_at` (contoh):
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();
```

---

## 6. Common Functions

```sql
-- Hitung event status dari waktu
create or replace function public.compute_event_status(p_id uuid)
returns public.event_status as $$
declare v public.event_status;
begin
  select case
    when status = 'cancelled' then 'cancelled'
    when starts_at > now() then 'upcoming'
    when ends_at is not null and ends_at < now() then 'completed'
    else 'ongoing'
  end into v from public.events where id = p_id;
  return v;
end; $$ language plpgsql;
```

---

## 7. Storage Buckets

| Bucket | Access | Policy |
|--------|--------|--------|
| `public-assets` | Public read | Cover, galeri, logo, banner |
| `documents` | Public/internal by RLS | Dokumen (RLS by visibility) |
| `media-audio` | Public read | Audio kajian |
| `media-video` | Public read | Video kajian |
| `avatars` | Public read | Foto profil |

> Path pattern: `{bucket}/{entity}/{entity_id}/{file_name}` (contoh `documents/sk/0001/sk-001.pdf`).

---

## 8. RLS Ringkas (Detail di 12_ROLE_PERMISSION.md)

| Tabel | Select | Insert/Update/Delete |
|-------|--------|----------------------|
| `articles` (published) | public | authenticated dengan role editor+ |
| `articles` (draft/scheduled) | authenticated editor+ | authenticated editor+ |
| `events` | public | authenticated editor+ |
| `announcements` | public (aktif & belum expired) | authenticated editor+ |
| `documents` (public) | public | authenticated admin |
| `documents` (internal) | authenticated (semua login) | authenticated admin |
| `activity_logs` | authenticated admin+ | **no direct write** (via security definer) |
| `profiles` | authenticated (diri sendiri/public terbatas) | owner / admin |

---

## 9. Migration Convention

- File: `supabase/migrations/202608040001_initial_schema.sql`
- Format tanggal `YYYYMMDDHHMMSS` + `_nama_keterangan`
- Setiap migration = idempotent bila memungkinkan (`create or replace`, `if not exists`)
- Review wajib untuk: RLS changes, drops, data migration

---

*Document Version: 1.0 | Last Updated: 2026-08-04 | Classification: Internal*
