"use client";

import { useEffect, useState } from "react";
import { ArrowUp, ChevronUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#2E51A2] text-white shadow-[0_8px_30px_rgba(46,81,162,0.3)] transition-all duration-300 hover:bg-[#345293] hover:-translate-y-1 active:scale-95 hover:cursor-pointer ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-20 opacity-0 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      <ChevronUp size={28} strokeWidth={2.5} />
    </button>
  );
}
