-- MWCNU Mandobo — Fix: izinkan baca tabel roles (RLS belum punya policy SELECT,
-- sehingga join embed `user_roles -> roles` mengembalikan null untuk staff).

create policy "roles_public_read" on public.roles
  for select to anon, authenticated
  using (true);
