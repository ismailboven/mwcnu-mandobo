import { cache } from "react";
import { createPublicSupabase } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { MOCK_PROGRAMS, type ProgramWithItems } from "./mock-data";

export const listPrograms = cache(async (): Promise<ProgramWithItems[]> => {
  if (!isSupabaseConfigured()) {
    return MOCK_PROGRAMS;
  }

  try {
    const supabase = createPublicSupabase();
    const { data, error } = await supabase
      .from("programs")
      .select("*, program_items(*)")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_PROGRAMS;
    }

    return data.map((row) => {
      const r = row as Record<string, unknown>;
      const items = (r.program_items as ProgramWithItems["items"]) ?? [];
      return {
        id: r.id as string,
        title: r.title as string,
        slug: r.slug as string,
        description: (r.description as string) ?? null,
        field: (r.field as string) ?? null,
        period: (r.period as string) ?? null,
        status: (r.status as "planned" | "active" | "completed") ?? "active",
        sort_order: (r.sort_order as number) ?? 0,
        created_at: (r.created_at as string) ?? "",
        updated_at: (r.updated_at as string) ?? "",
        items,
      };
    });
  } catch {
    return MOCK_PROGRAMS;
  }
});
