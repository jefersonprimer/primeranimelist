import Link from "next/link";
import { AnimeCard } from "@/app/components/AnimeCard";
import { CarouselContainer } from "@/app/components/CarouselContainer";
import type { GenreDefinition } from "../genre-config";

type GenreAnime = {
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

interface GenreOverviewPageProps {
  genre: string;
  genreInfo: GenreDefinition;
  popularAnime: GenreAnime[];
  newestAnime: GenreAnime[];
}

function GenreSection({
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
            className="w-[140px] shrink-0 snap-start sm:w-[180px] md:w-[190px] lg:w-[227.2px]"
          >
            <AnimeCard
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

export default function GenreOverviewPage({
  genre,
  genreInfo,
  popularAnime,
  newestAnime,
}: GenreOverviewPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-15">
      <section className="rounded-[32px] border border-zinc-800 bg-zinc-950/70 px-6 py-8">
        <div className="flex max-w-3xl flex-col gap-4">
          <span className="w-fit rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">
            Genre
          </span>
          <h1 className="text-4xl font-semibold text-zinc-50">
            {genreInfo.label} Anime
          </h1>
          <p className="text-base leading-7 text-zinc-300">
            {genreInfo.description}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/videos/${genre}/popular`}
              className="rounded-full border border-orange-500 bg-orange-500 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-orange-400"
            >
              Most Popular
            </Link>
            <Link
              href={`/videos/${genre}/new`}
              className="rounded-full border border-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
            >
              Newest
            </Link>
          </div>
        </div>
      </section>

      <GenreSection
        title={`Popular ${genreInfo.label} Anime`}
        subtitle="The highest-ranked anime titles in this genre in the current database."
        href={`/videos/${genre}/popular`}
        anime={popularAnime}
      />

      <GenreSection
        title={`Newest ${genreInfo.label} Anime`}
        subtitle="Recently released anime titles tagged with this genre."
        href={`/videos/${genre}/new`}
        anime={newestAnime}
      />

      {popularAnime.length === 0 && newestAnime.length === 0 ? (
        <p className="rounded-2xl border border-zinc-800 bg-zinc-950/70 px-6 py-8 text-center text-zinc-400">
          No anime titles found for this genre yet.
        </p>
      ) : null}
    </div>
  );
}
