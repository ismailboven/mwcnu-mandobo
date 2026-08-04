/* ------------------------------------------------------------------ */
/* View models — bentuk data yang dikonsumsi UI                        */
/* ------------------------------------------------------------------ */

import type { Article, Category, Event, Tag } from "./entities";

export interface CategoryRef {
  id: string;
  name: string;
  slug: string;
}

export interface ArticleCard {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category_id: string | null;
  published_at: string | null;
  view_count: number | null;
  category?: CategoryRef | null;
}

export interface ArticleDetail extends Article {
  category: Category | null;
  tags: Tag[];
}

export interface EventCard {
  id: string;
  title: string;
  slug: string;
  event_type: Event["event_type"];
  status: Event["status"];
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  cover_image_url: string | null;
}

export interface SermonCard {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  speaker: string | null;
  series: string | null;
  cover_image_url: string | null;
  published_at: string | null;
}

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface SearchGroup<T> {
  total: number;
  items: T[];
}

export interface SearchResults {
  query: string;
  total: number;
  groups: {
    articles: SearchGroup<ArticleCard>;
    events: SearchGroup<EventCard>;
    sermons: SearchGroup<SermonCard>;
  };
}
