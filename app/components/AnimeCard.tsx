"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Users } from "lucide-react";
import { RatingIcon10 } from "./icons/Rating10Icon";
import { RatingIcon12 } from "./icons/Rating12Icon";
import { RatingIcon14 } from "./icons/Rating14Icon";
import { RatingIcon16 } from "./icons/Rating16Icon";
import { RatingIcon18 } from "./icons/Rating18Icon";
import { RatingIconAL } from "./icons/RatingALIcon";
import { BadgeWatchlistIcon } from "./icons/BadgeWatchlistIcon";
import { WatchlistButton } from "./WatchlistButton";
import {
  WATCHLIST_UPDATED_EVENT,
  type WatchlistUpdatedDetail,
} from "@/lib/watchlist-events";

interface AnimeCardProps {
  malId: number;
  title: string;
  imageUrl: string | null;
  rating: string | null;
  score: number | null;
  members: number | null;
  episodes: number | null;
  synopsis: string | null;
}

function getSeasonCountFromTitle(title: string): number | null {
  const normalizedTitle = title.toLowerCase();

  if (/\b(movie|film|ova|ona|special)\b/.test(normalizedTitle)) {
    return null;
  }

  const explicitSeasonMatch = normalizedTitle.match(
    /\b(?:season\s*(\d+)|(\d+)(?:st|nd|rd|th)\s+season)\b/,
  );
  if (explicitSeasonMatch) {
    const value = Number.parseInt(
      explicitSeasonMatch[1] ?? explicitSeasonMatch[2],
      10,
    );
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  const wordSeasonMap: Record<string, number> = {
    second: 2,
    third: 3,
    fourth: 4,
    fifth: 5,
    sixth: 6,
    seventh: 7,
    eighth: 8,
    ninth: 9,
    tenth: 10,
  };

  for (const [word, count] of Object.entries(wordSeasonMap)) {
    if (new RegExp(`\\b${word}\\s+season\\b`).test(normalizedTitle)) {
      return count;
    }
  }

  return 1;
}

function getRatingIcon(rating: string | null) {
  if (!rating) return null;

  const normalizedRating = rating.toLocaleLowerCase();

  if (
    /^rx\b/.test(normalizedRating) ||
    /hentai|adult|18\+|r18|a18|18 anos/.test(normalizedRating)
  ) {
    return <RatingIcon18 size={16} />;
  }

  if (/^r\b|r\+|nudity|17\+|a16|16 anos|mature/.test(normalizedRating)) {
    return <RatingIcon16 size={16} />;
  }

  if (/pg-13|teens|13\+|a14|14 anos/.test(normalizedRating)) {
    return <RatingIcon14 size={16} />;
  }

  if (/kids|children|a12|12 anos/.test(normalizedRating)) {
    return <RatingIcon12 size={16} />;
  }

  if (/^pg\b|a10|10 anos/.test(normalizedRating)) {
    return <RatingIcon10 size={16} />;
  }

  if (/^g\b|all ages|livre/.test(normalizedRating)) {
    return <RatingIconAL size={16} />;
  }

  return null;
}

export function AnimeCard({
  malId,
  title,
  imageUrl,
  rating,
  score,
  members,
  episodes,
  synopsis,
}: AnimeCardProps) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const seasonCount = getSeasonCountFromTitle(title);
  const ratingIcon = getRatingIcon(rating);
  const hasTitle = title.trim().length > 0;
  const [isImageLoaded, setIsImageLoaded] = useState(!imageUrl);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    setIsImageLoaded(!imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWatchlistState() {
      try {
        const response = await fetch(`/api/v1/watchlist?malId=${malId}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          setIsInWatchlist(false);
          return;
        }

        const data = await response.json();
        setIsInWatchlist(Boolean(data.entry));
      } catch {
        setIsInWatchlist(false);
      }
    }

    loadWatchlistState();

    return () => controller.abort();
  }, [malId]);

  useEffect(() => {
    const handleWatchlistUpdated = (event: Event) => {
      const { detail } = event as CustomEvent<WatchlistUpdatedDetail>;

      if (detail?.malId === malId) {
        setIsInWatchlist(detail.inWatchlist);
      }
    };

    window.addEventListener(WATCHLIST_UPDATED_EVENT, handleWatchlistUpdated);

    return () => {
      window.removeEventListener(
        WATCHLIST_UPDATED_EVENT,
        handleWatchlistUpdated,
      );
    };
  }, [malId]);

  return (
    <Link
      href={`/anime/${malId}/${slug}`}
      className="group/card relative block w-full h-[345px] sm:h-80 md:h-85 lg:h-95 overflow-hidden transition-transform duration-200 hover:scale-105"
    >
      <div className="relative h-[82%] w-full overflow-hidden shadow-md transition-all duration-300 ease-in-out group-hover/card:h-full">
        {isInWatchlist ? <BadgeWatchlistIcon size={16} /> : null}

        {!isImageLoaded && (
          <div className="absolute inset-0 z-10 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
        )}

        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className={`object-cover transition-opacity duration-300 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            sizes="(max-width: 768px) 200px, 250px"
            onLoad={() => setIsImageLoaded(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-200 dark:bg-zinc-800">
            <span className="text-xs text-zinc-500">No Image</span>
          </div>
        )}
      </div>

      <div className="py-2 h-[18%] flex items-start">
        {hasTitle ? (
          <h3 className="line-clamp-2 text-white text-sm font-bold leading-snug">
            {title}
          </h3>
        ) : (
          <div className="flex w-full flex-col gap-2">
            <div className="h-4 w-full animate-pulse bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-2/3 animate-pulse bg-zinc-200 dark:bg-zinc-800" />
          </div>
        )}
      </div>

      <div className="absolute inset-0 flex flex-col justify-start overflow-hidden bg-[#151515]/95 px-3 pt-4 text-sm font-semibold text-white opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 z-20">
        <h3 className="text-white text-sm font-bold my-2 line-clamp-3 wrap-break-word leading-snug">
          {title}
        </h3>

        <div className="flex items-center gap-2 text-[#bbb] text-sm font-normal">
          {ratingIcon}
          <p className="flex items-center gap-1 line-clamp-1">
            <Star size={14} fill="currentColor" /> {score?.toFixed(2) || "N/A"}
          </p>
          <p className="flex items-center gap-1 line-clamp-1">
            <Users size={14} /> {members ? members.toLocaleString() : "N/A"}
          </p>
        </div>

        <p className="line-clamp-1 text-[#8c8c8c]">
          Seasons: {seasonCount ?? "N/A"}
        </p>
        <p className="line-clamp-1 text-[#8c8c8c]">
          Episodes: {episodes ?? "N/A"}
        </p>

        <p className="line-clamp-4 break-words leading-relaxed font-medium text-zinc-100">
          {synopsis || "No synopsis available."}
        </p>

        <div className="mt-auto flex justify-end pb-2 pt-4">
          <WatchlistButton malId={malId} title={title} episodes={episodes} />
        </div>
      </div>
    </Link>
  );
}
