/* ------------------------------------------------------------------ */
/* Entity rows — disesuaikan dengan skema `docs/08_DATABASE_DESIGN.md`  */
/* ------------------------------------------------------------------ */

import type {
  AnnouncementType,
  ArticleStatus,
  DocumentCategory,
  DocumentVisibility,
  EventStatus,
  EventType,
  LogLevel,
  MediaType,
  RoleLevel,
  RoleName,
} from "./enums";

export interface Role {
  id: string;
  name: RoleName;
  level: RoleLevel;
  description: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  category_id: string | null;
  author_id: string | null;
  status: ArticleStatus;
  is_featured: boolean;
  is_pinned: boolean;
  pinned_order: number;
  published_at: string | null;
  scheduled_for: string | null;
  view_count: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  tags?: Tag[];
}

export interface ArticleTag {
  article_id: string;
  tag_id: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  event_type: EventType;
  status: EventStatus;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  location_url: string | null;
  organizer: string | null;
  pic_name: string | null;
  pic_phone: string | null;
  cover_image_url: string | null;
  is_featured: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string | null;
  announcement_type: AnnouncementType;
  is_pinned: boolean;
  expires_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Album {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_media_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  storage_path: string;
  public_url: string | null;
  media_type: MediaType;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  uploaded_by: string | null;
  created_at: string;
}

export interface AlbumMedia {
  album_id: string;
  media_id: string;
  sort_order: number;
}

export interface Gallery {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  album_id: string | null;
}

export interface Document {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: DocumentCategory;
  visibility: DocumentVisibility;
  document_number: string | null;
  issued_date: string | null;
  subject: string | null;
  file_url: string;
  file_size_bytes: number | null;
  mime_type: string | null;
  version: number;
  related_article_id: string | null;
  related_event_id: string | null;
  download_count: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Download {
  id: string;
  document_id: string;
  downloaded_by: string | null;
  ip_hash: string | null;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  parent_id: string | null;
  kind: "mwcnu" | "lembaga" | "banom" | "unit";
  slug: string;
  description: string | null;
  logo_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Position {
  id: string;
  organization_id: string;
  title: string;
  sort_order: number;
}

export interface Leader {
  id: string;
  profile_id: string | null;
  organization_id: string;
  position_id: string | null;
  name: string;
  term_start: string | null;
  term_end: string | null;
  is_active: boolean;
  bio: string | null;
  photo_url: string | null;
  phone: string | null;
  email: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Institution {
  id: string;
  name: string;
  slug: string;
  abbreviation: string | null;
  description: string | null;
  category: "lembaga" | "banom";
  logo_url: string | null;
  website: string | null;
  chairman: string | null;
  contact_email: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  field: string | null;
  period: string | null;
  status: "planned" | "active" | "completed";
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProgramItem {
  id: string;
  program_id: string;
  title: string;
  description: string | null;
  progress: number;
  status: "planned" | "active" | "completed";
  target_date: string | null;
  sort_order: number;
}

export interface Sermon {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  speaker: string | null;
  series: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  view_count: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  media?: SermonMedia[];
}

export interface SermonMedia {
  id: string;
  sermon_id: string;
  media_type: MediaType;
  media_id: string | null;
  title: string | null;
  duration_seconds: number | null;
  sort_order: number;
}

export interface TimelineEvent {
  id: string;
  year_start: number;
  year_end: number | null;
  title: string;
  description: string | null;
  media_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Figure {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  category: "ulama" | "akademisi" | "pejabat" | "aktivis";
  birth_place: string | null;
  birth_year: number | null;
  death_year: number | null;
  bio: string | null;
  photo_url: string | null;
  quote: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Mosque {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  village: string | null;
  latitude: number | null;
  longitude: number | null;
  imam_name: string | null;
  khatib_name: string | null;
  contact_phone: string | null;
  capacity: number | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  start_at: string | null;
  end_at: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  meta_description: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  level: LogLevel;
  ip_hash: string | null;
  created_at: string;
}
