import { listManga, parseTopMangaFilter, type TopMangaFilter } from "@/lib/services/manga.service";
import Link from "next/link";
import { MangaCard } from "@/app/components/MangaCard";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

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

function getPageHrefWithFilter(page: number, filter: TopMangaFilter | null) {
  if (!filter) {
    return page <= 1 ? "/manga/top" : `/manga/top?page=${page}`;
  }

  return page <= 1 ? `/manga/top?filter=${filter}` : `/manga/top?filter=${filter}&page=${page}`;
}

export default async function MangaListPage(props: PageProps<"/manga/top">) {
  const { page: pageParam, filter: filterParam } = await props.searchParams;
  const page = getPageNumber(pageParam);
  const filter = parseTopMangaFilter(filterParam);
  const { items: mangaList, total, totalPages } = await listManga({
    page,
    limit: PAGE_SIZE,
    filter: filter ?? undefined,
  });
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
    <main className="relative min-h-screen w-full overflow-hidden bg-zinc-50 py-12 dark:bg-zinc-950/40">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header - Manga Carousel Style */}
        <div className="relative z-20 mb-16">
          <div className="relative">
            <div className="absolute -left-4 -top-6 h-12 w-12 bg-indigo-600/10 dark:bg-indigo-400/10 rounded-full blur-2xl" />
            <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400 mb-2">
              Ranking Collection
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase italic leading-none">
              Top Manga
            </h1>
            <div className="mt-4 flex gap-1">
              <div className="h-2 w-16 bg-indigo-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]" />
              <div className="h-2 w-6 bg-zinc-900 dark:bg-zinc-100" />
              <div className="h-2 w-4 bg-zinc-300 dark:bg-zinc-700" />
            </div>
            <p className="mt-6 max-w-xl text-lg font-bold text-zinc-600 dark:text-zinc-400 italic">
              Explore the most acclaimed and popular manga in the community.
            </p>
          </div>
        </div>

        {/* Filters & Navigation Toolbar */}
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mb-4">
              Filter by Category
            </span>
            <nav className="flex flex-wrap items-center gap-3">
              {FILTERS.map((item) => {
                const isActive = item.value === filter;
                const href = item.value ? `/manga/top?filter=${item.value}` : "/manga/top";

                return (
                  <Link
                    key={item.value ?? "all"}
                    href={href}
                    className={`px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                        : "bg-white text-zinc-900 border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-100 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-col gap-4 min-w-[300px]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Found</span>
                 <span className="text-xl font-black italic text-indigo-600 dark:text-indigo-400 leading-none">
                    {total.toLocaleString()} Manga
                 </span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={hasPreviousPage ? getPageHrefWithFilter(currentPage - 1, filter) : "#"}
                  className={`flex h-12 w-12 items-center justify-center border-2 border-zinc-900 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all dark:border-white dark:bg-zinc-900 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] ${
                    hasPreviousPage ? "hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-indigo-50 dark:hover:bg-indigo-950/30" : "opacity-30 pointer-events-none"
                  }`}
                >
                  <ArrowBigLeft className="h-6 w-6" />
                </Link>
                <div className="flex h-12 px-4 items-center justify-center border-2 border-zinc-900 bg-zinc-900 text-white font-black italic shadow-[4px_4px_0px_0px_rgba(79,70,229,0.5)] dark:border-white dark:bg-white dark:text-black">
                  {currentPage} / {totalPages}
                </div>
                <Link
                  href={hasNextPage ? getPageHrefWithFilter(currentPage + 1, filter) : "#"}
                  className={`flex h-12 w-12 items-center justify-center border-2 border-zinc-900 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all dark:border-white dark:bg-zinc-900 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] ${
                    hasNextPage ? "hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-indigo-50 dark:hover:bg-indigo-950/30" : "opacity-30 pointer-events-none"
                  }`}
                >
                  <ArrowBigRight className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Manga Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-16 gap-x-6 md:gap-x-10">
          {mangaList.length > 0 ? (
            mangaList.map((manga, index) => (
              <MangaCard
                key={manga.id}
                malId={manga.malId}
                title={manga.title}
                imageUrl={manga.imageUrl}
                score={manga.score}
                type={manga.type}
                chapters={manga.chapters}
                volumes={manga.volumes}
                rank={filter ? startRank + index : (manga.rank || manga.popularity || startRank + index)}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-32 border-4 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
              <p className="text-2xl font-black uppercase italic text-zinc-300 dark:text-zinc-700">
                Empty Database
              </p>
            </div>
          )}
        </div>

        {/* Bottom Pagination */}
        {totalPages > 1 && (
          <div className="mt-20 flex justify-center items-center gap-4">
             <Link
              href={hasPreviousPage ? getPageHrefWithFilter(currentPage - 1, filter) : "#"}
              className={`flex items-center gap-2 px-6 py-3 border-2 border-zinc-900 bg-white text-xs font-black uppercase tracking-[0.2em] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all dark:border-white dark:bg-zinc-900 dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] ${
                hasPreviousPage ? "hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-indigo-50 dark:hover:bg-indigo-950/30" : "opacity-30 pointer-events-none"
              }`}
            >
              <ArrowBigLeft className="h-5 w-5" />
              Previous
            </Link>
            <Link
              href={hasNextPage ? getPageHrefWithFilter(currentPage + 1, filter) : "#"}
              className={`flex items-center gap-2 px-6 py-3 border-2 border-zinc-900 bg-indigo-600 text-white text-xs font-black uppercase tracking-[0.2em] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all ${
                hasNextPage ? "hover:translate-x-[-2px] hover:translate-y-[-2px] hover:bg-indigo-500" : "opacity-30 pointer-events-none"
              }`}
            >
              Next Page
              <ArrowBigRight className="h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
