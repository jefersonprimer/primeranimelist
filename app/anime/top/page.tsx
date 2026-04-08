import { listAnime, parseTopAnimeFilter, type TopAnimeFilter } from "@/lib/services/anime.service";
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

function getPageHref(page: number, filter: TopAnimeFilter | null) {
  if (!filter) {
    return page <= 1 ? "/anime/top" : `/anime/top?page=${page}`;
  }

  return page <= 1 ? `/anime/top?filter=${filter}` : `/anime/top?filter=${filter}&page=${page}`;
}

export default async function AnimeListPage(props: PageProps<"/anime/top">) {
  const { page: pageParam, filter: filterParam } = await props.searchParams;
  const page = getPageNumber(pageParam);
  const filter = parseTopAnimeFilter(filterParam);
  const { items: animeList, total, totalPages } = await listAnime({
    page,
    limit: PAGE_SIZE,
    filter: filter ?? undefined,
  });
  const currentPage = Math.min(page, totalPages);
  const startRank = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endRank = total === 0 ? 0 : startRank + animeList.length - 1;
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const FILTERS: Array<{ label: string; value: TopAnimeFilter | null }> = [
    { label: "All Anime", value: null },
    { label: "Top Airing", value: "airing" },
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
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 uppercase italic">
            Top Anime
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            Most popular anime on PrimerAnimeList
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white/80 px-4 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Ranking
            </p>
            <p className="mt-1 text-base font-bold text-zinc-900 dark:text-zinc-50">
              {total === 0
                ? "No ranked anime found"
                : `Showing #${startRank} to #${endRank} of ${total}`}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <Link
              href={hasPreviousPage ? getPageHref(currentPage - 1, filter) : getPageHref(1, filter)}
              aria-disabled={!hasPreviousPage}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                hasPreviousPage
                  ? "border-zinc-300 text-zinc-900 hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
                  : "pointer-events-none border-zinc-200 text-zinc-400 dark:border-zinc-800 dark:text-zinc-600"
              }`}
            >
              <span aria-hidden="true">←</span>
              Previous 50
            </Link>

            <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
              Page {currentPage} of {totalPages}
            </span>

            <Link
              href={hasNextPage ? getPageHref(currentPage + 1, filter) : getPageHref(currentPage, filter)}
              aria-disabled={!hasNextPage}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                hasNextPage
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700 hover:border-indigo-400 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:border-indigo-700 dark:hover:bg-indigo-900"
                  : "pointer-events-none border-zinc-200 text-zinc-400 dark:border-zinc-800 dark:text-zinc-600"
              }`}
            >
              Next 50
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white/80 px-2 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80">
          <nav className="flex items-center gap-2 overflow-x-auto whitespace-nowrap px-1 py-1">
            {FILTERS.map((item) => {
              const isActive = item.value === filter;
              const href = item.value ? `/anime/top?filter=${item.value}` : "/anime/top";

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

        <div className="w-full overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse bg-white dark:bg-zinc-950">
            <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider text-sm w-24">Rank</th>
                <th className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider text-sm w-32">Image</th>
                <th className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider text-sm">Title</th>
                <th className="px-6 py-4 font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider text-sm text-center w-32">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {animeList.length > 0 ? (
                animeList.map((anime, index) => (
                  <tr key={anime.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                    <td className="px-6 py-8 align-middle">
                      <span className="text-3xl font-black text-zinc-400 dark:text-zinc-600">
                        #{filter ? startRank + index : anime.rank || anime.popularity || startRank + index}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <Link href={`/anime/${anime.malId}/${encodeURIComponent(anime.title)}`}>
                        {anime.imageUrl ? (
                          <div className="relative h-28 w-20 overflow-hidden rounded border border-zinc-200 shadow-sm dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
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
                            <span className="text-[10px] text-zinc-400">No image</span>
                          </div>
                        )}
                      </Link>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-col gap-1">
                        <Link href={`/anime/${anime.malId}/${encodeURIComponent(anime.title)}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400"
                  >
                    No ranked anime available for this page.
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
