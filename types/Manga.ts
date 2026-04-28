import { AnimeImage, AnimeTitle, AnimeRelation } from "./Anime";

export interface Manga {
  mal_id: number;
  url: string;
  images: {
    jpg: AnimeImage;
    webp: AnimeImage;
  };
  approved: boolean;
  titles: AnimeTitle[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: string | null;
  chapters: number | null;
  volumes: number | null;
  status: string | null;
  publishing: boolean;
  published: {
    from: string | null;
    to: string | null;
    prop: {
      from: { day: number | null; month: number | null; year: number | null };
      to: { day: number | null; month: number | null; year: number | null };
    };
    string: string | null;
  };
  score: number | null;
  scored: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  synopsis: string | null;
  background: string | null;
  authors: AnimeRelation[];
  serializations: AnimeRelation[];
  genres: AnimeRelation[];
  explicit_genres: AnimeRelation[];
  themes: AnimeRelation[];
  demographics: AnimeRelation[];
}
