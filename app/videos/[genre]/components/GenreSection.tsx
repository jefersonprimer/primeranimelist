import Link from "next/link";
import { AnimeCardCompact } from "@/app/components/AnimeCardCompact";
import { CarouselContainer } from "@/app/components/CarouselContainer";

export type GenreAnime = {
  id: number;
  malId: number;
  title: string;
  imageUrl: string | null;
  rating: string | null;
  score: number | null;
  members: number | null;
  episodes: number | null;
  synopsis: string | null;
};

export function GenreSection({
  title,
  subtitle,
  href,
  anime,
}: {
  title: string;
  subtitle: string;
  href: string;
  anime: GenreAnime[];
}) {
  if (anime.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-4">
      <div className="mx-auto mb-5 flex max-w-7xl items-end justify-between gap-4 px-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-[28px] font-bold text-zinc-900 dark:text-zinc-50">
            {title}
          </h2>
          <p className="text-sm text-zinc-400">{subtitle}</p>
        </div>

        <Link
          href={href}
          className="rounded-full border border-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
        >
          View all
        </Link>
      </div>

      <CarouselContainer>
        {anime.map((entry) => (
          <div
            key={entry.malId}
            className="w-[190px] shrink-0 snap-start md:w-[180px]"
          >
            <AnimeCardCompact
              malId={entry.malId}
              title={entry.title}
              imageUrl={entry.imageUrl}
              rating={entry.rating}
              score={entry.score}
              members={entry.members}
              episodes={entry.episodes}
              synopsis={entry.synopsis}
            />
          </div>
        ))}
      </CarouselContainer>
    </section>
  );
}
