/* ------------------------------------------------------------------ */
/* Tipe Database untuk generic @supabase/supabase-js.                  */
/* Sementara sampai di-generate via `supabase gen types` (pnpm db:typegen). */
/* ------------------------------------------------------------------ */

import type {
  ActivityLog,
  Announcement,
  Article,
  ArticleTag,
  Banner,
  Category,
  Document,
  Event,
  Institution,
  Leader,
  Media,
  Organization,
  Page,
  Position,
  Profile,
  Program,
  ProgramItem,
  Role,
  Sermon,
  Tag,
  UserRole,
} from "./entities";
import type {
  AnnouncementType,
  ArticleStatus,
  DocumentCategory,
  DocumentVisibility,
  EventStatus,
  EventType,
  LogLevel,
  MediaType,
  RoleName,
} from "./enums";

type InsertInput<T> = Omit<T, "id" | "created_at" | "updated_at"> &
  Partial<Pick<T, Extract<"id" | "created_at" | "updated_at", keyof T>>>;

type UpdateInput<T> = Partial<Omit<T, "id">>;

type Table<T> = {
  Row: T & Record<string, unknown>;
  Insert: InsertInput<T> & Record<string, unknown>;
  Update: UpdateInput<T> & Record<string, unknown>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<Profile>;
      roles: Table<Role>;
      user_roles: Table<UserRole>;
      articles: Table<Article>;
      categories: Table<Category>;
      tags: Table<Tag>;
      article_tags: Table<ArticleTag>;
      events: Table<Event>;
      announcements: Table<Announcement>;
      media: Table<Media>;
      documents: Table<Document>;
      organizations: Table<Organization>;
      positions: Table<Position>;
      leaders: Table<Leader>;
      institutions: Table<Institution>;
      programs: Table<Program>;
      program_items: Table<ProgramItem>;
      sermons: Table<Sermon>;
      banners: Table<Banner>;
      pages: Table<Page>;
      activity_logs: Table<ActivityLog>;
    };
    Views: Record<string, never>;
    Functions: {
      admin_soft_delete_article: {
        Args: { p_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      role_name: RoleName;
      article_status: ArticleStatus;
      event_status: EventStatus;
      event_type: EventType;
      announcement_type: AnnouncementType;
      media_type: MediaType;
      document_category: DocumentCategory;
      document_visibility: DocumentVisibility;
      log_level: LogLevel;
    };
    CompositeTypes: Record<string, never>;
  };
};
