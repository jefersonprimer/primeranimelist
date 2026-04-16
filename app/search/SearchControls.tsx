"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const RECENT_SEARCHES_STORAGE_KEY = "recent-searches";
const MAX_RECENT_SEARCHES = 8;

function buildSearchHref(query: string) {
  const params = new URLSearchParams();

  if (query.trim()) {
    params.set("q", query.trim());
  }

  const search = params.toString();
  return search ? `/search?${search}` : "/search";
}

function readRecentSearches() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  } catch {
    return [];
  }
}

function writeRecentSearches(searches: string[]) {
  window.localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(searches));
}

export function SearchControls({ query }: { query: string }) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const storedSearches = readRecentSearches();

    if (!query) {
      setRecentSearches(storedSearches);
      return;
    }

    const normalizedQuery = query.trim();
    const nextSearches = [
      normalizedQuery,
      ...storedSearches.filter((item) => item.toLocaleLowerCase() !== normalizedQuery.toLocaleLowerCase()),
    ].slice(0, MAX_RECENT_SEARCHES);

    writeRecentSearches(nextSearches);
    setRecentSearches(nextSearches);
  }, [query]);

  function removeRecentSearch(searchToRemove: string) {
    const nextSearches = recentSearches.filter(
      (item) => item.toLocaleLowerCase() !== searchToRemove.toLocaleLowerCase(),
    );

    writeRecentSearches(nextSearches);
    setRecentSearches(nextSearches);
  }

  function clearRecentSearches() {
    window.localStorage.removeItem(RECENT_SEARCHES_STORAGE_KEY);
    setRecentSearches([]);
  }

  return (
    <div>
      <form action="/search" method="get" className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <label className="flex items-center gap-3 border-b-2 border-[#636363] bg-transparent py-3">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search..."
            className="w-full bg-transparent text-3xl font-medium text-zinc-900 outline-none placeholder:text-[#636363] dark:text-zinc-50"
          />
        </label>
      </form>

      {!query && recentSearches.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-white">Recent Search Results</h3>
            <button
              type="button"
              onClick={clearRecentSearches}
              className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 hover:cursor-pointer"
            >
              Clear Recent
            </button>
          </div>

          <div className="mt-4 flex flex-row gap-2">
            {recentSearches.map((item) => (
              <div
                key={item.toLocaleLowerCase()}
                className="flex items-center justify-between"
              >
                <Link
                  href={buildSearchHref(item)}
                  className="min-w-0 flex-1 px-2 py-1 truncate text-sm font-bold text-[#bbb] transition-colors hover:text-indigo-600 bg-[#324953] uppercase"
                >
                  {item}
                </Link>

                <button
                  type="button"
                  aria-label={`Remove ${item} from recent searches`}
                  onClick={() => removeRecentSearch(item)}
                  className="p-1 text-[#f2f2f2] transition-colors bg-[#334953] hover:cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
