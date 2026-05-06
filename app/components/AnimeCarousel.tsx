import { listAnime, TopAnimeFilter } from "@/lib/services/anime.service";
import { AnimeCard } from "./AnimeCard";
import { CarouselContainer } from "./CarouselContainer";

interface AnimeCarouselProps {
  title: string;
  filter: TopAnimeFilter;
}

export async function AnimeCarousel({ title, filter }: AnimeCarouselProps) {
  const { items: animeList } = await listAnime({ limit: 15, filter });

  if (animeList.length === 0) return null;

  return (
    <section className="w-full py-4 overflow-hidden">
      <div className="max-w-7xl px-6 mx-auto flex items-center justify-between mb-4 sm:mb-5">
        <h2 className="text-[20px] sm:text-[28px] font-bold text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
      </div>

      <CarouselContainer>
        {animeList.map((anime) => (
          <div
            key={anime.malId}
            className="snap-start shrink-0 w-[190px] sm:w-[180px] md:w-[190px] lg:w-[227.2px]"
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
