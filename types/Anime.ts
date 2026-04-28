export interface AnimeImage {
  image_url: string | null;
  small_image_url: string | null;
  large_image_url: string | null;
}

export interface AnimeTrailer {
  youtube_id: string | null;
  url: string | null;
  embed_url: string | null;
  images: {
    image_url: string | null;
    small_image_url: string | null;
    medium_image_url: string | null;
    large_image_url: string | null;
    maximum_image_url: string | null;
  };
}

export interface AnimeTitle {
  type: string;
  title: string;
}

export interface AnimeRelation {
  mal_id: number | null;
  type: string;
  name: string;
  url: string | null;
}

export interface Anime {
  mal_id: number;
  url: string;
  images: {
    jpg: AnimeImage;
    webp: AnimeImage;
  };
  trailer: AnimeTrailer;
  approved: boolean;
  titles: AnimeTitle[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: string | null;
  source: string | null;
  episodes: number | null;
  status: string | null;
  airing: boolean;
  aired: {
    from: string | null;
    to: string | null;
    prop: {
      from: { day: number | null; month: number | null; year: number | null };
      to: { day: number | null; month: number | null; year: number | null };
    };
    string: string | null;
  };
  duration: string | null;
  rating: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  synopsis: string | null;
  background: string | null;
  season: string | null;
  year: number | null;
  broadcast: {
    day: string | null;
    time: string | null;
    timezone: string | null;
    string: string | null;
  };
  producers: AnimeRelation[];
  licensors: AnimeRelation[];
  studios: AnimeRelation[];
  genres: AnimeRelation[];
  explicit_genres: AnimeRelation[];
  themes: AnimeRelation[];
  demographics: AnimeRelation[];
  image_banner_desktop: string | null;
  image_banner_mobile: string | null;
  image_logo: string | null;
  image_thumbnail: string | null;
  image_card_compact: string | null;
}
