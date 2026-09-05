import { cache } from "react";
import type { CategoryCreateInput, CategoryUpdateInput } from "@mwcnu/validations";
import { slugify } from "@mwcnu/utils";
import { createServerSupabase } from "@/lib/supabase/server";
import { createPublicSupabase } from "@/lib/supabase/public";

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

export interface AdminCategory extends CategoryOption {
  parent_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  article_count: number;
}

export const listActiveCategories = cache(async (): Promise<CategoryOption[]> => {
  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("categories")
      .select("id,name,slug")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) return [];
    return (data ?? []).map((row) => ({ id: row.id, name: row.name, slug: row.slug }));
  } catch {
    return [];
  }
});

export async function adminListCategories(): Promise<AdminCategory[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("categories")
    .select("id,name,slug,parent_id,is_active,created_at,updated_at,articles(count)")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const r = row as Record<string, unknown>;
    const articles = (r.articles as { count: number }[] | null | undefined) ?? [];
    return {
      id: r.id as string,
      name: r.name as string,
      slug: r.slug as string,
      parent_id: (r.parent_id as string) ?? null,
      is_active: (r.is_active as boolean) ?? true,
      created_at: r.created_at as string,
      updated_at: r.updated_at as string,
      article_count: articles[0]?.count ?? 0,
    };
  });
}

export async function adminGetCategoryBySlug(slug: string): Promise<CategoryOption | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("categories")
    .select("id,name,slug")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function adminCreateCategory(input: CategoryCreateInput): Promise<{ id: string }> {
  const supabase = await createServerSupabase();
  const slug = input.slug ?? slugify(input.name);

  const existing = await adminGetCategoryBySlug(slug);
  if (existing) throw new Error("Slug kategori sudah digunakan.");

  const { data, error } = await supabase
    .from("categories")
    .insert({ name: input.name, slug, parent_id: null, is_active: input.isActive ?? true })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return { id: data.id };
}

export async function adminUpdateCategory(id: string, input: CategoryUpdateInput): Promise<void> {
  const supabase = await createServerSupabase();

  if (input.slug !== undefined) {
    const existing = await adminGetCategoryBySlug(input.slug);
    if (existing && existing.id !== id) {
      throw new Error("Slug kategori sudah digunakan.");
    }
  }

  const patch: Record<string, unknown> = {};
  if (input.name !== undefined) patch.name = input.name;
  if (input.slug !== undefined) patch.slug = input.slug;
  if (input.isActive !== undefined) patch.is_active = input.isActive;

  const { error } = await supabase.from("categories").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function adminDeleteCategory(id: string): Promise<void> {
  const supabase = await createServerSupabase();
  const { count } = await supabase
    .from("articles")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id)
    .is("deleted_at", null);

  if ((count ?? 0) > 0) {
    throw new Error("Kategori masih dipakai oleh berita, tidak bisa dihapus.");
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
