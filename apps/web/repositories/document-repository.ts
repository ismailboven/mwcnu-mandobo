import { cache } from "react";
import type { Document, DocumentCategory } from "@mwcnu/types";
import { createPublicSupabase } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { MOCK_DOCUMENTS } from "./mock-data";

export const listPublishedDocuments = cache(
  async (options?: {
    category?: DocumentCategory | "all" | undefined;
    limit?: number;
  }): Promise<Document[]> => {
    const limit = options?.limit ?? 50;
    const category = options?.category;

    const getFilteredMock = () => {
      if (!category || category === "all") {
        return MOCK_DOCUMENTS.slice(0, limit);
      }
      return MOCK_DOCUMENTS.filter((doc) => doc.category === category).slice(0, limit);
    };

    if (!isSupabaseConfigured()) {
      return getFilteredMock();
    }

    try {
      const supabase = createPublicSupabase();
      let query = supabase
        .from("documents")
        .select("*")
        .eq("visibility", "public")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (category && category !== "all") {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error || !data || data.length === 0) {
        return getFilteredMock();
      }

      return data as Document[];
    } catch {
      return getFilteredMock();
    }
  }
);
