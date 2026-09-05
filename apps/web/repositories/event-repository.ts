import { cache } from "react";
import type { EventCard } from "@mwcnu/types";
import { createPublicSupabase } from "@/lib/supabase/public";
import { MOCK_EVENTS } from "./mock-data";

const isSupabaseConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const listUpcomingEvents = cache(
  async (options?: { limit?: number }): Promise<EventCard[]> => {
    const limit = options?.limit ?? 6;

    if (!isSupabaseConfigured()) {
      return MOCK_EVENTS.slice(0, limit);
    }

    try {
      const supabase = createPublicSupabase();
      const { data, error } = await supabase
        .from("events")
        .select("id,title,slug,event_type,status,starts_at,ends_at,location,cover_image_url")
        .gte("starts_at", new Date().toISOString())
        .is("deleted_at", null)
        .order("starts_at", { ascending: true })
        .limit(limit);

      if (error) {
        return MOCK_EVENTS.slice(0, limit);
      }

      return (data ?? []) as EventCard[];
    } catch {
      return MOCK_EVENTS.slice(0, limit);
    }
  }
);
