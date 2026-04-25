"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Bookmark, Play } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { DropdownIcon } from "./icons/DropdownIcon";
import { AdminNavActions } from "./AdminNavActions";
import UserModal from "./UserModal";
import AnonymousUserModal from "./AnonymousUserModal";
import { UserProfile } from "@/types/UserProfile";

function getCurrentSeason(date = new Date()) {
  const month = date.getMonth(); // 0-11
  if (month <= 2) return "winter";
  if (month <= 5) return "spring";
  if (month <= 8) return "summer";
  return "fall";
}

function getUserInitial(fullName: string | null, email: string) {
  const source = fullName?.trim() || email;
  return source.charAt(0).toUpperCase() || "U";
}

export default function Header() {
  const currentYear = new Date().getFullYear();
  const currentSeason = getCurrentSeason();
  const { user, loading } = useAuth();

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isAnonymousModalOpen, setIsAnonymousModalOpen] = useState(false);

  // Map AuthContext user to UserProfile type for UserModal
  const userProfile: UserProfile | null = user
    ? {
        id: user.id.toString(),
        email: user.email,
        username: user.email.split("@")[0],
        display_name: user.fullName || user.email.split("@")[0],
        profile_image_url: null,
        background_image_url: null,
        created_at: new Date().toISOString(),
        last_login_at: new Date().toISOString(),
      }
    : null;

  const handleUserClick = () => {
    if (user) {
      setIsUserModalOpen(true);
    } else {
      setIsAnonymousModalOpen(true);
    }
  };

  if (loading) {
    return (
      <header className="h-16 bg-[#272727] px-6">
        <div className="mx-auto flex h-full max-w-7xl flex-row items-center justify-between animate-pulse">
          <div className="flex flex-row items-center gap-4">
            <div className="h-9 w-9 rounded-lg bg-zinc-700/60" />
            <div className="flex flex-col gap-1">
              <div className="h-4 w-20 bg-zinc-700/60 rounded" />
              <div className="h-2 w-16 bg-zinc-700/60 rounded" />
            </div>
          </div>

          <nav className="hidden md:flex flex-1 px-6">
            <div className="flex gap-4">
              <div className="h-4 w-20 bg-zinc-700/60 rounded" />
              <div className="h-4 w-20 bg-zinc-700/60 rounded" />
              <div className="h-4 w-24 bg-zinc-700/60 rounded" />
              <div className="h-4 w-16 bg-zinc-700/60 rounded" />
            </div>
          </nav>

          <div className="flex items-center gap-4">
            <div className="h-6 w-6 bg-zinc-700/60 rounded" />
            <div className="h-9 w-9 rounded-full bg-zinc-700/60" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 bg-[#272727] px-6 sticky top-0 z-[1000]">
      <div className="mx-auto flex h-full max-w-7xl flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <Link href="/" className="flex flex-row items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 transition-transform group-hover:scale-105 group-hover:rotate-3 shadow-lg shadow-indigo-500/20">
              <Play className="fill-white text-white ml-0.5" size={20} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black tracking-tight text-white uppercase">
                Primer
              </span>
              <span className="text-[9px] font-bold tracking-[0.25em] text-indigo-400 uppercase">
                AnimeList
              </span>
            </div>
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
            <li className="h-full">
              <Link
                href="/news"
                className="flex h-full items-center px-4 text-base font-medium text-[#bbb] transition-colors hover:bg-[#181818] hover:text-white"
              >
                News
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

          <div className="flex h-full items-center">
            {user && (
              <Link
                href="/watchlist"
                className="flex h-full items-center px-4 text-[#bbb] transition-colors hover:bg-[#181818] hover:text-white"
                aria-label="Library"
              >
                <Bookmark size={22} />
              </Link>
            )}

            <button
              type="button"
              onClick={handleUserClick}
              className={`flex h-full items-center gap-1 px-4 transition-colors hover:bg-[#181818] hover:text-white cursor-pointer focus:outline-none ${
                isUserModalOpen || isAnonymousModalOpen
                  ? "bg-[#181818] text-white"
                  : "text-[#bbb]"
              }`}
              aria-label="User Menu"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-500">
                {user ? (
                  getUserInitial(user.fullName, user.email)
                ) : (
                  <svg
                    className="w-5 h-5 fill-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z" />
                  </svg>
                )}
              </div>
              <DropdownIcon />
            </button>
          </div>
        </div>
      </div>

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        userProfile={userProfile}
      />

      <AnonymousUserModal
        isOpen={isAnonymousModalOpen}
        onClose={() => setIsAnonymousModalOpen(false)}
      />
    </header>
  );
}
