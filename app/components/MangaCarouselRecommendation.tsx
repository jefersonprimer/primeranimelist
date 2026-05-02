import { listMangaByGenre } from "@/lib/services/manga.service";
import { CarouselContainer } from "./CarouselContainer";
import { MangaCard } from "./MangaCard";

interface MangaCarouselRecommendationProps {
  title?: string;
  genreNames: string[];
  currentMalId: number;
}

export async function MangaCarouselRecommendation({
  title = "Recommended from the same genre",
  genreNames,
  currentMalId,
}: MangaCarouselRecommendationProps) {
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
      listMangaByGenre({
        genreName,
        limit: 20,
        sort: "popular_newest",
      }),
    ),
  );

  const recommendationMap = new Map<
    number,
    {
      item: (typeof genreResults)[number]["items"][number];
      genreMatches: number;
    }
  >();

  for (const result of genreResults) {
    for (const row of result.items) {
      if (row.malId === currentMalId) continue;

      const existing = recommendationMap.get(row.malId);
      if (existing) {
        existing.genreMatches += 1;
      } else {
        recommendationMap.set(row.malId, { item: row, genreMatches: 1 });
      }
    }
  }

  const recommendationList = Array.from(recommendationMap.values())
    .sort((a, b) => {
      if (a.genreMatches !== b.genreMatches) {
        return b.genreMatches - a.genreMatches;
      }

      const aPopularity = Number.isFinite(a.item.popularity)
        ? (a.item.popularity ?? Number.MAX_SAFE_INTEGER)
        : Number.MAX_SAFE_INTEGER;
      const bPopularity = Number.isFinite(b.item.popularity)
        ? (b.item.popularity ?? Number.MAX_SAFE_INTEGER)
        : Number.MAX_SAFE_INTEGER;
      if (aPopularity !== bPopularity) {
        return aPopularity - bPopularity;
      }

      const aPublishedFrom = a.item.publishedFrom ? a.item.publishedFrom.getTime() : 0;
      const bPublishedFrom = b.item.publishedFrom ? b.item.publishedFrom.getTime() : 0;
      if (aPublishedFrom !== bPublishedFrom) {
        return bPublishedFrom - aPublishedFrom;
      }

      const aMembers = a.item.members ?? 0;
      const bMembers = b.item.members ?? 0;
      if (aMembers !== bMembers) {
        return bMembers - aMembers;
      }

      return a.item.title.localeCompare(b.item.title);
    })
    .slice(0, 15)
    .map((entry) => entry.item);

  if (recommendationList.length === 0) return null;

  return (
    <section className="w-full overflow-hidden py-4">
      <div className="mx-auto mb-5 flex max-w-7xl items-center justify-between px-6">
        <h2 className="text-[28px] font-bold text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
      </div>

      <CarouselContainer>
        {recommendationList.map((m) => (
          <div
            key={m.malId}
            className="w-[140px] shrink-0 snap-start sm:w-[180px] md:w-[190px] lg:w-[227.2px]"
          >
            <MangaCard
              malId={m.malId}
              title={m.title}
              imageUrl={m.imageUrl}
              score={m.score}
              type={m.type}
              chapters={m.chapters}
              volumes={m.volumes}
            />
          </div>
        ))}
      </CarouselContainer>
    </section>
  );
}
