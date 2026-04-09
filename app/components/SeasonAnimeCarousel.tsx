import { listAnimeBySeasonYear, type AnimeSeason } from "@/lib/services/anime.service";
import { AnimeCard } from "./AnimeCard";
import { CarouselContainer } from "./CarouselContainer";

function getCurrentSeason(date = new Date()): AnimeSeason {
  const month = date.getMonth(); // 0-11
  if (month <= 2) return "winter";
  if (month <= 5) return "spring";
  if (month <= 8) return "summer";
  return "fall";
}

type SeasonAnimeCarouselProps = {
  title: string;
  limit?: number;
};

export async function SeasonAnimeCarousel({ title, limit = 15 }: SeasonAnimeCarouselProps) {
  const year = new Date().getFullYear();
  const season = getCurrentSeason();

  const { items: animeList } = await listAnimeBySeasonYear({ season, year, limit });

  if (animeList.length === 0) return null;

  return (
    <section className="w-full max-w-7xl px-6 py-10 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{title}</h2>
        <a
          href={`/anime/season/${year}/${encodeURIComponent(season)}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          View All
        </a>
      </div>

      <CarouselContainer>
        {animeList.map((anime) => (
          <div key={anime.malId} className="snap-start shrink-0 w-36 sm:w-44 lg:w-48">
            <AnimeCard malId={anime.malId} title={anime.title} imageUrl={anime.imageUrl} />
          </div>
        ))}
      </CarouselContainer>
    </section>
  );
}

