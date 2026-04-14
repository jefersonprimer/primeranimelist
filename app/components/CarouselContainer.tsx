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
    <div className="group relative w-full">
      {/* Container for Buttons relative to max-w-7xl */}
      <div className="absolute inset-0 pointer-events-none z-20 max-w-7xl mx-auto px-6">
        <div className="relative h-full w-full">
          {/* Left Button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="pointer-events-auto absolute -left-12 top-0 flex h-full w-12 items-center justify-center text-zinc-400 transition-all hover:scale-110 hover:text-indigo-600 dark:text-zinc-500 dark:hover:text-indigo-400 hover:cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft size={40} strokeWidth={2.5}/>
            </button>
          )}

          {/* Right Button */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="pointer-events-auto absolute -right-12 top-0 flex h-full w-12 items-center justify-center text-zinc-400 transition-all hover:scale-110 hover:text-indigo-600 dark:text-zinc-500 dark:hover:text-indigo-400 hover:cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight size={40} strokeWidth={2.5}/>
            </button>
          )}
        </div>
      </div>

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
