"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface MangaCarouselContainerProps {
  children: React.ReactNode;
}

export function MangaCarouselContainer({ children }: MangaCarouselContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 2); 
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
      
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setScrollProgress(isNaN(progress) ? 0 : progress);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkScroll();
    }, 100);
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScroll);
    };
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
    <div className="group/carousel relative w-full overflow-visible">
      {/* Integrated Navigation Buttons - "Offset" Style */}
      <div className="absolute -top-16 right-0 flex items-center gap-0 z-20">
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className="flex h-12 w-12 items-center justify-center border-2 border-zinc-900 bg-white text-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-zinc-100 active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-20 disabled:pointer-events-none dark:border-white dark:bg-zinc-900 dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
          aria-label="Scroll left"
        >
          <ArrowLeft size={20} strokeWidth={3} />
        </button>
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className="flex h-12 w-12 items-center justify-center border-2 border-l-0 border-zinc-900 bg-white text-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-zinc-100 active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-20 disabled:pointer-events-none dark:border-white dark:bg-zinc-900 dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
          aria-label="Scroll right"
        >
          <ArrowRight size={20} strokeWidth={3} />
        </button>
      </div>

      {/* Scrollable Area */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-8 overflow-x-auto pb-12 pt-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
      >
        {children}
      </div>
      
      {/* Manga Progress Indicator - Custom Style */}
      <div className="mt-4 flex items-center gap-4">
        <div className="h-2 flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-none overflow-hidden border border-zinc-900 dark:border-white">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300 ease-out"
            style={{ width: `${Math.max(5, scrollProgress)}%` }}
          />
        </div>
        <span className="text-[10px] font-black uppercase italic tracking-tighter text-zinc-500">
          Reading Progress
        </span>
      </div>
    </div>
  );
}
