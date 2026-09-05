import { cache } from "react";
import type { Article, ArticleCard, ArticleDetail, ArticleStatus } from "@mwcnu/types";
import type { ArticleCreateInput, ArticleUpdateInput } from "@mwcnu/validations";
import { slugify } from "@mwcnu/utils";
import { createServerSupabase } from "@/lib/supabase/server";
import { createPublicSupabase } from "@/lib/supabase/public";
import { MOCK_ARTICLES } from "./mock-data";

const isSupabaseConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const CARD_COLUMNS =
  "id,title,slug,excerpt,cover_image_url,category_id,published_at,view_count,categories(id,name,slug)";

type CardRow = {
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

function mapCardRow(raw: unknown): ArticleCard {
  const row = raw as CardRow;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    cover_image_url: row.cover_image_url,
    category_id: row.category_id,
    category: row.categories ?? null,
    published_at: row.published_at,
    view_count: row.view_count,
  };
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i] as T;
    arr[i] = arr[j] as T;
    arr[j] = tmp;
  }
  return arr;
}

export const listPublishedArticles = cache(
  async (options?: {
    limit?: number;
    categoryId?: string | undefined;
    order?: "asc" | "desc" | undefined;
  }): Promise<ArticleCard[]> => {
    const limit = options?.limit ?? 12;
    const categoryId = options?.categoryId;
    const order = options?.order ?? "desc";

    const getMockItems = () => {
      let items = MOCK_ARTICLES;
      if (categoryId) {
        items = items.filter((item) => item.category?.id === categoryId);
      }
      items = [...items].sort((a, b) => {
        const ta = a.published_at ? new Date(a.published_at).getTime() : 0;
        const tb = b.published_at ? new Date(b.published_at).getTime() : 0;
        return order === "asc" ? ta - tb : tb - ta;
      });
      return items.slice(0, limit);
    };

    if (!isSupabaseConfigured()) {
      return getMockItems();
    }

    try {
      const supabase = createPublicSupabase();
      let query = supabase
        .from("articles")
        .select(CARD_COLUMNS)
        .eq("status", "published")
        .is("deleted_at", null)
        .order("published_at", { ascending: order === "asc" })
        .limit(limit);

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query;

      if (error) {
        console.warn("Supabase listPublishedArticles error, falling back to mock:", error.message);
        return getMockItems();
      }

      return (data ?? []).map(mapCardRow);
    } catch (err) {
      console.warn("Supabase fetch failed in listPublishedArticles, falling back to mock:", err);
      return getMockItems();
    }
  }
);

export const getPublishedArticleBySlug = cache(
  async (slug: string): Promise<ArticleDetail | null> => {
    const getMockDetail = (): ArticleDetail | null => {
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
    };

    if (!isSupabaseConfigured()) {
      return getMockDetail();
    }

    try {
      const supabase = createPublicSupabase();
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .is("deleted_at", null)
        .single();

      if (error) return getMockDetail();
      return data as unknown as ArticleDetail;
    } catch {
      return getMockDetail();
    }
  }
);

/** Berita berikutnya dalam kategori yang sama (membulat bila di posisi terakhir). */
export const getNextArticleBySlug = cache(async (slug: string): Promise<ArticleCard | null> => {
  const getMockNext = (): ArticleCard | null => {
    const current = MOCK_ARTICLES.find((item) => item.slug === slug);
    if (!current?.category) return null;
    const sameCategory = MOCK_ARTICLES.filter((item) => item.category?.id === current.category?.id);
    const index = sameCategory.findIndex((item) => item.slug === slug);
    if (index === -1 || sameCategory.length === 0) return null;
    return sameCategory[(index + 1) % sameCategory.length] ?? null;
  };

  if (!isSupabaseConfigured()) {
    return getMockNext();
  }

  try {
    const current = await getPublishedArticleBySlug(slug);
    if (!current?.category_id) return null;

    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("articles")
      .select(CARD_COLUMNS)
      .eq("status", "published")
      .is("deleted_at", null)
      .eq("category_id", current.category_id)
      .order("published_at", { ascending: true })
      .limit(50);

    if (error) return getMockNext();

    const list = (data ?? []).map(mapCardRow);
    const index = list.findIndex((item) => item.slug === slug);
    if (index === -1 || list.length === 0) return null;
    return list[(index + 1) % list.length] ?? null;
  } catch {
    return getMockNext();
  }
});

/** Beberapa berita acak (kategori bervariasi) sebagai umpan/lainnya. */
export const listRandomArticles = cache(
  async (options?: { excludeSlug?: string; limit?: number }): Promise<ArticleCard[]> => {
    const limit = options?.limit ?? 3;
    const excludeSlug = options?.excludeSlug;

    const getMockRandom = () => {
      const pool = MOCK_ARTICLES.filter((item) => item.slug !== excludeSlug);
      return shuffle(pool).slice(0, limit);
    };

    if (!isSupabaseConfigured()) {
      return getMockRandom();
    }

    try {
      const supabase = createPublicSupabase();
      let query = supabase
        .from("articles")
        .select(CARD_COLUMNS)
        .eq("status", "published")
        .is("deleted_at", null)
        .limit(60);

      if (excludeSlug) {
        query = query.neq("slug", excludeSlug);
      }

      const { data, error } = await query;
      if (error) return getMockRandom();

      return shuffle((data ?? []).map(mapCardRow)).slice(0, limit);
    } catch {
      return getMockRandom();
    }
  }
);

