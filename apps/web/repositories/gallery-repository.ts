import { cache } from "react";
import { createPublicSupabase } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { MOCK_GALLERIES, type GalleryAlbumView } from "./mock-data";

export const listAlbums = cache(
  async (options?: { limit?: number }): Promise<GalleryAlbumView[]> => {
    const limit = options?.limit ?? 12;

    if (!isSupabaseConfigured()) {
      return MOCK_GALLERIES.slice(0, limit);
    }

    try {
      const supabase = createPublicSupabase();
      const { data, error } = await supabase
        .from("albums")
        .select("id,title,slug,description,cover_media_id,created_at")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error || !data || data.length === 0) {
        return MOCK_GALLERIES.slice(0, limit);
      }

      const rows = data as unknown as {
        id: string;
        title: string;
        slug: string;
        description: string | null;
      }[];

      // Map album rows to GalleryAlbumView format with fallback cover
      return rows.map((album) => ({
        id: album.id,
        title: album.title,
        slug: album.slug,
        description: album.description ?? "",
        cover_url:
          "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
        photo_count: 6,
        items: [],
      }));
    } catch {
      return MOCK_GALLERIES.slice(0, limit);
    }
  }
);
