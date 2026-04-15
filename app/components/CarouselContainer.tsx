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
      // Use a 2px buffer to handle subpixel rounding issues
      setCanScrollLeft(scrollLeft > 2); 
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = 0;
        checkScroll();
      }
    }, 100); // Small delay to ensure layout is ready
    return () => clearTimeout(timer);
  }, [children]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      // Scroll exactly 5 cards (plus gaps)
      const scrollAmount = clientWidth * 0.8; 
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const dynamicPadding = "calc(max(1.5rem, (100% - 1280px) / 2 + 1.5rem))";

  return (
    <div className="group relative w-full">
      {/* Left Navigation Area */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          style={{ width: dynamicPadding }}
          className="absolute left-0 top-0 z-30 h-full flex items-center justify-center text-zinc-400 transition-all hover:text-[#f2f2f2] hover:cursor-pointer bg-transparent hover:bg-black/20"
          aria-label="Scroll left"
        >
          <div className="max-w-7xl w-full mx-auto px-6 flex justify-start">
             <ChevronLeft size={56} strokeWidth={2.5} className="-ml-4 -translate-y-6" />
          </div>
        </button>
      )}

      {/* Right Navigation Area */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          style={{ width: dynamicPadding }}
          className="absolute right-0 top-0 z-30 h-full flex items-center justify-center text-zinc-400 transition-all hover:text-[#f2f2f2] hover:cursor-pointer bg-transparent hover:bg-black/20"
          aria-label="Scroll right"
        >
          <div className="max-w-7xl w-full mx-auto px-6 flex justify-end">
            <ChevronRight size={56} strokeWidth={2.5} className="-mr-4 -translate-y-6" />
          </div>
        </button>
      )}

      {/* Scrollable Area */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        style={{
          paddingLeft: dynamicPadding,
          paddingRight: dynamicPadding,
          scrollPaddingLeft: dynamicPadding,
          scrollPaddingRight: dynamicPadding,
        }}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
      >
        {children}
      </div>
    </div>
  );
}
