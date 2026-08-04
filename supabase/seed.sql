-- MWCNU Mandobo — Seed
-- Menyiapkan roles, organisasi inti, dan settings awal.

insert into public.roles (name, description)
values
  ('super_admin', 'Akses penuh seluruh sistem'),
  ('admin', 'Mengelola semua konten dan pengguna'),
  ('editor', 'Membuat dan mengelola konten'),
  ('viewer', 'Hanya membaca konten internal')
on conflict (name) do nothing;

insert into public.organizations (name, kind, slug, description, sort_order)
values
  ('MWCNU Mandobo', 'mwcnu', 'mwcnu-mandobo', 'Majelis Wakil Cabang Nahdlatul Ulama Distrik Mandobo', 1)
on conflict (slug) do nothing;

insert into public.settings (key, value)
values
  ('site_name', '"MWCNU Mandobo"'),
  ('site_description', '"Platform digital resmi Majelis Wakil Cabang Nahdlatul Ulama Distrik Mandobo"')
on conflict (key) do nothing;
