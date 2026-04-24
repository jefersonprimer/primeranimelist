export interface Author {
  name: string;
  image: string;
  role: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  cover_image_url: string | null;
  content_markdown: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // Legacy fields (from old external API) — kept optional for compatibility
  summary?: string;
  cover_image?: string;
  tags?: string[];
  author?: Author;
  read_time?: number;
}