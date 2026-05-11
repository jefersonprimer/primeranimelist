import { Suspense } from "react";
import type { GenreDefinition } from "../genre-config";
import { GENRE_DEFINITIONS } from "../genre-config";
import { GenreSection, type GenreAnime } from "./GenreSection";
import { GenreCarousel } from "./GenreCarousel";
import { GenreSectionSkeleton } from "./GenreSectionSkeleton";

interface GenreOverviewPageProps {
  genre: string;
  genreInfo: GenreDefinition;
  popularAnime: GenreAnime[];
  newestAnime: GenreAnime[];
}

export default function GenreOverviewPage({
  genre,
  genreInfo,
  popularAnime,
  newestAnime,
}: GenreOverviewPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-15">
      <section className="flex flex-col items-center justify-center">
        <div className="flex max-w-3xl flex-col">
          <h1 className="text-center text-[22px] sm:text-[28px] font-bold text-zinc-50">
            {genreInfo.label}
          </h1>
          <p className="text-sm font-normal leading-7 text-zinc-300">
            {genreInfo.description}
          </p>
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

      <div className="flex flex-col gap-10">
        {Object.entries(GENRE_DEFINITIONS).map(([slug, def]) => {
          if (slug === genre) return null;
          return (
            <Suspense
              key={slug}
              fallback={<GenreSectionSkeleton title={`${def.label} Anime`} />}
            >
              <GenreCarousel genreSlug={slug} label={def.label} />
            </Suspense>
          );
        })}
      </div>

      {popularAnime.length === 0 && newestAnime.length === 0 ? (
        <p className="rounded-2xl border border-zinc-800 bg-zinc-950/70 px-6 py-8 text-center text-zinc-400">
          No anime titles found for this genre yet.
        </p>
      ) : null}
    </div>
  );
}
