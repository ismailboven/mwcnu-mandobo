-- MWCNU Mandobo — Fix soft delete articles (RLS)
-- RLS menolak UPDATE yang membuat baris baru tak lagi lolos SELECT policy
-- (articles_staff_read / public_read_articles memerlukan deleted_at IS NULL).
-- Solusi: soft delete via fungsi security definer RPC (melewati RLS),
-- dengan pengecekan otoritas (admin+, level 3) di dalam fungsi.

create or replace function public.admin_soft_delete_article(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.get_user_role_level() < 3 then
    raise exception 'forbidden: role admin (level 3) required';
  end if;

  update public.articles
    set deleted_at = now(),
        status = 'archived',
        updated_at = now()
    where id = p_id
      and deleted_at is null;

  if not found then
    raise exception 'article_not_found';
  end if;
end;
$$;

revoke all on function public.admin_soft_delete_article(uuid) from public;
grant execute on function public.admin_soft_delete_article(uuid) to authenticated;
