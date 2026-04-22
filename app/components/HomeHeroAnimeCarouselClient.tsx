"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { RatingIcon10 } from "./icons/Rating10Icon";
import { RatingIcon12 } from "./icons/Rating12Icon";
import { RatingIcon14 } from "./icons/Rating14Icon";
import { RatingIcon16 } from "./icons/Rating16Icon";
import { RatingIcon18 } from "./icons/Rating18Icon";
import RatingIconAL from "./icons/RatingALIcon";

type HeroAnimeItem = {
  malId: number;
  title: string;
  thumbnail: string;
  logo: string | null;
  rating: string | null;
  genres: string[];
  synopsis: string | null;
};

type HomeHeroAnimeCarouselClientProps = {
  items: HeroAnimeItem[];
};

function getRatingIcon(rating: string | null) {
  if (!rating) return null;

  const normalizedRating = rating.toLocaleLowerCase();

  if (
    /^rx\b/.test(normalizedRating) ||
    /hentai|adult|18\+|r18|a18|18 anos/.test(normalizedRating)
  ) {
    return <RatingIcon18 />;
  }

  if (/^r\b|r\+|nudity|17\+|a16|16 anos|mature/.test(normalizedRating)) {
    return <RatingIcon16 />;
  }

  if (/pg-13|teens|13\+|a14|14 anos/.test(normalizedRating)) {
    return <RatingIcon14 />;
  }

  if (/kids|children|a12|12 anos/.test(normalizedRating)) {
    return <RatingIcon12 />;
  }

  if (/^pg\b|a10|10 anos/.test(normalizedRating)) {
    return <RatingIcon10 />;
  }

  if (/^g\b|all ages|livre/.test(normalizedRating)) {
    return <RatingIconAL />;
  }

  return null;
}

export function HomeHeroAnimeCarouselClient({
  items,
}: HomeHeroAnimeCarouselClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = items.length;

  const safeIndex = useMemo(() => {
    if (total === 0) return 0;
    return ((currentIndex % total) + total) % total;
  }, [currentIndex, total]);

  useEffect(() => {
    if (total <= 1) return;

    const intervalId = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [total]);

  if (total === 0) return null;

  const active = items[safeIndex];
  const slug = active.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const ratingIcon = getRatingIcon(active.rating);
  const genresText =
    active.genres.length > 0 ? active.genres.join(", ") : "N/A";

  return (
    <section className="relative z-0 w-full">
      <div className="mx-auto">
        <div className="relative h-[90vh] min-h-[520px] w-full overflow-hidden bg-zinc-900">
          <Image
            src={active.thumbnail}
            alt={active.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/30" />

          <div className="absolute inset-0 flex items-center -trabs p-8 sm:p-10 md:p-12">
            <div className="max-w-md text-white">
              <Link
                href={`/anime/${active.malId}/${slug}`}
                className="block w-fit"
              >
                {active.logo ? (
                  <div className="relative mb-6 h-24 w-[280px] sm:h-28 sm:w-[340px]">
                    <Image
                      src={active.logo}
                      alt={`${active.title} logo`}
                      fill
                      className="object-contain object-left"
                      sizes="340px"
                    />
                  </div>
                ) : (
                  <h2 className="mb-6 line-clamp-2 text-3xl font-black sm:text-4xl">
                    {active.title}
                  </h2>
                )}
              </Link>

              <div className="mb-4 flex items-center gap-3 text-sm text-zinc-200 sm:text-base">
                {ratingIcon}
                <p className="line-clamp-1">{genresText}</p>
              </div>

              <p className="line-clamp-4 text-sm leading-relaxed text-zinc-100 sm:text-base">
                {active.synopsis || "No synopsis available."}
              </p>
            </div>
          </div>

          {total > 1 ? (
            <>
              <button
                type="button"
                onClick={() =>
                  setCurrentIndex((prev) => (prev - 1 + total) % total)
                }
                className="absolute top-1/2 z-20 -translate-y-1/2  p-2 text-white transition hover:cursor-pointer"
                aria-label="Previous anime"
              >
                <ChevronLeft size={34} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % total)}
                className="absolute right-0 top-1/2 z-20 -translate-y-1/2  p-2 text-white transition hover:cursor-pointer"
                aria-label="Next anime"
              >
                <ChevronRight size={34} />
              </button>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
