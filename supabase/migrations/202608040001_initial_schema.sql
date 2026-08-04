-- MWCNU Mandobo — Initial Schema
-- Baseline dari docs/08_DATABASE_DESIGN.md
-- Prinsip: RLS aktif di semua tabel, soft delete untuk konten, enum PostgreSQL.

-- ============================================================
-- 1. Extensions
-- ============================================================
create extension if not exists pg_trgm;

-- ============================================================
-- 2. Trigger helpers
-- ============================================================
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end; $$ language plpgsql;

-- ============================================================
-- 3. Enums
-- ============================================================
create type public.role_name as enum ('super_admin', 'admin', 'editor', 'viewer');
create type public.article_status as enum ('draft', 'published', 'scheduled', 'archived');
create type public.event_status as enum ('upcoming', 'ongoing', 'completed', 'cancelled');
create type public.event_type as enum ('kajian', 'rapat', 'peringatan', 'pelatihan', 'sosial');
create type public.announcement_type as enum ('info', 'himbauan', 'peringatan');
create type public.media_type as enum ('image', 'video', 'audio', 'document', 'other');
create type public.document_category as enum ('khutbah', 'panduan', 'formulir', 'ad_art', 'sk', 'surat', 'notulen', 'laporan', 'lainnya');
create type public.document_visibility as enum ('public', 'internal');
create type public.log_level as enum ('info', 'warning', 'error');

-- ============================================================
-- 4. Identity & RBAC
-- ============================================================
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

create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- 5. Berita
-- ============================================================
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
  content text,
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
  search_vector tsvector,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.article_tags (
  article_id uuid references public.articles(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

create trigger trg_categories_updated before update on public.categories
  for each row execute function public.set_updated_at();
create trigger trg_articles_updated before update on public.articles
  for each row execute function public.set_updated_at();

-- Search trigger (docs/08 §4)
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

-- ============================================================
-- 6. Agenda & Pengumuman
-- ============================================================
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

create trigger trg_events_updated before update on public.events
  for each row execute function public.set_updated_at();
create trigger trg_announcements_updated before update on public.announcements
  for each row execute function public.set_updated_at();

-- ============================================================
-- 7. Galeri & Media
-- ============================================================
create table public.albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  cover_media_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
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

create trigger trg_albums_updated before update on public.albums
  for each row execute function public.set_updated_at();

-- ============================================================
-- 8. Download & Dokumen
-- ============================================================
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  category public.document_category not null,
  visibility public.document_visibility default 'public',
  document_number text,
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
  downloaded_by uuid references auth.users(id) on delete set null,
  ip_hash text,
  created_at timestamptz default now()
);

create trigger trg_documents_updated before update on public.documents
  for each row execute function public.set_updated_at();

-- ============================================================
-- 9. Struktur Organisasi
-- ============================================================
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  parent_id uuid references public.organizations(id) on delete cascade,
  kind text not null,
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
  title text not null,
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

create table public.institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  abbreviation text,
  description text,
  category text not null,
  logo_url text,
  website text,
  chairman text,
  contact_email text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger trg_organizations_updated before update on public.organizations
  for each row execute function public.set_updated_at();
create trigger trg_leaders_updated before update on public.leaders
  for each row execute function public.set_updated_at();
create trigger trg_institutions_updated before update on public.institutions
  for each row execute function public.set_updated_at();

-- ============================================================
-- 10. Program Kerja
-- ============================================================
create table public.programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  field text,
  period text,
  status text default 'active',
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

create trigger trg_programs_updated before update on public.programs
  for each row execute function public.set_updated_at();

-- ============================================================
-- 11. Konten Dakwah
-- ============================================================
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
  media_type public.media_type not null,
  media_id uuid references public.media(id) on delete set null,
  title text,
  duration_seconds int,
  sort_order int default 0
);

create trigger trg_sermons_updated before update on public.sermons
  for each row execute function public.set_updated_at();

-- ============================================================
-- 12. Sejarah & Tokoh
-- ============================================================
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
  title text,
  category text,
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

create trigger trg_timeline_events_updated before update on public.timeline_events
  for each row execute function public.set_updated_at();
create trigger trg_figures_updated before update on public.figures
  for each row execute function public.set_updated_at();

-- ============================================================
-- 13. Direktori Masjid
-- ============================================================
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

create trigger trg_mosques_updated before update on public.mosques
  for each row execute function public.set_updated_at();

-- ============================================================
-- 14. Banner
-- ============================================================
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

