"use client";

import SortDropdown from "@/app/videos/components/SortDropdown";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import AnimeCard from "./AnimeCard";

type AlphabeticalAnime = {
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

interface AlphabeticalClientProps {
  animes: AlphabeticalAnime[];
  activeLetter: string;
  onLetterChange?: (letter: string) => void;
}

const letters = ["#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

const AlphabeticalClient = ({
  animes,
  activeLetter,
  onLetterChange,
}: AlphabeticalClientProps) => {
  const lettersContainerRef = useRef<HTMLDivElement>(null);
  const [pageSize, setPageSize] = useState(letters.length);
  const [pageStart, setPageStart] = useState(0);

  useEffect(() => {
    const updatePageSize = () => {
      if (!lettersContainerRef.current) return;

      const availableWidth = lettersContainerRef.current.offsetWidth;
      // Approximate one letter button width + gap.
      const estimatedItemWidth = 44;
      const nextPageSize = Math.max(
        1,
        Math.min(
          letters.length,
          Math.floor(availableWidth / estimatedItemWidth),
        ),
      );

      setPageSize((current) =>
        current === nextPageSize ? current : nextPageSize,
      );
    };

    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  useEffect(() => {
    const activeIndex = letters.indexOf(activeLetter);
    if (activeIndex === -1) return;

    setPageStart((currentStart) => {
      const maxPageStart = Math.max(0, letters.length - pageSize);
      const normalizedStart = Math.min(currentStart, maxPageStart);
      const currentEnd = normalizedStart + pageSize;

      if (activeIndex < normalizedStart || activeIndex >= currentEnd) {
        return Math.min(
          maxPageStart,
          Math.max(0, activeIndex - Math.floor(pageSize / 2)),
        );
      }

      return normalizedStart;
    });
  }, [activeLetter, pageSize]);

  const hasPagination = pageSize < letters.length;
  const visibleLetters = useMemo(
    () => letters.slice(pageStart, pageStart + pageSize),
    [pageSize, pageStart],
  );
  const canGoLeft = hasPagination && pageStart > 0;
  const canGoRight = hasPagination && pageStart + pageSize < letters.length;

  const goLeft = () => {
    setPageStart((current) => Math.max(0, current - pageSize));
  };

  const goRight = () => {
    setPageStart((current) =>
      Math.min(letters.length - pageSize, current + pageSize),
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-[1130px] flex-col items-center px-6 py-15">
      <div className="mb-8 px-2 flex w-full items-center justify-between">
        <h1 className="m-0 p-0 text-[28px] font-bold font-lato text-left">
          Browse All Anime
        </h1>
        <div className="flex items-center">
          <SortDropdown currentLabel="Alphabetical" className="ml-4" />
        </div>
      </div>

      <div
        ref={lettersContainerRef}
        className="mb-6 flex w-full items-center justify-center gap-2 xl:w-[1200px] xl:max-w-none"
      >
        {hasPagination && (
          <button
            className={`rounded p-2 text-[#A0A0A0] transition-colors xl:hidden ${
              canGoLeft ? "hover:text-white" : "cursor-not-allowed opacity-40"
            }`}
            onClick={goLeft}
            type="button"
            aria-label="Show previous letters"
            disabled={!canGoLeft}
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div className="flex min-w-0 items-center justify-center gap-2 overflow-hidden whitespace-nowrap">
          {visibleLetters.map((letter) => (
            <button
              key={letter}
              className={`rounded p-2 transition-transform ${
                activeLetter === letter
                  ? "scale-110 text-[#FF640A]"
                  : "text-[#A0A0A0]"
              } hover:scale-110 hover:cursor-pointer hover:text-white`}
              onClick={() => onLetterChange?.(letter)}
              type="button"
            >
              {letter}
            </button>
          ))}
        </div>

        {hasPagination && (
          <button
            className={`rounded p-2 text-[#A0A0A0] transition-colors xl:hidden ${
              canGoRight ? "hover:text-white" : "cursor-not-allowed opacity-40"
            }`}
            onClick={goRight}
            type="button"
            aria-label="Show next letters"
            disabled={!canGoRight}
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      <div className="flex w-full flex-col gap-4">
        {animes.length > 0 ? (
          animes.map((anime) => <AnimeCard key={anime.id} anime={anime} />)
        ) : (
          <p className="py-8 text-center text-zinc-400">
            No anime found for &quot;{activeLetter}&quot;.
          </p>
        )}
      </div>
    </div>
  );
};

export default AlphabeticalClient;
