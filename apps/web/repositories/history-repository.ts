import { cache } from "react";
import type { Figure, TimelineEvent } from "@mwcnu/types";
import { createPublicSupabase } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { MOCK_FIGURES, MOCK_TIMELINE } from "./mock-data";

export const listTimelineEvents = cache(async (): Promise<TimelineEvent[]> => {
  if (!isSupabaseConfigured()) {
    return MOCK_TIMELINE;
  }

  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("timeline_events")
      .select("*")
      .order("year_start", { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_TIMELINE;
    }

    return data as TimelineEvent[];
  } catch {
    return MOCK_TIMELINE;
  }
});

export const listFigures = cache(async (): Promise<Figure[]> => {
  if (!isSupabaseConfigured()) {
    return MOCK_FIGURES;
  }

  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("figures")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_FIGURES;
    }

    return data as Figure[];
  } catch {
    return MOCK_FIGURES;
  }
});
