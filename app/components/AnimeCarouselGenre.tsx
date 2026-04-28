'use client';

import { useRef, useState, useEffect } from "react";
import { Anime } from "@/types/anime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import AnimeGrid from "../cards/AnimeGrid";

interface AnimeCarouselGenreProps {
  animes: Anime[];
}

const AnimeCarouselGenre: React.FC<AnimeCarouselGenreProps> = ({ animes }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const isAtStart = scrollLeft <= 0;
      const isAtEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth;

      setCanScrollLeft(!isAtStart);
      setCanScrollRight(!isAtEnd);
    }
  };

  const scrollLeft = () => {
    containerRef.current?.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    containerRef.current?.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      updateScrollState();
      container.addEventListener("scroll", updateScrollState);
      return () => container.removeEventListener("scroll", updateScrollState);
    }
  }, []);

  return (
    <div className="w-screen mx-auto pb-[60px] relative overflow-hidden flex flex-col items-center md:pb-[40px] sm:pb-[20px]">
      <div className="w-full flex justify-center items-center relative">
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            aria-label="Scroll Left"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex justify-center items-center text-white bg-transparent border-none cursor-pointer text-2xl"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        )}

        <div
          ref={containerRef}
          className="w-full flex items-center justify-center gap-6 overflow-x-auto scroll-smooth p-0"
        >
          <AnimeGrid animes={animes} />
        </div>

        {canScrollRight && (
          <button
            onClick={scrollRight}
            aria-label="Scroll Right"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex justify-center items-center text-white bg-transparent border-none cursor-pointer text-2xl"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        )}
      </div>
    </div>
  );
};

export default AnimeCarouselGenre;
