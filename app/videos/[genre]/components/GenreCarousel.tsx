import { listAnimeByGenre } from "@/lib/services/anime.service";
import { GenreSection } from "./GenreSection";

interface GenreCarouselProps {
  genreSlug: string;
  label: string;
}

export async function GenreCarousel({ genreSlug, label }: GenreCarouselProps) {
  const result = await listAnimeByGenre({ genreName: label, limit: 12 });

  if (result.items.length === 0) {
    return null;
  }

  return (
    <GenreSection
      title={`${label} Anime`}
      subtitle={`Browse the top ${label.toLowerCase()} anime.`}
      href={`/videos/${genreSlug}`}
      anime={result.items}
    />
  );
}
