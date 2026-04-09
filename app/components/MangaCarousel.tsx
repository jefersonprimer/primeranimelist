import { listManga, TopMangaFilter } from "@/lib/services/manga.service";
import { MangaCard } from "./MangaCard";
import { CarouselContainer } from "./CarouselContainer";

interface MangaCarouselProps {
  title: string;
  filter: TopMangaFilter;
}

export async function MangaCarousel({ title, filter }: MangaCarouselProps) {
  const { items: mangaList } = await listManga({ limit: 15, filter });

  if (mangaList.length === 0) return null;

  return (
    <section className="w-full max-w-7xl px-6 py-10 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{title}</h2>
        <a 
          href={`/manga/top?filter=${filter}`} 
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          View All
        </a>
      </div>
      
      <CarouselContainer>
        {mangaList.map((manga) => (
          <div key={manga.malId} className="snap-start shrink-0 w-36 sm:w-44 lg:w-48">
            <MangaCard
              malId={manga.malId}
              title={manga.title}
              imageUrl={manga.imageUrl}
            />
          </div>
        ))}
      </CarouselContainer>
    </section>
  );
}
