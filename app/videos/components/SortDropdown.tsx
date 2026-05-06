"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type SortOption = {
  href: "/videos/popular" | "/videos/new" | "/videos/alphabetical";
  label: string;
};

interface SortDropdownProps {
  currentLabel: string;
  className?: string;
}

const sortOptions: SortOption[] = [
  { href: "/videos/popular", label: "Popularity" },
  { href: "/videos/new", label: "Newest" },
  { href: "/videos/alphabetical", label: "Alphabetical" },
];

export default function SortDropdown({
  currentLabel,
  className = "",
}: SortDropdownProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative ${className}`.trim()}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`flex items-center border-none gap-2 p-2.5 text-[#A0A0A0] transition-colors hover:bg-[#23252B] hover:text-white hover:cursor-pointer ${
          open ? "bg-[#23252B] text-white" : "bg-transparent"
        }`}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
          role="img"
          fill="currentColor"
        >
          <path d="M9 18a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2h6zM21 4a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2h18zm-6 7a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2h12z" />
        </svg>
        <span className="hidden sm:flex text-sm font-bold uppercase">
          {currentLabel}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-10 flex w-[200px] flex-col bg-[#23252B] py-2.5">
          {sortOptions.map((option) => {
            const isActive = pathname === option.href;

            return (
              <Link
                key={option.href}
                href={option.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-2 px-2.5 py-2 ${
                  isActive
                    ? "bg-[#1D1E22] text-white"
                    : "text-[#A0A0A0] hover:bg-[#1D1E22] hover:text-white"
                }`}
              >
                {option.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
