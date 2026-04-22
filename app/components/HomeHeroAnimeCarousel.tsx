import { listAnime } from "@/lib/services/anime.service";
import { HomeHeroAnimeCarouselClient } from "./HomeHeroAnimeCarouselClient";

function normalizeGenres(rawGenres: unknown): string[] {
  if (!Array.isArray(rawGenres)) {
    return [];
  }

  return rawGenres
    .map((genre) => {
      if (typeof genre === "string") {
        return genre.trim();
      }

      if (
        genre &&
        typeof genre === "object" &&
        "name" in genre &&
        typeof genre.name === "string"
      ) {
        return genre.name.trim();
      }

      return "";
    })
    .filter((genre) => genre.length > 0);
}

export async function HomeHeroAnimeCarousel() {
  const { items } = await listAnime({ filter: "airing", limit: 24 });

  const heroItems = items
    .filter(
      (anime) =>
        anime.isAiring &&
        (anime.imageThumbnail || anime.imageUrl || anime.imageBannerDesktop)
    )
    .slice(0, 6)
    .map((anime) => ({
      malId: anime.malId,
      title: anime.title,
      thumbnail: (anime.imageThumbnail ||
        anime.imageUrl ||
        anime.imageBannerDesktop) as string,
      logo: anime.imageLogo,
      rating: anime.rating,
      genres: normalizeGenres(anime.genres),
      synopsis: anime.synopsis,
    }));

  if (heroItems.length === 0) {
    return null;
  }

  return <HomeHeroAnimeCarouselClient items={heroItems} />;
}
