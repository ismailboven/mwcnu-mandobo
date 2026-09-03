-- Debug sementara: lihat policy RLS, trigger, dan constraint untuk articles
create or replace function public.debug_articles_rls()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  result json;
begin
  select json_build_object(
    'policies', (
      select coalesce(json_agg(json_build_object(
        'name', p.polname,
        'cmd', p.polcmd,
        'roles', (select coalesce(json_agg(r.rolname), '{}') from pg_roles r where r.oid = any(p.polroles)),
        'using', pg_get_expr(p.polqual, p.polrelid),
        'with_check', pg_get_expr(p.polwithcheck, p.polrelid)
      )), '[]')
      from pg_policy p
      join pg_class c on c.oid = p.polrelid
      where c.relname = 'articles'
    ),
    'triggers', (
      select coalesce(json_agg(t.tgname), '[]')
      from pg_trigger t
      join pg_class c on c.oid = t.tgrelid
      where c.relname = 'articles' and not t.tgisinternal
    ),
    'constraints', (
      select coalesce(json_agg(con.conname), '[]')
      from pg_constraint con
      join pg_class c on c.oid = con.conrelid
      where c.relname = 'articles'
    )
  ) into result;
  return result;
end;
$$;

grant execute on function public.debug_articles_rls() to authenticated;
