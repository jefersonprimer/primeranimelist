"use client";

import { useRef, useEffect, ReactNode } from "react";

interface FilterDropdownProps {
  children: ReactNode;
  className?: string;
}

export function FilterDropdown({ children, className }: FilterDropdownProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
        detailsRef.current.removeAttribute("open");
      }
    };

    // Use mousedown to close before any other potential click handlers fire
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <details ref={detailsRef} className={className}>
      {children}
    </details>
  );
}
