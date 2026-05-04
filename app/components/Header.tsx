"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { AdminNavActions } from "./AdminNavActions";

import UserModal from "./UserModal";
import AnonymousUserModal from "./AnonymousUserModal";
import { UserProfile } from "@/types/UserProfile";
import { usePathname } from "next/navigation";

import { Menu, ChevronDown, MenuIcon } from "lucide-react";
import { LogoIcon } from "./icons/LogoIcon";
import { LogoMobileIcon } from "./icons/LogoMobileIcon";
import { SearchIcon } from "./icons/SearchIcon";
import { BookmarkIcon } from "./icons/BookmarkIcon";
import { DropdownIcon } from "./icons/DropdownIcon";

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
  const pathname = usePathname();

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isAnonymousModalOpen, setIsAnonymousModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNewsDropdownOpen, setIsNewsDropdownOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] =
    useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsNewsDropdownOpen(false);
    setIsCategoriesDropdownOpen(false);
  }, [pathname]);

  // Close news dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isNewsDropdownOpen && !target.closest(".news-dropdown-container")) {
        setIsNewsDropdownOpen(false);
      }
      if (
        isCategoriesDropdownOpen &&
        !target.closest(".categories-dropdown-container")
      ) {
        setIsCategoriesDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNewsDropdownOpen]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const userProfile: UserProfile | null = user
    ? {
        id: user.id.toString(),
        email: user.email,
        username: user.email.split("@")[0],
        display_name: user.fullName || user.email.split("@")[0],
        profile_image_url: user.profileImageUrl || null,
        background_image_url: user.backgroundImageUrl || null,
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

  const navLinks = [
    { href: "/anime/top", label: "Anime" },
    { href: "/manga/top", label: "Manga" },
    {
      href: `/anime/season/${currentYear}/${currentSeason}`,
      label: "Season Anime",
    },
    { href: "/categories", label: "Categories" },
    { href: "/news", label: "News" },
  ];

  if (loading) {
    return (
      <header className="h-16 bg-[#272727] px-4">
        <div className="mx-auto flex h-full max-w-7xl flex-row items-center justify-between animate-pulse">
          <div className="flex flex-row items-center">
            <span className="hidden lg:flex">
              <LogoIcon />
            </span>

            <span className="flex lg:hidden gap-6">
              <MenuIcon size={24} />
              <LogoMobileIcon />
            </span>
          </div>

          <nav className="hidden md:flex flex-1 px-6">
            <div className="flex gap-4">
              <div className="h-4 w-20 bg-zinc-700/60" />
              <div className="h-4 w-16 bg-zinc-700/60" />
              <div className="h-4 w-16 bg-zinc-700/60" />
              <div className="h-4 w-16 bg-zinc-700/60" />
              <div className="h-4 w-20 bg-zinc-700/60" />
            </div>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hiden md:flex h-6 w-6 bg-zinc-700/60 rounded-full" />
            <div className="h-6 w-6 bg-zinc-700/60 rounded-full" />

            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-zinc-700/60" />
              <DropdownIcon size={24} />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="h-16 w-full bg-[#272727] sticky top-0 z-[1000]">
        <div className="flex w-full h-full flex-row items-center justify-between">
          <div className="flex flex-row items-center h-full">
            {/* Mobile Menu Toggle - Now on the left */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`flex h-full items-center px-4 transition-colors lg:hidden hover:bg-[#151515] hover:cursor-pointer ${
                isMenuOpen
                  ? "bg-[#151515] text-white"
                  : "text-[#bbb] hover:text-white"
              }`}
              aria-label="Toggle Menu"
            >
              <Menu size={24} />
            </button>

            <Link
              href="/"
              className="flex flex-row items-center text-[#ff640a] hover:text-white px-4 lg:px-0 lg:pl-4"
            >
              <span className="hidden lg:flex">
                <LogoIcon />
              </span>

              <span className="flex lg:hidden">
                <LogoMobileIcon />
              </span>
            </Link>

            <nav className="hidden md:flex lg:hidden h-full items-center">
              <Link
                href="/anime/top"
                className="flex h-full items-center px-3 text-sm font-medium text-[#bbb] transition-colors hover:bg-[#181818] hover:text-white"
              >
                Anime
              </Link>
              <Link
                href="/manga/top"
                className="flex h-full items-center px-3 text-sm font-medium text-[#bbb] transition-colors hover:bg-[#181818] hover:text-white"
              >
                Manga
              </Link>
              <Link
                href={`/anime/season/${currentYear}/${currentSeason}`}
                className="flex h-full items-center px-3 text-sm font-medium text-[#bbb] transition-colors hover:bg-[#181818] hover:text-white"
              >
                Season Anime
              </Link>
            </nav>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex h-full flex-1 px-6">
            <ul className="flex h-full flex-row">
              {navLinks.map((link) => (
                <li key={link.href} className="h-full relative group">
                  {link.label === "Categories" ? (
                    <div className="h-full categories-dropdown-container">
                      <button
                        onClick={() =>
                          setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)
                        }
                        className={`flex h-full items-center px-4 text-sm font-medium transition-colors hover:cursor-pointer hover:bg-[#181818] hover:text-white ${
                          isCategoriesDropdownOpen
                            ? "bg-[#181818] text-white"
                            : "text-[#bbb]"
                        }`}
                      >
                        {link.label}
                        <DropdownIcon size={24} />
                      </button>
                      {isCategoriesDropdownOpen && (
                        <div className="absolute top-full left-0 w-[820px] bg-[#181818] shadow-2xl py-2 z-[1001] animate-in fade-in slide-in-from-top-1 duration-200">
                          <div className="grid grid-cols-4">
                            {/* Main Options Column */}
                            <div className="flex flex-col border-r border-white/5">
                              <Link
                                href="/videos/alphabetical"
                                onClick={() =>
                                  setIsCategoriesDropdownOpen(false)
                                }
                                className="text-sm font-bold text-[#f8f8f8] hover:text-white hover:bg-[#272727] py-2 px-4 transition-colors"
                              >
                                Browse All (A-Z)
                              </Link>
                              <Link
                                href="/calendar"
                                onClick={() =>
                                  setIsCategoriesDropdownOpen(false)
                                }
                                className="text-sm font-bold text-[#f8f8f8] hover:text-white hover:bg-[#272727] py-2 px-4 transition-colors"
                              >
                                Release Calendar
                              </Link>
                              <Link
                                href="/anime/music"
                                onClick={() =>
                                  setIsCategoriesDropdownOpen(false)
                                }
                                className="text-sm font-bold text-[#f8f8f8] hover:text-white hover:bg-[#272727] py-2 px-4 transition-colors"
                              >
                                Music Videos & Concerts
                              </Link>
                            </div>

                            {/* Genres Section - 3 Columns */}
                            <div className="col-span-3">
                              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 py-2 px-4">
                                Genres
                              </h3>
                              <div className="grid grid-cols-3">
                                {/* Genre Col 1 */}
                                <div className="flex flex-col">
                                  {[
                                    "Action",
                                    "Adventure",
                                    "Comedy",
                                    "Drama",
                                    "Fantasy",
                                  ].map((genre) => (
                                    <Link
                                      key={genre}
                                      href={`/videos/${genre.toLowerCase()}`}
                                      onClick={() =>
                                        setIsCategoriesDropdownOpen(false)
                                      }
                                      className="text-sm text-[#bbb] hover:text-white hover:bg-[#272727] py-2 px-4 transition-colors"
                                    >
                                      {genre}
                                    </Link>
                                  ))}
                                </div>
                                {/* Genre Col 2 */}
                                <div className="flex flex-col">
                                  {[
                                    "Music",
                                    "Romance",
                                    "Sci-Fi",
                                    "Seinen",
                                    "Shojo",
                                  ].map((genre) => (
                                    <Link
                                      key={genre}
                                      href={`/videos/${genre.toLowerCase()}`}
                                      onClick={() =>
                                        setIsCategoriesDropdownOpen(false)
                                      }
                                      className="text-sm text-[#bbb] hover:text-white hover:bg-[#272727] py-2 px-4 transition-colors"
                                    >
                                      {genre}
                                    </Link>
                                  ))}
                                </div>
                                {/* Genre Col 3 */}
                                <div className="flex flex-col">
                                  {[
                                    "Shonen",
                                    "Slice of Life",
                                    "Sports",
                                    "Supernatural",
                                    "Thriller",
                                  ].map((genre) => (
                                    <Link
                                      key={genre}
                                      href={`/videos/${genre.toLowerCase()}`}
                                      onClick={() =>
                                        setIsCategoriesDropdownOpen(false)
                                      }
                                      className="text-sm text-[#bbb] hover:text-white transition-colors hover:bg-[#272727] py-2 px-4"
                                    >
                                      {genre}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : link.label === "News" ? (
                    <div className="h-full news-dropdown-container flex items-center">
                      <div className="w-[1px] h-[20px] bg-[#4A4E58] my-0 mx-[4px]" />

                      <button
                        onClick={() =>
                          setIsNewsDropdownOpen(!isNewsDropdownOpen)
                        }
                        className={`flex h-full items-center px-4  text-sm font-medium transition-colors hover:cursor-pointer hover:bg-[#181818] hover:text-white ${
                          isNewsDropdownOpen
                            ? "bg-[#181818] text-white"
                            : "text-[#bbb]"
                        }`}
                      >
                        {link.label}
                        <DropdownIcon size={24} />
                      </button>
                      {isNewsDropdownOpen && (
                        <div className="absolute top-full left-0 w-56 bg-[#181818] shadow-2xl py-2 z-[1001] animate-in fade-in slide-in-from-top-1 duration-200">
                          <Link
                            href="/news"
                            onClick={() => setIsNewsDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-[#bbb] hover:bg-[#272727] hover:text-white transition-colors"
                          >
                            All news
                          </Link>
                          <Link
                            href="/news/anime-awards"
                            onClick={() => setIsNewsDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-[#bbb] hover:bg-[#272727] hover:text-white transition-colors"
                          >
                            Anime Awards
                          </Link>
                          <Link
                            href="/news/events-experiences"
                            onClick={() => setIsNewsDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-[#bbb] hover:bg-[#272727] hover:text-white transition-colors"
                          >
                            Events & Experiences
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className="flex h-full items-center px-4 text-sm font-medium text-[#bbb] transition-colors hover:bg-[#181818] hover:text-white"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex h-full flex-row items-center">
            <div className="hidden md:flex h-full items-center">
              <AdminNavActions />
            </div>

            <Link
              href="/search"
              className="flex h-full items-center px-4 text-[#bbb] transition-colors hover:bg-[#181818] hover:text-white"
              aria-label="Search"
            >
              <SearchIcon size={24} />
            </Link>

            <div className="flex h-full items-center">
              {user && (
                <Link
                  href="/watchlist"
                  className="hidden min-[641px]:flex h-full items-center px-4 text-[#bbb] transition-colors hover:bg-[#181818] hover:text-white"
                  aria-label="Library"
                >
                  <BookmarkIcon size={24} />
                </Link>
              )}

              <button
                type="button"
                onClick={handleUserClick}
                className={`flex h-full items-center gap-1 px-4 transition-colors hover:bg-[#151515] hover:text-white cursor-pointer focus:outline-none ${
                  isUserModalOpen || isAnonymousModalOpen
                    ? "bg-[#151515] text-white"
                    : "text-[#bbb]"
                }`}
                aria-label="User Menu"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-500">
                  {user?.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt="Profile"
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : user ? (
                    getUserInitial(user.fullName, user.email)
                  ) : (
                    <svg
                      className="w-4 h-4 fill-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z" />
                    </svg>
                  )}
                </div>
                <DropdownIcon size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-x-0 bottom-0 top-16 z-[1001] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Sidebar (mobile/tablet) */}
      <aside
        className={`fixed left-0 bottom-0 top-16 z-[1002] overflow-y-auto h-[calc(100vh-4rem)] w-full md:w-[300px] bg-[#151515] shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
      >
        <nav className="pt-3">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                {link.label === "Categories" ? (
                  <div className="flex flex-col">
                    {[
                      {
                        label: "Browse All (A-Z)",
                        href: "/videos/alphabetical",
                      },
                      {
                        label: "Release Calendar",
                        href: "/calendar",
                      },
                      {
                        label: "Music Videos & Concerts",
                        href: "/anime/music",
                      },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-base font-medium text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-white"
                      >
                        {item.label}
                      </Link>
                    ))}

                    <div className="flex flex-col border-b-2 border-[#23252B]">
                      <button
                        onClick={() =>
                          setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)
                        }
                        className={`flex w-full items-center justify-between px-4 py-3 text-base font-medium transition-colors ${
                          isCategoriesDropdownOpen
                            ? "bg-indigo-600/10 text-indigo-400"
                            : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                        }`}
                      >
                        {link.label}
                        <ChevronDown size={24} />
                      </button>
                      {isCategoriesDropdownOpen && (
                        <div className="flex flex-col space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                          {/* Genres */}
                          <div className="flex flex-col">
                            {[
                              "Action",
                              "Adventure",
                              "Comedy",
                              "Drama",
                              "Fantasy",
                              "Music",
                              "Romance",
                              "Sci-Fi",
                              "Seinen",
                              "Shojo",
                              "Shonen",
                              "Slice of Life",
                              "Sports",
                              "Supernatural",
                              "Thriller",
                            ].map((genre) => (
                              <Link
                                key={genre}
                                href={`/search?genre=${genre.toLowerCase()}`}
                                onClick={() => {
                                  setIsCategoriesDropdownOpen(false);
                                  setIsMenuOpen(false);
                                }}
                                className="px-4 py-3 text-xs text-zinc-500 hover:bg-zinc-800/50 hover:text-white transition-colors"
                              >
                                {genre}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : link.label === "News" ? (
                  <div className="flex flex-col">
                    <button
                      onClick={() => setIsNewsDropdownOpen(!isNewsDropdownOpen)}
                      className={`flex w-full items-center justify-between px-4 py-3 text-base font-medium transition-colors ${
                        isNewsDropdownOpen
                          ? "bg-indigo-600/10 text-indigo-400"
                          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                      }`}
                    >
                      {link.label}
                      <ChevronDown size={24} />
                    </button>
                    {isNewsDropdownOpen && (
                      <div className="flex flex-col space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        <Link
                          href="/news"
                          onClick={() => {
                            setIsNewsDropdownOpen(false);
                            setIsMenuOpen(false);
                          }}
                          className="px-4 py-3 text-sm font-medium text-zinc-500 hover:bg-zinc-800/50 hover:text-white transition-colors"
                        >
                          All news
                        </Link>
                        <Link
                          href="/news/anime-awards"
                          onClick={() => {
                            setIsNewsDropdownOpen(false);
                            setIsMenuOpen(false);
                          }}
                          className="px-4 py-3 text-sm font-medium text-zinc-500 hover:bg-zinc-800/50 hover:text-white transition-colors"
                        >
                          Anime Awards
                        </Link>
                        <Link
                          href="/news/events-experiences"
                          onClick={() => {
                            setIsNewsDropdownOpen(false);
                            setIsMenuOpen(false);
                          }}
                          className="px-4 py-3 text-sm font-medium text-zinc-500 hover:bg-zinc-800/50 hover:text-white transition-colors"
                        >
                          Events & Experiences
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className={`flex items-center px-4 py-3 text-base font-medium transition-colors ${
                      pathname === link.href
                        ? "bg-indigo-600/10 text-indigo-400"
                        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {user?.isAdmin && (
            <div className="mt-8 border-t border-white/5 pt-6">
              <span className="px-4 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                Admin Actions
              </span>
              <div className="mt-4 space-y-4 px-4">
                <AdminNavActions />
              </div>
            </div>
          )}
        </nav>
      </aside>

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        userProfile={userProfile}
      />

      <AnonymousUserModal
        isOpen={isAnonymousModalOpen}
        onClose={() => setIsAnonymousModalOpen(false)}
      />
    </>
  );
}
