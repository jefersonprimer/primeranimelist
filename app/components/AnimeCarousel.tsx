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
    <section className="w-full py-10 overflow-hidden">
      <div className="max-w-7xl px-6 mx-auto flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{title}</h2>
        <a 
          href={`/anime/top?filter=${filter}`} 
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          View All
        </a>
      </div>
      
      <CarouselContainer>
        {animeList.map((anime) => (
          <div 
            key={anime.malId} 
            className="snap-start shrink-0 w-[280px] sm:w-[220px] md:w-[210px] lg:w-[227.2px]"
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
