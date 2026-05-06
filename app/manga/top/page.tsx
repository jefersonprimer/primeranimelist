import { getSession } from "@/lib/auth";
import { MangaWatchlistButton } from "@/app/components/MangaWatchlistButton";
import {
  listManga,
  parseTopMangaFilter,
  type TopMangaFilter,
} from "@/lib/services/manga.service";
import { listMangaWatchlistEntriesByMalIds } from "@/lib/services/manga-watchlist.service";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, Star, Users } from "lucide-react";

import { Pagination } from "@/app/components/Pagination";
import { TopFilters } from "@/app/components/TopFilters";
import { TopRankingInfoModal } from "@/app/components/TopRankingInfoModal";

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

function formatMembers(members: number | null | undefined) {
  if (members === null || members === undefined) {
    return "N/A";
  }

  return new Intl.NumberFormat("en-US").format(members);
}

function getRankBadgeStyles(rank: number) {
  if (rank === 1)
    return "bg-gradient-to-br from-yellow-400 to-amber-600 text-white border-yellow-300 shadow-lg shadow-yellow-500/20";
  if (rank === 2)
    return "bg-gradient-to-br from-zinc-200 to-zinc-400 text-zinc-800 border-zinc-100 shadow-lg shadow-zinc-400/20";
  if (rank === 3)
    return "bg-gradient-to-br from-orange-300 to-orange-500 text-white border-orange-200 shadow-lg shadow-orange-500/20";
  return "bg-zinc-900/80 backdrop-blur-sm text-zinc-100 border-white/10";
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
      <div className="flex flex-col">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Top Manga
          </h1>
          <div className="flex items-center my-2 gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span>Updated twice a day.</span>
            <TopRankingInfoModal />
          </div>
        </div>

        <TopFilters
          basePath="/manga/top"
          filters={FILTERS}
          currentFilter={filter}
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 md:grid-cols-4 lg:hidden">
          {mangaList.length > 0 ? (
            mangaList.map((manga, index) => {
              const rankValue = filter
                ? startRank + index
                : manga.rank || manga.popularity || startRank + index;
              const detailHref = `/manga/${manga.malId}/${encodeURIComponent(
                manga.title,
              )}`;
              const watchlistEntry = watchlistByMalId.get(manga.malId);

              return (
                <article
                  key={manga.id}
                  className="group relative overflow-hidden"
                >
                  <Link href={detailHref} className="block">
                    <div className="relative">
                      {/* Rank Badge */}
                      <div
                        className={`absolute left-0 top-0 z-20 flex h-8 w-10 items-center justify-center rounded-br-xl border-b border-r font-black text-sm shadow-md ${getRankBadgeStyles(rankValue)}`}
                      >
                        {rankValue}
                      </div>

                      {manga.imageUrl ? (
                        <div className="relative h-[300px] w-full">
                          <Image
                            src={manga.imageUrl}
                            alt={manga.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 320px"
                          />
                        </div>
                      ) : (
                        <div className="flex h-52 w-full items-center justify-center bg-zinc-200 dark:bg-zinc-800">
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            No image
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 py-2">
                      <div className="flex items-center text-xs font-bold text-[#8c8c8c] gap-2">
                        {manga.type ? (
                          <span className="w-fit rounded border border-[#345293] bg-gradient-to-br from-[#4F74C8] via-[#4065BA] to-[#2E51A2] px-1.5 py-0.5 text-[10px] font-black uppercase text-white shadow-sm dark:border-[#4065BA]/50 dark:shadow-[0_1px_8px_rgba(64,101,186,0.25)]">
                            {manga.type}
                          </span>
                        ) : null}

                        <span className="flex items-center gap-1 text-[#8c8c8c]">
                          <Star className="h-3 w-3 fill-[#8c8c8c]" />
                          {manga.score ? manga.score.toFixed(2) : "N/A"}
                        </span>
                        <span className="flex items-center gap-1 text-[#8c8c8c]">
                          <Users className="h-3 w-3 text-[#8c8c8c]" />
                          {formatMembers(manga.members)}
                        </span>
                      </div>

                      <h3 className="line-clamp-3 text-white text-sm font-bold leading-tight">
                        {manga.title}
                      </h3>
                    </div>
                  </Link>

                  <div className="absolute inset-0 pointer-events-none">
                    {watchlistEntry ? (
                      <>
                        <div className="absolute -right-[1px] -top-[1px] z-20 h-9 w-9 bg-black/90 [clip-path:polygon(100%_0,0_0,100%_100%)]" />
                        <div className="absolute -right-[1px] -top-[1px] z-30 p-0.5 text-white">
                          <Bookmark className="h-4 w-4 fill-current" />
                        </div>
                      </>
                    ) : null}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="col-span-full rounded-xl border border-zinc-200 bg-white px-4 py-10 text-center text-sm font-medium text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
              No ranked manga available for this page.
            </div>
          )}
        </div>

        <div className="hidden w-full overflow-x-auto rounded-xl border border-zinc-200 shadow-sm overflow-hidden dark:border-zinc-800 lg:block">
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
                            N/A
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

        <Pagination
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          currentPage={currentPage}
          totalPages={totalPages}
          prevHref={
            hasPreviousPage
              ? getPageHref(currentPage - 1, filter)
              : getPageHref(1, filter)
          }
          nextHref={
            hasNextPage
              ? getPageHref(currentPage + 1, filter)
              : getPageHref(currentPage, filter)
          }
        />
      </div>
    </div>
  );
}
