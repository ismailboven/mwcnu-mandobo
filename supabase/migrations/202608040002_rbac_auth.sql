-- MWCNU Mandobo — RBAC & Auth hardening (docs/11_AUTHENTICATION.md, docs/12_ROLE_PERMISSION.md)

-- ============================================================
-- 1. Roles: tambah kolom level untuk hierarki (super_admin=4 ... viewer=1)
-- ============================================================
alter table public.roles add column if not exists level int not null default 1;

update public.roles set level = 4 where name = 'super_admin';
update public.roles set level = 3 where name = 'admin';
update public.roles set level = 2 where name = 'editor';
update public.roles set level = 1 where name = 'viewer';

-- ============================================================
-- 2. Helper: get_user_role_level() — level tertinggi dari user aktif
-- ============================================================
create or replace function public.get_user_role_level()
returns int
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(max(r.level), 0)
  from public.user_roles ur
  join public.roles r on r.id = ur.role_id
  where ur.user_id = auth.uid();
$$;

-- ============================================================
-- 3. Auto-create profile saat user baru dibuat
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 4. Drop policy sederhana lama (diganti berbasis level)
-- ============================================================
drop policy if exists "admin_all_articles" on public.articles;
drop policy if exists "admin_all_events" on public.events;
drop policy if exists "admin_all_documents" on public.documents;

-- ============================================================
-- 5. Policies berbasis level per docs/12 (ringkas untuk tabel utama)
-- ============================================================

-- categories & tags
drop policy if exists "admin_write_categories" on public.categories;
create policy "admin_write_categories" on public.categories
  for all to authenticated
  using (public.get_user_role_level() >= 2)
  with check (public.get_user_role_level() >= 2);

drop policy if exists "admin_write_tags" on public.tags;
create policy "admin_write_tags" on public.tags
  for all to authenticated
  using (public.get_user_role_level() >= 2)
  with check (public.get_user_role_level() >= 2);

-- articles: read publik (sudah ada), read staff (semua status), write editor+, delete admin+
create policy "articles_staff_read" on public.articles
  for select to authenticated
  using (public.get_user_role_level() >= 1 and deleted_at is null);

create policy "articles_editor_insert" on public.articles
  for insert to authenticated
  with check (public.get_user_role_level() >= 2);

create policy "articles_editor_update" on public.articles
  for update to authenticated
  using (public.get_user_role_level() >= 2)
  with check (public.get_user_role_level() >= 2);

create policy "articles_admin_delete" on public.articles
  for delete to authenticated
  using (public.get_user_role_level() >= 3);

-- article_tags
drop policy if exists "article_tags_staff_write" on public.article_tags;
create policy "article_tags_staff_write" on public.article_tags
  for all to authenticated
  using (public.get_user_role_level() >= 2)
  with check (public.get_user_role_level() >= 2);

-- events
create policy "events_staff_read" on public.events
  for select to authenticated
  using (public.get_user_role_level() >= 1 and deleted_at is null);

create policy "events_editor_insert" on public.events
  for insert to authenticated
  with check (public.get_user_role_level() >= 2);

create policy "events_editor_update" on public.events
  for update to authenticated
  using (public.get_user_role_level() >= 2)
  with check (public.get_user_role_level() >= 2);

create policy "events_admin_delete" on public.events
  for delete to authenticated
  using (public.get_user_role_level() >= 3);

-- announcements
create policy "announcements_staff_write" on public.announcements
  for all to authenticated
  using (public.get_user_role_level() >= 2)
  with check (public.get_user_role_level() >= 2);

-- institutions / leaders / organizations / positions (admin+)
create policy "admin_write_institutions" on public.institutions
  for all to authenticated
  using (public.get_user_role_level() >= 3)
  with check (public.get_user_role_level() >= 3);

create policy "admin_write_leaders" on public.leaders
  for all to authenticated
  using (public.get_user_role_level() >= 3)
  with check (public.get_user_role_level() >= 3);

create policy "admin_write_organizations" on public.organizations
  for all to authenticated
  using (public.get_user_role_level() >= 3)
  with check (public.get_user_role_level() >= 3);

create policy "admin_write_positions" on public.positions
  for all to authenticated
  using (public.get_user_role_level() >= 3)
  with check (public.get_user_role_level() >= 3);

-- documents (admin+ tulis; staff baca internal)
create policy "documents_staff_read" on public.documents
  for select to authenticated
  using (public.get_user_role_level() >= 1);

create policy "admin_write_documents" on public.documents
  for all to authenticated
  using (public.get_user_role_level() >= 3)
  with check (public.get_user_role_level() >= 3);

-- banners (admin+)
create policy "admin_write_banners" on public.banners
  for all to authenticated
  using (public.get_user_role_level() >= 3)
  with check (public.get_user_role_level() >= 3);

-- profiles: baca kolom publik semua; update diri sendiri / admin
drop policy if exists "profiles_public_read" on public.profiles;
create policy "profiles_public_read" on public.profiles
  for select to authenticated
  using (true);

create policy "profiles_owner_update" on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- user_roles: baca sendiri; kelola hanya super_admin (level 4)
create policy "user_roles_self_read" on public.user_roles
  for select to authenticated
  using (user_id = auth.uid());

create policy "user_roles_superadmin_write" on public.user_roles
  for all to authenticated
  using (public.get_user_role_level() >= 4)
  with check (public.get_user_role_level() >= 4);

-- activity_logs: tulis lewat function saja; read admin+ (level 3)
create policy "activity_logs_admin_read" on public.activity_logs
  for select to authenticated
  using (public.get_user_role_level() >= 3);

-- ============================================================
-- 6. Update role description super_admin untuk kejelasan
-- ============================================================
update public.roles set description = 'Akses penuh sistem termasuk pengguna dan role' where name = 'super_admin';
update public.roles set description = 'Kelola semua konten & konfigurasi' where name = 'admin';
update public.roles set description = 'Kelola konten (berita, agenda, galeri, kajian)' where name = 'editor';
update public.roles set description = 'Lihat admin read-only' where name = 'viewer';
