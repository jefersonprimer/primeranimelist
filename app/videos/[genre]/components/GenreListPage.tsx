import Link from "next/link";
import AnimeCard from "@/app/videos/alphabetical/components/AnimeCard";
import type { GenreDefinition } from "../genre-config";

type GenreAnime = {
  id: number;
  malId: number;
  title: string;
  imageUrl: string | null;
  imageCardCompact: string | null;
  score: number | null;
  members: number | null;
  episodes: number | null;
  synopsis: string | null;
};

interface GenreListPageProps {
  genre: string;
  genreInfo: GenreDefinition;
  pageTitle: string;
  subtitle: string;
  anime: GenreAnime[];
  currentPage: number;
  totalPages: number;
  total: number;
  basePath: string;
  activeView: "popular" | "new";
}

function getPageHref(basePath: string, page: number) {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}

export default function GenreListPage({
  genre,
  genreInfo,
  pageTitle,
  subtitle,
  anime,
  currentPage,
  totalPages,
  total,
  basePath,
  activeView,
}: GenreListPageProps) {
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-15">
      <div className="mb-8 flex w-full flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">
            {genreInfo.label}
          </p>
          <h1 className="m-0 p-0 text-[1.8rem] font-medium text-left">
            {pageTitle}
          </h1>
          <p className="text-sm text-zinc-400">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/videos/${genre}`}
            className="rounded-full border border-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
          >
            Overview
          </Link>
          <Link
            href={`/videos/${genre}/popular`}
            aria-current={activeView === "popular" ? "page" : undefined}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              activeView === "popular"
                ? "border-orange-500 bg-orange-500/10 text-orange-400"
                : "border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
            }`}
          >
            Most Popular
          </Link>
          <Link
            href={`/videos/${genre}/new`}
            aria-current={activeView === "new" ? "page" : undefined}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              activeView === "new"
                ? "border-orange-500 bg-orange-500/10 text-orange-400"
                : "border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
            }`}
          >
            Newest
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-4">
          <p className="text-sm text-zinc-400">
            {total > 0
              ? `Showing page ${currentPage} of ${totalPages} • ${total} anime titles`
              : "No anime titles found for this genre."}
          </p>

          <div className="flex items-center gap-3">
            <Link
              href={
                hasPreviousPage
                  ? getPageHref(basePath, currentPage - 1)
                  : getPageHref(basePath, 1)
              }
              aria-disabled={!hasPreviousPage}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                hasPreviousPage
                  ? "border-zinc-700 text-zinc-100 hover:border-zinc-600 hover:bg-zinc-900"
                  : "pointer-events-none border-zinc-800 text-zinc-600"
              }`}
            >
              Previous
            </Link>

            <Link
              href={
                hasNextPage
                  ? getPageHref(basePath, currentPage + 1)
                  : getPageHref(basePath, currentPage)
              }
              aria-disabled={!hasNextPage}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                hasNextPage
                  ? "border-orange-500/50 text-orange-300 hover:border-orange-400 hover:bg-orange-500/10"
                  : "pointer-events-none border-zinc-800 text-zinc-600"
              }`}
            >
              Next
            </Link>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4">
        {anime.length > 0 ? (
          anime.map((entry) => <AnimeCard key={entry.id} anime={entry} />)
        ) : (
          <p className="py-8 text-center text-zinc-400">
            No anime titles found for this genre.
          </p>
        )}
      </div>
    </div>
  );
}
