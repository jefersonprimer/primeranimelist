"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
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
      setCanScrollLeft(scrollLeft > 10); // Increased threshold
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    // Force scroll to start on mount to prevent snap issues
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [children]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      // Scroll about 5 cards worth (container width - some buffer for peeks)
      const scrollAmount = clientWidth * 0.85;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="group relative w-full overflow-hidden">
      {/* Left Navigation Area (Blocks clicks on left peek) */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 z-30 h-full w-[max(1.5rem,calc((100vw-1280px)/2+1.5rem))] flex items-center justify-center text-zinc-400 transition-all hover:text-indigo-600 dark:text-zinc-500 dark:hover:text-indigo-400 hover:cursor-pointer bg-transparent"
          aria-label="Scroll left"
        >
          <div className="max-w-7xl w-full mx-auto px-2 sm:px-4 flex justify-start">
             <ChevronLeft size={48} strokeWidth={2.5} className="-ml-2 sm:-ml-4" />
          </div>
        </button>
      )}

      {/* Right Navigation Area (Blocks clicks on right peek) */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 z-30 h-full w-[max(1.5rem,calc((100vw-1280px)/2+1.5rem))] flex items-center justify-center text-zinc-400 transition-all hover:text-indigo-600 dark:text-zinc-500 dark:hover:text-indigo-400 hover:cursor-pointer bg-transparent"
          aria-label="Scroll right"
        >
          <div className="max-w-7xl w-full mx-auto px-2 sm:px-4 flex justify-end">
            <ChevronRight size={48} strokeWidth={2.5} className="-mr-2 sm:-mr-4" />
          </div>
        </button>
      )}

      {/* Scrollable Area */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        style={{
          scrollPaddingLeft: 'max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))',
          scrollPaddingRight: 'max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))'
        }}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth px-[max(1.5rem,calc((100vw-1280px)/2+1.5rem))]"
      >
        {children}
      </div>
    </div>
  );
}