create trigger trg_banners_updated before update on public.banners
  for each row execute function public.set_updated_at();

-- ============================================================
-- 15. Sistem
-- ============================================================
create table public.settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz default now()
);

create table public.menus (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
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

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb,
  level public.log_level default 'info',
  ip_hash text,
  created_at timestamptz default now()
);

create trigger trg_pages_updated before update on public.pages
  for each row execute function public.set_updated_at();

-- ============================================================
-- 16. Index
-- ============================================================
create index idx_articles_status_published on articles (status, published_at desc);
create index idx_articles_category on articles (category_id);
create index idx_articles_slug on articles (slug);
create index idx_articles_search on articles using gin (search_vector);
create index idx_articles_title_trgm on articles using gin (title gin_trgm_ops);
create index idx_events_starts on events (starts_at);
create index idx_documents_category on documents (category);
create index idx_leaders_org on leaders (organization_id, sort_order);
create index idx_activity_logs_created on activity_logs (created_at desc);

-- ============================================================
-- 17. Common functions
-- ============================================================
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

-- ============================================================
-- 18. RLS — dasar
-- Detail policy lengkap di docs/12_ROLE_PERMISSION.md.
-- ============================================================
alter table public.roles enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.articles enable row level security;
alter table public.article_tags enable row level security;
alter table public.events enable row level security;
alter table public.announcements enable row level security;
alter table public.albums enable row level security;
alter table public.media enable row level security;
alter table public.album_media enable row level security;
alter table public.galleries enable row level security;
alter table public.documents enable row level security;
alter table public.downloads enable row level security;
alter table public.organizations enable row level security;
alter table public.positions enable row level security;
alter table public.leaders enable row level security;
alter table public.institutions enable row level security;
alter table public.programs enable row level security;
alter table public.program_items enable row level security;
alter table public.sermons enable row level security;
alter table public.sermon_media enable row level security;
alter table public.timeline_events enable row level security;
alter table public.figures enable row level security;
alter table public.mosques enable row level security;
alter table public.banners enable row level security;
alter table public.settings enable row level security;
alter table public.menus enable row level security;
alter table public.menu_items enable row level security;
alter table public.pages enable row level security;
alter table public.activity_logs enable row level security;

-- Public read: konten publik
create policy "public_read_articles" on public.articles
  for select using (status = 'published' and deleted_at is null);
create policy "public_read_events" on public.events
  for select using (deleted_at is null);
create policy "public_read_categories" on public.categories
  for select using (is_active);
create policy "public_read_tags" on public.tags
  for select using (true);
create policy "public_read_announcements" on public.announcements
  for select using (expires_at is null or expires_at > now());
create policy "public_read_albums" on public.albums
  for select using (true);
create policy "public_read_galleries" on public.galleries
  for select using (true);
create policy "public_read_media" on public.media
  for select using (true);
create policy "public_read_documents" on public.documents
  for select using (visibility = 'public' and deleted_at is null);
create policy "public_read_organizations" on public.organizations
  for select using (true);
create policy "public_read_positions" on public.positions
  for select using (true);
create policy "public_read_leaders" on public.leaders
  for select using (is_active);
create policy "public_read_institutions" on public.institutions
  for select using (true);
create policy "public_read_sermons" on public.sermons
  for select using (deleted_at is null);
create policy "public_read_timeline_events" on public.timeline_events
  for select using (true);
create policy "public_read_figures" on public.figures
  for select using (true);
create policy "public_read_mosques" on public.mosques
  for select using (is_active);
create policy "public_read_banners" on public.banners
  for select using (is_active);

-- Admin bucket untuk semua mutasi (disederhanakan; role check detail via app layer + docs/12)
create policy "admin_all_articles" on public.articles
  for all using (auth.uid() in (
    select ur.user_id from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where r.name in ('super_admin', 'admin', 'editor')
  )) with check (auth.uid() in (
    select ur.user_id from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where r.name in ('super_admin', 'admin', 'editor')
  ));
create policy "admin_all_events" on public.events
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
create policy "admin_all_documents" on public.documents
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Profil: user membaca/mengubah dirinya sendiri
create policy "self_read_profile" on public.profiles
  for select using (auth.uid() = id);
create policy "self_update_profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- ============================================================
-- 19. Storage buckets
-- ============================================================
insert into storage.buckets (id, name, public)
values
  ('public-assets', 'public-assets', true),
  ('documents', 'documents', false),
  ('media-audio', 'media-audio', true),
  ('media-video', 'media-video', true),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;
