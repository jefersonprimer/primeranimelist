export interface Author {
  name: string;
  avatar: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image: string;
  date: string;
  category: string;
  author: Author;
} 