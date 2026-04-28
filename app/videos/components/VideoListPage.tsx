import AnimeCard from "@/app/videos/alphabetical/components/AnimeCard";
import SortDropdown from "@/app/videos/components/SortDropdown";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type VideoListAnime = {
  id: number;
  malId: number;
  title: string;
  imageUrl: string | null;
  imageCardCompact: string | null;
  rating: string | null;
  score: number | null;
  episodes: number | null;
  synopsis: string | null;
  members: number | null;
};

interface VideoListPageProps {
  animes: VideoListAnime[];
  title: string;
  subtitle: string;
  currentPage: number;
  totalPages: number;
  total: number;
  basePath: "/videos/new" | "/videos/popular";
}

function getPageHref(basePath: string, page: number) {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}

function getSortLabel(basePath: VideoListPageProps["basePath"]) {
  return basePath === "/videos/popular" ? "Most Popular" : "Newest";
}

export default function VideoListPage({
  animes,
  title,
  currentPage,
  totalPages,
  total,
  basePath,
}: VideoListPageProps) {
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-15">
      <div className="mb-8 flex w-full flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="m-0 p-0 text-[1.8rem] font-medium font-lato text-left">
            {title}
          </h1>

          <SortDropdown currentLabel={getSortLabel(basePath)} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-4">
          <p className="text-sm text-zinc-400">
            {total > 0
              ? `Showing page ${currentPage} of ${totalPages} • ${total} anime`
              : "No anime found."}
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
              <ChevronLeft className="h-4 w-4" />
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
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4">
        {animes.length > 0 ? (
          animes.map((anime) => <AnimeCard key={anime.id} anime={anime} />)
        ) : (
          <p className="py-8 text-center text-zinc-400">No anime found.</p>
        )}
      </div>
    </div>
  );
}
