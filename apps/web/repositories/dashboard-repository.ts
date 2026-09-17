import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export interface AdminDashboardStats {
  articleCount: number;
  eventCount: number;
  documentCount: number;
  leaderCount: number;
  categoryCount: number;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  if (!isSupabaseConfigured()) {
    return {
      articleCount: 6,
      eventCount: 4,
      documentCount: 4,
      leaderCount: 5,
      categoryCount: 5,
    };
  }

  try {
    const supabase = await createServerSupabase();

    const [articles, events, documents, leaders, categories] = await Promise.all([
      supabase.from("articles").select("id", { count: "exact", head: true }).is("deleted_at", null),
      supabase.from("events").select("id", { count: "exact", head: true }).is("deleted_at", null),
      supabase
        .from("documents")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null),
      supabase.from("leaders").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase
        .from("categories")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),
    ]);

    return {
      articleCount: articles.count ?? 0,
      eventCount: events.count ?? 0,
      documentCount: documents.count ?? 0,
      leaderCount: leaders.count ?? 0,
      categoryCount: categories.count ?? 0,
    };
  } catch {
    return {
      articleCount: 6,
      eventCount: 4,
      documentCount: 4,
      leaderCount: 5,
      categoryCount: 5,
    };
  }
}
