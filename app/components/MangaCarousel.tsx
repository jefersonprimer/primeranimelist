import { listManga, TopMangaFilter } from "@/lib/services/manga.service";
import { MangaCard } from "./MangaCard";
import { MangaCarouselContainer } from "./MangaCarouselContainer";
import Link from "next/link";
import { ArrowBigLeftIcon, ArrowBigRight } from "lucide-react";

interface MangaCarouselProps {
  title: string;
  filter: TopMangaFilter;
}

export async function MangaCarousel({ title, filter }: MangaCarouselProps) {
  const { items: mangaList } = await listManga({ limit: 15, filter });

  if (mangaList.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-zinc-50 py-20 dark:bg-zinc-950/40">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
      
      {/* Header Container - Restricted to max-w-7xl for alignment */}
      <div className="relative z-20 max-w-7xl px-6 mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="relative">
            <div className="absolute -left-4 -top-6 h-12 w-12 bg-indigo-600/10 dark:bg-indigo-400/10 rounded-full blur-2xl" />
            <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400 mb-2">
              Hot Collection
            </span>
            <h2 className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase italic leading-none">
              {title}
            </h2>
            <div className="mt-4 flex gap-1">
              <div className="h-1.5 w-12 bg-indigo-600" />
              <div className="h-1.5 w-4 bg-zinc-900 dark:bg-zinc-100" />
              <div className="h-1.5 w-2 bg-zinc-300 dark:bg-zinc-700" />
            </div>
          </div>
          
          <Link 
            href={`/manga/top?filter=${filter}`} 
            className="group inline-flex items-center gap-4 bg-zinc-900 dark:bg-zinc-100 px-6 py-3 text-xs font-black uppercase tracking-widest text-white dark:text-black transition-all hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white"
          >
            Explore All
            <span className="transition-transform group-hover:translate-x-1">
              <ArrowBigRight size={20}/>
            </span>
          </Link>
        </div>
      </div>
      
      {/* Carousel Container - Full width with internal dynamic padding */}
      <div className="relative z-10 w-full">
        <MangaCarouselContainer>
          {mangaList.map((manga, index) => (
            <div key={manga.malId} className="snap-start shrink-0 w-[160px] sm:w-[200px] lg:w-[220px]">
              <MangaCard
                malId={manga.malId}
                title={manga.title}
                imageUrl={manga.imageUrl}
                score={manga.score}
                type={manga.type}
                chapters={manga.chapters}
                volumes={manga.volumes}
                rank={index + 1}
              />
            </div>
          ))}
        </MangaCarouselContainer>
      </div>
    </section>
  );
}
