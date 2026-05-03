import { getSession } from "@/lib/auth";
import { WatchlistButton } from "@/app/components/WatchlistButton";
import {
  listAnime,
  parseTopAnimeFilter,
  type TopAnimeFilter,
} from "@/lib/services/anime.service";
import { listWatchlistEntriesByMalIds } from "@/lib/services/watchlist.service";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, Star, Users } from "lucide-react";
import { RatingIcon10 } from "@/app/components/icons/Rating10Icon";
import { RatingIcon12 } from "@/app/components/icons/Rating12Icon";
import { RatingIcon14 } from "@/app/components/icons/Rating14Icon";
import { RatingIcon16 } from "@/app/components/icons/Rating16Icon";
import { RatingIcon18 } from "@/app/components/icons/Rating18Icon";
import { RatingIconAL } from "@/app/components/icons/RatingALIcon";

import { Pagination } from "@/app/components/Pagination";
import { TopFilters } from "@/app/components/TopFilters";

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

function getPageHref(page: number, filter: TopAnimeFilter | null) {
  if (!filter) {
    return page <= 1 ? "/anime/top" : `/anime/top?page=${page}`;
  }

  return page <= 1
    ? `/anime/top?filter=${filter}`
    : `/anime/top?filter=${filter}&page=${page}`;
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

function getRatingIcon(rating: string | null | undefined) {
  if (!rating) return null;

  const normalizedRating = rating.toLocaleLowerCase();

  if (
    /^rx\b/.test(normalizedRating) ||
    /hentai|adult|18\+|r18|a18|18 anos/.test(normalizedRating)
  ) {
    return <RatingIcon18 size={16} />;
  }

  if (/^r\b|r\+|nudity|17\+|a16|16 anos|mature/.test(normalizedRating)) {
    return <RatingIcon16 size={16} />;
  }

  if (/pg-13|teens|13\+|a14|14 anos/.test(normalizedRating)) {
    return <RatingIcon14 size={16} />;
  }

  if (/kids|children|a12|12 anos/.test(normalizedRating)) {
    return <RatingIcon12 size={16} />;
  }

  if (/^pg\b|a10|10 anos/.test(normalizedRating)) {
    return <RatingIcon10 size={16} />;
  }

  if (/^g\b|all ages|livre/.test(normalizedRating)) {
    return <RatingIconAL size={16} />;
  }

  return null;
}

export default async function AnimeListPage(props: PageProps<"/anime/top">) {
  const { page: pageParam, filter: filterParam } = await props.searchParams;
  const page = getPageNumber(pageParam);
  const filter = parseTopAnimeFilter(filterParam);
  const [session, { items: animeList, total, totalPages }] = await Promise.all([
    getSession(),
    listAnime({
      page,
      limit: PAGE_SIZE,
      filter: filter ?? undefined,
    }),
  ]);
  const watchlistEntries =
    session && animeList.length > 0
      ? await listWatchlistEntriesByMalIds(
          session.user.id,
          animeList.map((anime) => anime.malId),
        )
      : [];
  const watchlistByMalId = new Map(
    watchlistEntries.map((entry) => [
      entry.anime.malId,
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

  const FILTERS: Array<{ label: string; value: TopAnimeFilter | null }> = [
    { label: "All Anime", value: null },
    { label: "Top Airing", value: "airing" },
    { label: "Top Seasonal", value: "season" },
    { label: "Top Upcoming", value: "upcoming" },
    { label: "Top TV Series", value: "tv" },
    { label: "Top Movies", value: "movie" },
    { label: "Top OVAs", value: "ova" },
    { label: "Top ONAs", value: "ona" },
    { label: "Top Speciais", value: "special" },
    { label: "Most Popular", value: "bypopularity" },
    { label: "Most Favorited", value: "favorite" },
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="flex flex-col">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Top Anime
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Updated twice a day. (How do we rank shows?)
          </p>
        </div>

        <TopFilters
          basePath="/anime/top"
          filters={FILTERS}
          currentFilter={filter}
        />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:hidden ">
          {animeList.length > 0 ? (
            animeList.map((anime, index) => {
              const rankValue = filter
                ? startRank + index
                : anime.rank || anime.popularity || startRank + index;
              const detailHref = `/anime/${anime.malId}/${encodeURIComponent(
                anime.title,
              )}`;
              const ratingIcon = getRatingIcon(anime.rating);
              const watchlistEntry = watchlistByMalId.get(anime.malId);

              return (
                <article
                  key={anime.id}
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

                      {anime.imageUrl ? (
                        <div className="relative h-56 w-full">
                          <Image
                            src={anime.imageUrl}
                            alt={anime.title}
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
                        {anime.type ? (
                          <span className="w-fit rounded border border-[#345293] bg-gradient-to-br from-[#4F74C8] via-[#4065BA] to-[#2E51A2] px-1.5 py-0.5 text-[10px] font-black uppercase text-white shadow-sm dark:border-[#4065BA]/50 dark:shadow-[0_1px_8px_rgba(64,101,186,0.25)]">
                            {anime.type}
                          </span>
                        ) : null}

                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-[#8c8c8c] text-[#8c8c8c]" />
                          <span className="text-zinc-700 dark:text-zinc-300">
                            {anime.score ? anime.score.toFixed(2) : "N/A"}
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-[#8c8c8c]" />
                          <span className="text-zinc-500">
                            {formatMembers(anime.members)}
                          </span>
                        </span>
                      </div>

                      <h3 className="line-clamp-3 text-sm font-bold leading-tight text-zinc-900 dark:text-zinc-50">
                        {anime.title}
                      </h3>
                    </div>
                  </Link>

                  {/* Absolute positioned items outside the Link if they shouldn't trigger it, 
                      but since they are just overlays, they can stay inside relative container if needed.
                      However, to keep the Link clean, I'll move ratingIcon and bookmark back into the relative div inside the Link.
                  */}
                  <div className="absolute inset-0 pointer-events-none">
                    {ratingIcon ? (
                      <div className="absolute right-1 top-[200px] md:top-[180px] z-20">
                        {ratingIcon}
                      </div>
                    ) : null}

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
              No ranked anime available for this page.
            </div>
          )}
        </div>

        <div className="hidden w-full overflow-x-auto rounded-xl border border-zinc-200 shadow-sm overflow-hidden dark:border-zinc-800 lg:block">
          <table className="w-full text-left border-collapse bg-white dark:bg-zinc-950">
            <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-50 tracking-wider text-sm w-24">
                  Rank
                </th>
                <th className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-50 tracking-wider text-sm w-32">
                  Image
                </th>
                <th className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-50 tracking-wider text-sm">
                  Title
                </th>
                <th className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-50 tracking-wider text-sm text-center w-32">
                  Score
                </th>
                <th className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-50 tracking-wider text-sm text-center w-40">
                  Your Score
                </th>
                <th className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-50 tracking-wider text-sm text-center w-32">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {animeList.length > 0 ? (
                animeList.map((anime, index) => {
                  const watchlistEntry = watchlistByMalId.get(anime.malId);

                  return (
                    <tr
                      key={anime.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    >
                      <td className="px-6 py-8 align-middle">
                        <span className="text-3xl font-black text-zinc-400 dark:text-zinc-600">
                          #
                          {filter
                            ? startRank + index
                            : anime.rank ||
                              anime.popularity ||
                              startRank + index}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <Link
                          href={`/anime/${anime.malId}/${encodeURIComponent(anime.title)}`}
                        >
                          {anime.imageUrl ? (
                            <div className="relative h-28 w-20 overflow-hidden border border-zinc-200 shadow-sm dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                              <Image
                                src={anime.imageUrl}
                                alt={anime.title}
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
                            href={`/anime/${anime.malId}/${encodeURIComponent(anime.title)}`}
                            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          >
                            <h3 className="text-lg font-bold leading-tight text-zinc-900 dark:text-zinc-50">
                              {anime.title}
                            </h3>
                          </Link>
                          {anime.titleJapanese && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              {anime.titleJapanese}
                            </p>
                          )}
                          <div className="mt-1.5 flex flex-wrap gap-2">
                            {anime.type && (
                              <span className="rounded border border-indigo-100 bg-indigo-50 px-1.5 py-0.5 text-[9px] font-black uppercase text-indigo-600 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-400">
                                {anime.type}
                              </span>
                            )}
                            {anime.episodes && (
                              <span className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 text-[9px] font-black uppercase text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                                {anime.episodes} eps
                              </span>
                            )}
                          </div>
                          {(anime.airedFrom || anime.airedTo) && (
                            <p className="mt-0.5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">
                              {formatDate(anime.airedFrom)}
                              {anime.airedTo
                                ? ` - ${formatDate(anime.airedTo)}`
                                : ""}
                            </p>
                          )}
                          {anime.members !== null &&
                            anime.members !== undefined && (
                              <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                                {formatMembers(anime.members)} members
                              </p>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        <div className="inline-flex flex-col items-center">
                          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                            {anime.score ? anime.score.toFixed(2) : "N/A"}
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
                          <WatchlistButton
                            malId={anime.malId}
                            title={anime.title}
                            episodes={anime.episodes}
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
                    No ranked anime available for this page.
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
