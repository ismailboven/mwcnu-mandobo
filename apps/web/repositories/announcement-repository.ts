import { cache } from "react";
import type { Announcement } from "@mwcnu/types";
import { createPublicSupabase } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { MOCK_ANNOUNCEMENTS } from "./mock-data";

export const listAnnouncements = cache(
  async (options?: { limit?: number }): Promise<Announcement[]> => {
    const limit = options?.limit ?? 10;

    if (!isSupabaseConfigured()) {
      return MOCK_ANNOUNCEMENTS.slice(0, limit);
    }

    try {
      const supabase = createPublicSupabase();
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error || !data || data.length === 0) {
        return MOCK_ANNOUNCEMENTS.slice(0, limit);
      }

      return data as Announcement[];
    } catch {
      return MOCK_ANNOUNCEMENTS.slice(0, limit);
    }
  }
);
