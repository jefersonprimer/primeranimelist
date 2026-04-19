"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, LogOut, Bookmark, Pencil } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { DropdownIcon } from "./icons/DropdownIcon";
import { AdminNavActions } from "./AdminNavActions";

function getCurrentSeason(date = new Date()) {
  const month = date.getMonth(); // 0-11
  if (month <= 2) return "winter";
  if (month <= 5) return "spring";
  if (month <= 8) return "summer";
  return "fall";
}

function getDisplayName(fullName: string | null, email: string) {
  return fullName?.trim() || email;
}

function getUserInitial(fullName: string | null, email: string) {
  const source = getDisplayName(fullName, email).trim();
  return source.charAt(0).toUpperCase() || "U";
}

export default function Header() {
  const currentYear = new Date().getFullYear();
  const currentSeason = getCurrentSeason();
  const { user, logout, loading } = useAuth();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isUserModalOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setIsUserModalOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsUserModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isUserModalOpen]);

  return (
    <header className="h-16 bg-[#272727] px-6">
      <div className="mx-auto flex h-full max-w-7xl flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <Link href="/" className="flex flex-row items-center gap-3">
            <div className="bg-indigo-600 text-white font-bold p-2 rounded-md shadow-md w-11 h-11 flex items-center justify-center text-lg">
              PAL
            </div>
            <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              𝑷𝒓𝒊𝒎𝒆𝒓𝑨𝒏𝒊𝒎𝒆𝑳𝒊𝒔𝒕
            </span>
          </Link>
        </div>
        <nav className="flex h-full flex-1 px-6">
          <ul className="flex h-full flex-row">
            <li className="h-full">
              <Link
                href="/anime/top"
                className="flex h-full items-center px-4 text-base font-medium text-[#bbb] transition-colors hover:bg-[#181818] hover:text-white"
              >
                Top Anime
              </Link>
            </li>
            <li className="h-full">
              <Link
                href="/manga/top"
                className="flex h-full items-center px-4 text-base font-medium text-[#bbb] transition-colors hover:bg-[#181818] hover:text-white"
              >
                Top Manga
              </Link>
            </li>
            <li className="h-full">
              <Link
                href={`/anime/season/${currentYear}/${currentSeason}`}
                className="flex h-full items-center px-4 text-base font-medium text-[#bbb] transition-colors hover:bg-[#181818] hover:text-white"
              >
                Season Anime
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex h-full flex-row items-center">
          <AdminNavActions />

          <Link
            href="/search"
            className="flex h-full items-center px-4 text-[#bbb] transition-colors hover:bg-[#181818] hover:text-white"
            aria-label="Search"
          >
            <Search size={22} />
          </Link>

          {loading ? (
            <div
              className="h-10 w-24 rounded-full bg-zinc-700/60"
              aria-hidden="true"
            />
          ) : user ? (
            <div className="flex h-full items-center">
              <Link
                href="/watchlist"
                className="flex h-full items-center px-4 text-[#bbb] transition-colors hover:bg-[#181818] hover:text-white"
                aria-label="Library"
              >
                <Bookmark size={22} />
              </Link>
              <div className="relative h-full" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen((open) => !open)}
                  className={`flex h-full items-center gap-1 px-4 transition-colors hover:bg-[#181818] hover:text-white cursor-pointer focus:outline-none ${
                    isUserModalOpen ? "bg-[#181818] text-white" : "text-[#bbb]"
                  }`}
                  aria-label="Abrir menu do usuário"
                  aria-haspopup="dialog"
                  aria-expanded={isUserModalOpen}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-500">
                    {getUserInitial(user.fullName, user.email)}
                  </div>
                  <DropdownIcon />
                </button>

                {isUserModalOpen && (
                  <div
                    className="absolute right-0 top-full z-50 w-64 bg-[#181818] p-4"
                    role="dialog"
                    aria-label="Menu do usuário"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-base font-bold text-white">
                          {getUserInitial(user.fullName, user.email)}
                        </div>
                        <div className="min-w-0">
                          {getDisplayName(user.fullName, user.email)}
                        </div>
                      </div>
                      <button>
                        <Pencil size={24} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        setIsUserModalOpen(false);
                        await logout();
                      }}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:border-red-400 hover:bg-red-500/20 cursor-pointer"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
