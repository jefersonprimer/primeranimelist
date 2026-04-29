import { getSession } from "@/lib/auth";
import { MangaWatchlistButton } from "@/app/components/MangaWatchlistButton";
import {
  listManga,
  parseTopMangaFilter,
  type TopMangaFilter,
} from "@/lib/services/manga.service";
import { listMangaWatchlistEntriesByMalIds } from "@/lib/services/manga-watchlist.service";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

function getPageNumber(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(rawValue ?? "1", 10);

  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return page;
}

function getPageHref(page: number, filter: TopMangaFilter | null) {
  if (!filter) {
    return page <= 1 ? "/manga/top" : `/manga/top?page=${page}`;
  }

  return page <= 1
    ? `/manga/top?filter=${filter}`
    : `/manga/top?filter=${filter}&page=${page}`;
}

function formatDate(date: Date | null | undefined) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function MangaListPage(props: PageProps<"/manga/top">) {
  const { page: pageParam, filter: filterParam } = await props.searchParams;
  const page = getPageNumber(pageParam);
  const filter = parseTopMangaFilter(filterParam);
  const [session, { items: mangaList, total, totalPages }] = await Promise.all([
    getSession(),
    listManga({
      page,
      limit: PAGE_SIZE,
      filter: filter ?? undefined,
    }),
  ]);
  const watchlistEntries =
    session && mangaList.length > 0
      ? await listMangaWatchlistEntriesByMalIds(
          session.user.id,
          mangaList.map((manga) => manga.malId),
        )
      : [];
  const watchlistByMalId = new Map(
    watchlistEntries.map((entry) => [
      entry.manga.malId,
      {
        status: entry.status,
        score: entry.score,
      },
    ]),
  );
  const currentPage = Math.min(page, totalPages);
  const startRank = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endRank = total === 0 ? 0 : startRank + mangaList.length - 1;
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const FILTERS: Array<{ label: string; value: TopMangaFilter | null }> = [
    { label: "All Manga", value: null },
    { label: "Top Manga", value: "manga" },
    { label: "Top One-shots", value: "oneshots" },
    { label: "Top Doujinshi", value: "doujin" },
    { label: "Top Novels", value: "novels" },
    { label: "Top Manhwa", value: "manhwa" },
    { label: "Top Manhua", value: "manhua" },
    { label: "Most Popular", value: "bypopularity" },
    { label: "Most Favorited", value: "favorite" },
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Top Manga
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Updated twice a day. (How do we rank series?)
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white/80 px-4 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Ranking
            </p>
            <p className="mt-1 text-base font-bold text-zinc-900 dark:text-zinc-50">
              {total === 0
                ? "No ranked manga found"
                : `Showing #${startRank} to #${endRank} of ${total}`}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <Link
              href={
                hasPreviousPage
                  ? getPageHref(currentPage - 1, filter)
                  : getPageHref(1, filter)
              }
              aria-disabled={!hasPreviousPage}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                hasPreviousPage
                  ? "border-zinc-300 text-zinc-900 hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
                  : "pointer-events-none border-zinc-200 text-zinc-400 dark:border-zinc-800 dark:text-zinc-600"
              }`}
            >
              <ChevronLeft />
              Previous 50
            </Link>

            <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
              Page {currentPage} of {totalPages}
            </span>

            <Link
              href={
                hasNextPage
                  ? getPageHref(currentPage + 1, filter)
                  : getPageHref(currentPage, filter)
              }
              aria-disabled={!hasNextPage}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                hasNextPage
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700 hover:border-indigo-400 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:border-indigo-700 dark:hover:bg-indigo-900"
                  : "pointer-events-none border-zinc-200 text-zinc-400 dark:border-zinc-800 dark:text-zinc-600"
              }`}
            >
              Next 50
              <ChevronRight />
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white/80 px-2 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80">
          <nav className="flex items-center gap-2 overflow-x-auto whitespace-nowrap px-1 py-1">
            {FILTERS.map((item) => {
              const isActive = item.value === filter;
              const href = item.value
                ? `/manga/top?filter=${item.value}`
                : "/manga/top";

              return (
                <Link
                  key={item.value ?? "all"}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-bold transition-colors ${
                    isActive
                      ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                      : "border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="w-full overflow-x-auto rounded-xl border border-zinc-200 shadow-sm overflow-hidden dark:border-zinc-800">
          <table className="w-full border-collapse bg-white text-left dark:bg-zinc-950">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <tr>
                <th className="w-24 px-6 py-4 text-sm font-bold tracking-wider text-zinc-900 dark:text-zinc-50">
                  Rank
                </th>
                <th className="w-32 px-6 py-4 text-sm font-bold tracking-wider text-zinc-900 dark:text-zinc-50">
                  Image
                </th>
                <th className="px-6 py-4 text-sm font-bold tracking-wider text-zinc-900 dark:text-zinc-50">
                  Title
                </th>
                <th className="w-32 px-6 py-4 text-center text-sm font-bold tracking-wider text-zinc-900 dark:text-zinc-50">
                  Score
                </th>
                <th className="w-40 px-6 py-4 text-center text-sm font-bold tracking-wider text-zinc-900 dark:text-zinc-50">
                  Your Score
                </th>
                <th className="w-32 px-6 py-4 text-center text-sm font-bold tracking-wider text-zinc-900 dark:text-zinc-50">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {mangaList.length > 0 ? (
                mangaList.map((manga, index) => {
                  const watchlistEntry = watchlistByMalId.get(manga.malId);

                  return (
                    <tr
                      key={manga.id}
                      className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    >
                      <td className="px-6 py-8 align-middle">
                        <span className="text-3xl font-black text-zinc-400 dark:text-zinc-600">
                          #
                          {filter
                            ? startRank + index
                            : manga.rank ||
                              manga.popularity ||
                              startRank + index}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <Link
                          href={`/manga/${manga.malId}/${encodeURIComponent(manga.title)}`}
                        >
                          {manga.imageUrl ? (
                            <div className="relative h-28 w-20 overflow-hidden border border-zinc-200 shadow-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700">
                              <Image
                                src={manga.imageUrl}
                                alt={manga.title}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            </div>
                          ) : (
                            <div className="flex h-28 w-20 items-center justify-center rounded bg-zinc-200 dark:bg-zinc-800">
                              <span className="text-[10px] text-zinc-400">
                                No image
                              </span>
                            </div>
                          )}
                        </Link>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div className="flex flex-col gap-1">
                          <Link
                            href={`/manga/${manga.malId}/${encodeURIComponent(manga.title)}`}
                            className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                          >
                            <h3 className="text-lg font-bold leading-tight text-zinc-900 dark:text-zinc-50">
                              {manga.title}
                            </h3>
                          </Link>
                          {manga.titleJapanese && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              {manga.titleJapanese}
                            </p>
                          )}
                          <div className="mt-1.5 flex flex-wrap gap-2">
                            {manga.type && (
                              <span className="rounded border border-indigo-100 bg-indigo-50 px-1.5 py-0.5 text-[9px] font-black uppercase text-indigo-600 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-400">
                                {manga.type}
                              </span>
                            )}
                            {manga.volumes && (
                              <span className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 text-[9px] font-black uppercase text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                                {manga.volumes} vols
                              </span>
                            )}
                            {manga.chapters && (
                              <span className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 text-[9px] font-black uppercase text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                                {manga.chapters} chs
                              </span>
                            )}
                          </div>
                          {(manga.publishedFrom || manga.publishedTo) && (
                            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-tight text-zinc-500 dark:text-zinc-400">
                              {formatDate(manga.publishedFrom)}
                              {manga.publishedTo
                                ? ` - ${formatDate(manga.publishedTo)}`
                                : ""}
                            </p>
                          )}
                          {manga.members !== null &&
                            manga.members !== undefined && (
                              <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                                {new Intl.NumberFormat("en-US").format(
                                  manga.members,
                                )}{" "}
                                members
                              </p>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        <div className="inline-flex flex-col items-center">
                          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                            {manga.score ? manga.score.toFixed(2) : "N/A"}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                            Score
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        {watchlistEntry ? (
                          <span className="text-base font-black text-zinc-900 dark:text-zinc-50">
                            {watchlistEntry.score ?? "N/A"}
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
                            -
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        {watchlistEntry ? (
                          <span className="inline-flex rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                            {watchlistEntry.status}
                          </span>
                        ) : (
                          <MangaWatchlistButton
                            malId={manga.malId}
                            title={manga.title}
                            volumes={manga.volumes}
                            chapters={manga.chapters}
                            triggerLabel="Add to my list"
                            triggerClassName="inline-flex items-center justify-center rounded-full border border-indigo-300 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 transition-colors hover:border-indigo-400 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:border-indigo-700 dark:hover:bg-indigo-900"
                          />
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400"
                  >
                    No ranked manga available for this page.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
