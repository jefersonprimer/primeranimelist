'use client';

import Link from 'next/link';
import { Search, LogOut, User, Bookmark } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

function getCurrentSeason(date = new Date()) {
  const month = date.getMonth(); // 0-11
  if (month <= 2) return "winter";
  if (month <= 5) return "spring";
  if (month <= 8) return "summer";
  return "fall";
}

export default function Header() {
  const currentYear = new Date().getFullYear();
  const currentSeason = getCurrentSeason();
  const { user, logout } = useAuth();

  return (
    <header className="bg-[#272727] py-2 px-6">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <Link href="/" className="flex flex-row items-center gap-3">
            <div className="bg-indigo-600 text-white font-bold p-2 rounded-md shadow-md w-11 h-11 flex items-center justify-center text-lg">
              PAL
            </div>
            <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              PrimerAnimeList
            </span>
          </Link>
        </div>
        <nav className="flex-1 flex px-6">
          <ul className="flex flex-row gap-8">
            <li>
              <Link href="/anime/top" className="text-base font-medium text-[#bbb] hover:text-white transition-colors">
                Top Anime
              </Link>
            </li>
            <li>
              <Link href="/manga/top" className="text-base font-medium text-[#bbb] hover:text-white transition-colors">
                Top Manga
              </Link>
            </li>
            <li>
              <Link
                href={`/anime/season/${currentYear}/${currentSeason}`}
                className="text-base font-medium text-[#bbb] hover:text-white transition-colors"
              >
                Season Anime
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex flex-row items-center gap-4">
          <Link
            href="/search"
            className="p-2 text-[#bbb] hover:text-white transition-colors"
            aria-label="Search"
          >
            <Search size={22} />
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/library"
                className="p-2 text-[#bbb] hover:text-white transition-colors"
                aria-label="Library"
              >
                <Bookmark size={22} />
              </Link>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full">
                <User size={16} className="text-zinc-600 dark:text-zinc-400" />
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 max-w-[120px] truncate">
                  {user.fullName || user.email}
                </span>
              </div>
              <button
                onClick={() => logout()}
                className="p-2 text-zinc-600 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 transition-colors cursor-pointer"
                aria-label="Logout"
              >
                <LogOut size={20} />
              </button>
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
