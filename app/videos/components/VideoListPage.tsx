"use client";

import { useEffect, useRef, useState } from "react";
import SortDropdown from "@/app/videos/components/SortDropdown";
import { AnimeCardCompact } from "@/app/components/AnimeCardCompact";
import type { Anime } from "@/types/Anime";

type VideoListAnime = {
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

type VideoListMode = "newest" | "popular";

interface VideoListPageProps {
  animes: VideoListAnime[];
  title: string;
  currentPage: number;
  totalPages: number;
  total: number;
  mode: VideoListMode;
}

const PAGE_SIZE = 30;

function mapSerializedAnime(anime: Anime): VideoListAnime {
  return {
    malId: anime.mal_id,
    title: anime.title,
    imageUrl: anime.images.jpg.large_image_url ?? anime.images.jpg.image_url,
    imageCardCompact: anime.image_card_compact,
    rating: anime.rating,
    score: anime.score,
    episodes: anime.episodes,
    synopsis: anime.synopsis,
    members: anime.members,
  };
}

function buildApiUrl(mode: VideoListMode, page: number) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(PAGE_SIZE),
  });

  params.set("filter", mode === "popular" ? "bypopularity" : "newest");

  return `/api/v1/anime?${params.toString()}`;
}

function getSortLabel(mode: VideoListMode) {
  return mode === "popular" ? "Most Popular" : "Newest";
}

export default function VideoListPage({
  animes,
  title,
  currentPage,
  totalPages,
  total,
  mode,
}: VideoListPageProps) {
  const [visibleAnimes, setVisibleAnimes] = useState(animes);
  const [page, setPage] = useState(currentPage);
  const [hasNextPage, setHasNextPage] = useState(currentPage < totalPages);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (!hasNextPage || isLoading) {
      return;
    }

    const node = sentinelRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (!entry?.isIntersecting) {
          return;
        }

        if (loadingRef.current) {
          return;
        }

        loadingRef.current = true;
        setIsLoading(true);
        setLoadError(null);

        const nextPage = page + 1;

        fetch(buildApiUrl(mode, nextPage))
          .then(async (response) => {
            if (!response.ok) {
              throw new Error("Failed to load more anime.");
            }

            return (await response.json()) as {
              data: Anime[];
              pagination: {
                has_next_page: boolean;
              };
            };
          })
          .then((payload) => {
            const nextItems = payload.data.map(mapSerializedAnime);

            setVisibleAnimes((currentItems) => {
              const existingIds = new Set(
                currentItems.map((item) => item.malId),
              );
              const mergedItems = nextItems.filter(
                (item) => !existingIds.has(item.malId),
              );
              return [...currentItems, ...mergedItems];
            });
            setPage(nextPage);
            setHasNextPage(payload.pagination.has_next_page);
          })
          .catch(() => {
            setLoadError("Nao foi possivel carregar mais animes.");
          })
          .finally(() => {
            loadingRef.current = false;
            setIsLoading(false);
          });
      },
      {
        rootMargin: "320px 0px",
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isLoading, mode, page]);

  return (
    <div className="mx-auto flex w-full max-w-[1130px] flex-col px-6 py-15">
      <div className="mb-8 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="m-0 p-0 text-left font-lato text-[22px] sm:text-[28px] font-medium">
            {title}
          </h1>

          <SortDropdown currentLabel={getSortLabel(mode)} />
        </div>
      </div>

      {visibleAnimes.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {visibleAnimes.map((anime) => (
              <AnimeCardCompact
                key={anime.malId}
                malId={anime.malId}
                title={anime.title}
                imageUrl={anime.imageUrl}
                rating={anime.rating}
                score={anime.score}
                members={anime.members}
                episodes={anime.episodes}
                synopsis={anime.synopsis}
              />
            ))}
          </div>

          <div
            ref={sentinelRef}
            className="flex min-h-20 items-center justify-center py-8"
          >
            {isLoading ? (
              <p className="text-sm text-zinc-400">
                Carregando mais 30 animes...
              </p>
            ) : loadError ? (
              <p className="text-sm text-red-400">{loadError}</p>
            ) : hasNextPage ? (
              <p className="text-sm text-zinc-500">
                Continue rolando para carregar mais.
              </p>
            ) : (
              <p className="text-sm text-zinc-500">Fim da lista.</p>
            )}
          </div>
        </>
      ) : (
        <p className="py-8 text-center text-zinc-400">No anime found.</p>
      )}
    </div>
  );
}
