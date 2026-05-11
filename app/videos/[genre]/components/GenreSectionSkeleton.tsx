import { AnimeCardSkeleton } from "@/app/components/AnimeCardSkeleton";
import { CarouselContainer } from "@/app/components/CarouselContainer";

interface GenreSectionSkeletonProps {
  title: string;
}

export function GenreSectionSkeleton({ title }: GenreSectionSkeletonProps) {
  return (
    <section className="w-full py-4">
      <div className="mx-auto mb-5 flex max-w-7xl items-end justify-between gap-4 px-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-[28px] font-bold text-zinc-900 dark:text-zinc-50">
            {title}
          </h2>
          <div className="h-4 w-48 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>

      <CarouselContainer>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="w-[190px] shrink-0 snap-start md:w-[180px]"
          >
            <AnimeCardSkeleton />
          </div>
        ))}
      </CarouselContainer>
    </section>
  );
}
