import { cache } from "react";
import type { Institution } from "@mwcnu/types";
import { createPublicSupabase } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { MOCK_LEADERS, MOCK_INSTITUTIONS, type LeaderCardView } from "./mock-data";

export const listLeaders = cache(async (): Promise<LeaderCardView[]> => {
  if (!isSupabaseConfigured()) {
    return MOCK_LEADERS;
  }

  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("leaders")
      .select(
        "id,name,term_start,term_end,is_active,bio,photo_url,phone,email,sort_order,positions(title)"
      )
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_LEADERS;
    }

    return data.map((row) => {
      const r = row as Record<string, unknown>;
      const pos = (r.positions as { title: string } | null) ?? null;
      const title = pos?.title ?? "Pengurus";
      const isSyuriyah =
        title.toLowerCase().includes("rais") || title.toLowerCase().includes("syuriyah");

      return {
        id: r.id as string,
        profile_id: null,
        organization_id: "",
        position_id: null,
        name: r.name as string,
        term_start: (r.term_start as string) ?? "2026-01-01",
        term_end: (r.term_end as string) ?? "2030-12-31",
        is_active: (r.is_active as boolean) ?? true,
        bio: (r.bio as string) ?? null,
        photo_url: (r.photo_url as string) ?? null,
        phone: (r.phone as string) ?? null,
        email: (r.email as string) ?? null,
        sort_order: (r.sort_order as number) ?? 0,
        created_at: "",
        updated_at: "",
        position_title: title,
        category: isSyuriyah ? "Syuriyah" : "Tanfidziyah",
      };
    });
  } catch {
    return MOCK_LEADERS;
  }
});

export const listInstitutions = cache(async (): Promise<Institution[]> => {
  if (!isSupabaseConfigured()) {
    return MOCK_INSTITUTIONS;
  }

  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("institutions")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_INSTITUTIONS;
    }

    return data as Institution[];
  } catch {
    return MOCK_INSTITUTIONS;
  }
});
