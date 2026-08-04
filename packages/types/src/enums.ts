/* ------------------------------------------------------------------ */
/* Enum & Literal types (selaras dengan PostgreSQL enum di database)  */
/* ------------------------------------------------------------------ */

export type RoleName = "super_admin" | "admin" | "editor" | "viewer";
export type RoleLevel = 1 | 2 | 3 | 4;

export type ArticleStatus = "draft" | "published" | "scheduled" | "archived";
export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";
export type EventType = "kajian" | "rapat" | "peringatan" | "pelatihan" | "sosial";
export type AnnouncementType = "info" | "himbauan" | "peringatan";
export type MediaType = "image" | "video" | "audio" | "document" | "other";
export type DocumentCategory =
  | "khutbah"
  | "panduan"
  | "formulir"
  | "ad_art"
  | "sk"
  | "surat"
  | "notulen"
  | "laporan"
  | "lainnya";
export type DocumentVisibility = "public" | "internal";
export type LogLevel = "info" | "warning" | "error";
