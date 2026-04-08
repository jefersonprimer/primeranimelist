"use client";

import { useRef, useState, useEffect } from "react";

interface CarouselContainerProps {
  children: React.ReactNode;
}

export function CarouselContainer({ children }: CarouselContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1); // -1 for subpixel rounding issues
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [children]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="group relative">
      {/* Left Button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 z-10 flex h-full w-16 items-center justify-center bg-gradient-to-r from-background via-background/50 to-transparent text-zinc-900 transition-all hover:text-indigo-600 dark:text-zinc-50 dark:hover:text-indigo-400 hover:cursor-pointer"
          aria-label="Scroll left"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-8 w-8"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      )}

      {/* Scrollable Area */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
      >
        {children}
      </div>

      {/* Right Button */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 z-10 flex h-full w-16 items-center justify-center bg-gradient-to-l from-background via-background/50 to-transparent text-zinc-900 transition-all hover:text-indigo-600 dark:text-zinc-50 dark:hover:text-indigo-400 hover:cursor-pointer"
          aria-label="Scroll right"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-8 w-8"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      )}
    </div>
  );
}
