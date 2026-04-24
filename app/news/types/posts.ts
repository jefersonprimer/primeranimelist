export interface Author {
  name: string;
  image: string;
  role: string;
}

export interface Post {
  id: string;
  title: string;
  summary: string;
  content: string;
  cover_image: string;
  tags: string[];
  category: string;
  slug: string;
  created_at: string;
  updated_at: string;
  author: Author;
  read_time: number;
}