/* ------------------------------------------------------------------ */
/* Admin: semua status, untuk halaman CRUD                             */
/* ------------------------------------------------------------------ */

const ARTICLE_ADMIN_COLUMNS =
  "id,title,slug,excerpt,content,cover_image_url,category_id,status,is_featured,is_pinned,pinned_order,published_at,scheduled_for,view_count,created_at,updated_at,categories(id,name,slug)";

type AdminArticleRow = Omit<Article, "author_id" | "deleted_at" | "category" | "tags"> & {
  category: ArticleCard["category"];
};

function mapAdminRow(row: unknown): AdminArticleRow {
  const r = row as Record<string, unknown>;
  const category =
    (r.categories as { id: string; name: string; slug: string } | null | undefined) ?? null;
  return {
    id: r.id as string,
    title: r.title as string,
    slug: r.slug as string,
    excerpt: (r.excerpt as string) ?? null,
    content: (r.content as string) ?? "",
    cover_image_url: (r.cover_image_url as string) ?? null,
    category_id: (r.category_id as string) ?? null,
    status: r.status as ArticleStatus,
    is_featured: (r.is_featured as boolean) ?? false,
    is_pinned: (r.is_pinned as boolean) ?? false,
    pinned_order: (r.pinned_order as number) ?? 0,
    published_at: (r.published_at as string) ?? null,
    scheduled_for: (r.scheduled_for as string) ?? null,
    view_count: (r.view_count as number) ?? 0,
    created_at: r.created_at as string,
    updated_at: r.updated_at as string,
    category,
  };
}

export async function adminListArticles(options?: {
  status?: ArticleStatus;
}): Promise<AdminArticleRow[]> {
  const supabase = await createServerSupabase();
  let query = supabase
    .from("articles")
    .select(ARTICLE_ADMIN_COLUMNS)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  if (options?.status) {
    query = query.eq("status", options.status);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapAdminRow);
}

export async function adminGetArticle(id: string): Promise<AdminArticleRow | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_ADMIN_COLUMNS)
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapAdminRow(data) : null;
}

export async function adminCreateArticle(
  input: ArticleCreateInput,
  authorId: string
): Promise<{ id: string }> {
  const supabase = await createServerSupabase();
  const slug = input.slug ?? slugify(input.title);

  const payload = {
    title: input.title,
    slug,
    excerpt: input.excerpt ?? null,
    content: input.content,
    cover_image_url: input.coverImageUrl ?? null,
    category_id: input.categoryId ?? null,
    author_id: authorId,
    status: input.status,
    is_featured: input.isFeatured,
    is_pinned: false,
    pinned_order: 0,
    view_count: 0,
    deleted_at: null,
    scheduled_for: input.scheduledFor ?? null,
    published_at: input.status === "published" ? new Date().toISOString() : null,
  };

  const { data, error } = await supabase.from("articles").insert(payload).select("id").single();

  if (error) throw new Error(error.message);
  return { id: data.id };
}

type AdminArticleUpdateInput = Omit<ArticleUpdateInput, "categoryId" | "status"> & {
  categoryId?: string | null | undefined;
  status?: ArticleStatus | undefined;
};

export async function adminUpdateArticle(
  id: string,
  input: AdminArticleUpdateInput
): Promise<void> {
  const supabase = await createServerSupabase();

  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title;
  if (input.slug !== undefined) patch.slug = input.slug;
  if (input.excerpt !== undefined) patch.excerpt = input.excerpt ?? null;
  if (input.content !== undefined) patch.content = input.content;
  if (input.coverImageUrl !== undefined) patch.cover_image_url = input.coverImageUrl ?? null;
  if (input.categoryId !== undefined) patch.category_id = input.categoryId ?? null;
  if (input.isFeatured !== undefined) patch.is_featured = input.isFeatured;
  if (input.scheduledFor !== undefined) patch.scheduled_for = input.scheduledFor ?? null;

  if (input.status !== undefined) {
    patch.status = input.status;

    const { data: current } = await supabase
      .from("articles")
      .select("status,published_at")
      .eq("id", id)
      .maybeSingle();

    const transitioningToPublished =
      input.status === "published" && current?.status !== "published";
    if (transitioningToPublished) {
      patch.published_at = new Date().toISOString();
    }
  }

  const { error } = await supabase.from("articles").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function adminSoftDeleteArticle(id: string): Promise<void> {
  const supabase = await createServerSupabase();
  const { error } = await supabase.rpc("admin_soft_delete_article", { p_id: id });
  if (error) throw new Error(error.message);
}
