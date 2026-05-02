import { listAnimeByGenre } from "@/lib/services/anime.service";
import { AnimeCard } from "./AnimeCard";
import { CarouselContainer } from "./CarouselContainer";

interface AnimeCarouselRecommendationProps {
  title?: string;
  genreNames: string[];
  currentMalId: number;
}

export async function AnimeCarouselRecommendation({
  title = "Recommended from the same genre",
  genreNames,
  currentMalId,
}: AnimeCarouselRecommendationProps) {
  const normalizedGenres = Array.from(
    new Set(
      genreNames
        .map((genre) => genre.trim())
        .filter((genre) => genre.length > 0),
    ),
  );

  if (normalizedGenres.length === 0) return null;

  const genreResults = await Promise.all(
    normalizedGenres.map((genreName) =>
      listAnimeByGenre({
        genreName,
        limit: 20,
        sort: "popular_newest",
      }),
    ),
  );

  const recommendationMap = new Map<
    number,
    {
      anime: (typeof genreResults)[number]["items"][number];
      genreMatches: number;
    }
  >();

  for (const result of genreResults) {
    for (const anime of result.items) {
      if (anime.malId === currentMalId) continue;

      const existing = recommendationMap.get(anime.malId);
      if (existing) {
        existing.genreMatches += 1;
      } else {
        recommendationMap.set(anime.malId, { anime, genreMatches: 1 });
      }
    }
  }

  const recommendationList = Array.from(recommendationMap.values())
    .sort((a, b) => {
      if (a.genreMatches !== b.genreMatches) {
        return b.genreMatches - a.genreMatches;
      }

      const aPopularity = Number.isFinite(a.anime.popularity)
        ? (a.anime.popularity ?? Number.MAX_SAFE_INTEGER)
        : Number.MAX_SAFE_INTEGER;
      const bPopularity = Number.isFinite(b.anime.popularity)
        ? (b.anime.popularity ?? Number.MAX_SAFE_INTEGER)
        : Number.MAX_SAFE_INTEGER;
      if (aPopularity !== bPopularity) {
        return aPopularity - bPopularity;
      }

      const aAiredFrom = a.anime.airedFrom ? a.anime.airedFrom.getTime() : 0;
      const bAiredFrom = b.anime.airedFrom ? b.anime.airedFrom.getTime() : 0;
      if (aAiredFrom !== bAiredFrom) {
        return bAiredFrom - aAiredFrom;
      }

      const aYear = a.anime.year ?? 0;
      const bYear = b.anime.year ?? 0;
      if (aYear !== bYear) {
        return bYear - aYear;
      }

      const aMembers = a.anime.members ?? 0;
      const bMembers = b.anime.members ?? 0;
      if (aMembers !== bMembers) {
        return bMembers - aMembers;
      }

      return a.anime.title.localeCompare(b.anime.title);
    })
    .slice(0, 15)
    .map((entry) => entry.anime);

  if (recommendationList.length === 0) return null;

  return (
    <section className="w-full py-4 overflow-hidden">
      <div className="max-w-7xl px-6 mx-auto flex items-center justify-between mb-5">
        <h2 className="text-[28px] font-bold text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
      </div>

      <CarouselContainer>
        {recommendationList.map((anime) => (
          <div
            key={anime.malId}
            className="w-[140px] shrink-0 snap-start sm:w-[180px] md:w-[190px] lg:w-[227.2px]"
          >
            <AnimeCard
              malId={anime.malId}
              title={anime.title}
              imageUrl={anime.imageUrl}
              rating={anime.rating}
              score={anime.score}
              members={anime.members}
              episodes={anime.episodes}
              synopsis={anime.synopsis}
            />
          </div>
        ))}
      </CarouselContainer>
    </section>
  );
}
