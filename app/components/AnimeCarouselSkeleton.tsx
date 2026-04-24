import { AnimeCardSkeleton } from "./AnimeCardSkeleton";
import { CarouselContainer } from "./CarouselContainer";

interface AnimeCarouselSkeletonProps {
  title: string;
}

export function AnimeCarouselSkeleton({ title }: AnimeCarouselSkeletonProps) {
  return (
    <section className="w-full py-4 overflow-hidden">
      <div className="max-w-7xl px-6 mx-auto flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
      </div>

      <CarouselContainer>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="snap-start shrink-0 w-[280px] sm:w-[220px] md:w-[210px] lg:w-[227.2px]"
          >
            <AnimeCardSkeleton />
          </div>
        ))}
      </CarouselContainer>
    </section>
  );
}
