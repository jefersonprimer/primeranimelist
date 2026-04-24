"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { RatingIcon10 } from "./icons/Rating10Icon";
import { RatingIcon12 } from "./icons/Rating12Icon";
import { RatingIcon14 } from "./icons/Rating14Icon";
import { RatingIcon16 } from "./icons/Rating16Icon";
import { RatingIcon18 } from "./icons/Rating18Icon";
import { RatingIconAL } from "./icons/RatingALIcon";

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
    return <RatingIcon18 size={20} />;
  }

  if (/^r\b|r\+|nudity|17\+|a16|16 anos|mature/.test(normalizedRating)) {
    return <RatingIcon16 size={20} />;
  }

  if (/pg-13|teens|13\+|a14|14 anos/.test(normalizedRating)) {
    return <RatingIcon14 size={20} />;
  }

  if (/kids|children|a12|12 anos/.test(normalizedRating)) {
    return <RatingIcon12 size={20} />;
  }

  if (/^pg\b|a10|10 anos/.test(normalizedRating)) {
    return <RatingIcon10 size={20} />;
  }

  if (/^g\b|all ages|livre/.test(normalizedRating)) {
    return <RatingIconAL size={20} />;
  }

  return null;
}

export function HomeHeroAnimeCarouselClient({
  items,
}: HomeHeroAnimeCarouselClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const total = items.length;
  const autoplayDurationMs = 10000;

  const safeIndex = useMemo(() => {
    if (total === 0) return 0;
    return ((currentIndex % total) + total) % total;
  }, [currentIndex, total]);

  useEffect(() => {
    if (total <= 1) {
      setProgressPercent(0);
      return;
    }

    let animationFrameId = 0;
    let startedAt = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const nextProgress = Math.min((elapsed / autoplayDurationMs) * 100, 100);
      setProgressPercent(nextProgress);

      if (elapsed >= autoplayDurationMs) {
        setCurrentIndex((prev) => (prev + 1) % total);
        return;
      }

      animationFrameId = window.requestAnimationFrame(tick);
    };

    animationFrameId = window.requestAnimationFrame((now) => {
      startedAt = now;
      tick(now);
    });

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [autoplayDurationMs, currentIndex, total]);

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

          <div className="absolute -translate-y-20 inset-0 flex items-center mx-auto w-full max-w-7xl -trabs p-8 sm:py-10 md:py-12">
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

              <div className="mb-4 flex items-center gap-1 text-sm text-zinc-200">
                {ratingIcon}
                <span
                  className="flex items-center text-[0.8rem] relative pl-[14px] 
                      before:content-['◆'] before:text-[#A0A0A0] before:text-[0.5rem] 
                      before:absolute before:left-[4px] before:top-1/2 before:-translate-y-1/2 
                      before:mr-[8px] first:before:hidden"
                ></span>
                <p className="line-clamp-1">{genresText}</p>
              </div>

              <p className="line-clamp-4 text-sm leading-relaxed text-[#bbb] sm:text-base">
                {active.synopsis || "No synopsis available."}
              </p>

              <div className="mt-5 mb-12 flex items-center gap-2">
                <Link
                  href={`/anime/${active.malId}/${slug}`}
                  className="inline-flex items-center gap-2 bg-white px-5 py-2 text-xs font-semibold tracking-wide text-black transition hover:bg-zinc-200 sm:text-sm"
                >
                  <Play size={24} />
                  <span>START WATCHING E1</span>
                </Link>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center border border-white/60 text-white transition hover:bg-white/1 hover:cursor-pointer"
                  aria-label="Add anime to watchlist"
                >
                  <Bookmark size={24} />
                </button>
              </div>

              {total > 1 ? (
                <div
                  className="mt-4 flex items-center gap-2"
                  aria-hidden="true"
                >
                  {items.map((_, index) => {
                    const isActive = index === safeIndex;

                    return (
                      <div
                        key={`hero-dot-${index}`}
                        className={`relative h-1.5 overflow-hidden rounded-full bg-white/35 transition-all duration-300 ${
                          isActive ? "w-10" : "w-5"
                        }`}
                      >
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-white transition-[width] duration-75 ease-linear"
                          style={{
                            width: `${isActive ? progressPercent : 0}%`,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>

          {total > 1 ? (
            <>
              <button
                type="button"
                onClick={() =>
                  setCurrentIndex((prev) => (prev - 1 + total) % total)
                }
                className="absolute left-3 top-1/2 z-20 -translate-y-27 p-2 text-white transition hover:text-[#41414166] hover:cursor-pointer"
                aria-label="Previous anime"
              >
                <ChevronLeft size={38} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % total)}
                className="absolute right-3 top-1/2 z-20 -translate-y-27  p-2 text-white transition hover:text-[#41414166]  hover:cursor-pointer"
                aria-label="Next anime"
              >
                <ChevronRight size={38} />
              </button>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
