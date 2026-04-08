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
    <section className="w-full max-w-7xl px-6 py-10 mx-auto">
      <div className="flex items-center justify-between mb-6">
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
          <div key={anime.malId} className="snap-start shrink-0 w-36 sm:w-44 lg:w-48">
            <AnimeCard
              malId={anime.malId}
              title={anime.title}
              imageUrl={anime.imageUrl}
            />
          </div>
        ))}
      </CarouselContainer>
    </section>
  );
}
