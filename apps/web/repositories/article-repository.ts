import { cache } from "react";
import type { ArticleCard, ArticleDetail } from "@mwcnu/types";
import { createServerSupabase } from "@/lib/supabase/server";
import { MOCK_ARTICLES } from "./mock-data";

const isSupabaseConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const listPublishedArticles = cache(async (options?: { limit?: number }): Promise<ArticleCard[]> => {
  const limit = options?.limit ?? 12;

  if (!isSupabaseConfigured()) {
    return MOCK_ARTICLES.slice(0, limit);
  }

  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("articles")
    .select("id,title,slug,excerpt,cover_image_url,category_id,published_at,view_count,categories(id,name,slug)")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => {
    const raw = row as unknown as {
      id: string;
      title: string;
      slug: string;
      excerpt: string | null;
      cover_image_url: string | null;
      category_id: string | null;
      published_at: string | null;
      view_count: number | null;
      categories: ArticleCard["category"];
    };
    return {
      id: raw.id,
      title: raw.title,
      slug: raw.slug,
      excerpt: raw.excerpt,
      cover_image_url: raw.cover_image_url,
      category_id: raw.category_id,
      category: raw.categories ?? null,
      published_at: raw.published_at,
      view_count: raw.view_count,
    };
  });
});

export const getPublishedArticleBySlug = cache(
  async (slug: string): Promise<ArticleDetail | null> => {
    if (!isSupabaseConfigured()) {
      const card = MOCK_ARTICLES.find((item) => item.slug === slug);
      if (!card) return null;
      return {
        ...card,
        content:
          "<p>Contoh konten berita. Data ini akan digantikan konten asli dari CMS Supabase saat environment terkonfigurasi.</p>",
        category: card.category
          ? {
              id: card.category.id,
              name: card.category.name,
              slug: card.category.slug,
              parent_id: null,
              is_active: true,
              created_at: "",
              updated_at: "",
            }
          : null,
        tags: [],
        is_featured: false,
        is_pinned: false,
        pinned_order: 0,
        status: "published",
        author_id: null,
        scheduled_for: null,
        deleted_at: null,
        created_at: "",
        updated_at: "",
        view_count: card.view_count ?? 0,
      };
    }

    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .is("deleted_at", null)
      .single();

    if (error) return null;
    return data as unknown as ArticleDetail;
  }
);
