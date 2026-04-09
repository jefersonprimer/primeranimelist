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
          <ChevronLeft size={30}/>
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
          <ChevronRight size={30}/>
        </button>
      )}
    </div>
  );
}
