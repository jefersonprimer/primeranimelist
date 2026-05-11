"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Filter } from "lucide-react";

interface TopFilterItem {
  label: string;
  value: string | null;
}

interface TopFiltersProps {
  basePath: string;
  filters: TopFilterItem[];
  currentFilter: string | null;
}

export function TopFilters({
  basePath,
  filters,
  currentFilter,
}: TopFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentLabel =
    filters.find((f) => f.value === currentFilter)?.label || "Filters";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  function getFilterHref(filterValue: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (filterValue) {
      params.set("filter", filterValue);
    } else {
      params.delete("filter");
    }
    params.delete("page");
    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold dark:text-zinc-300 hover:bg-[#272727] hover:cursor-pointer ${isOpen ? "bg-[#272727]" : ""}`}
      >
        <Filter className="h-4 w-4" />
        <span>{currentLabel}</span>
        <ChevronDown
          className={`hidden sm:flex h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 w-56 origin-top-right bg-[#272727]">
          <div className="py-2">
            {filters.map((item) => {
              const isActive = item.value === currentFilter;
              return (
                <Link
                  key={item.value ?? "all"}
                  href={getFilterHref(item.value)}
                  onClick={() => setIsOpen(false)}
                  className={`block w-full py-2 px-4 text-sm transition-colors ${
                    isActive
                      ? "font-bold text-white hover:bg-zinc-900"
                      : "text-[#8c8c8c] hover:bg-zinc-900 hover:text-zinc-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
