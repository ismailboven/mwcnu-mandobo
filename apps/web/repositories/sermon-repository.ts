import { cache } from "react";
import type { Sermon } from "@mwcnu/types";
import { createPublicSupabase } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { MOCK_SERMONS } from "./mock-data";

export const listPublishedSermons = cache(
  async (options?: { limit?: number }): Promise<Sermon[]> => {
    const limit = options?.limit ?? 12;

    if (!isSupabaseConfigured()) {
      return MOCK_SERMONS.slice(0, limit);
    }

    try {
      const supabase = createPublicSupabase();
      const { data, error } = await supabase
        .from("sermons")
        .select("*")
        .is("deleted_at", null)
        .order("published_at", { ascending: false })
        .limit(limit);

      if (error || !data || data.length === 0) {
        return MOCK_SERMONS.slice(0, limit);
      }

      return data as Sermon[];
    } catch {
      return MOCK_SERMONS.slice(0, limit);
    }
  }
);
