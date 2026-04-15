import { searchAnime } from "@/lib/services/anime.service";
import { searchManga } from "@/lib/services/manga.service";
import { BookOpenText, Clapperboard, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

type SearchType = "all" | "anime" | "manga";

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseSearchType(value: string | string[] | undefined): SearchType {
  const parsed = getSingleValue(value);

  if (parsed === "anime" || parsed === "manga") {
    return parsed;
  }

  return "all";
}

function buildSearchHref(type: SearchType, query: string) {
  const params = new URLSearchParams();

  if (query.trim()) {
    params.set("q", query.trim());
  }

  if (type !== "all") {
    params.set("type", type);
  }

  const search = params.toString();
  return search ? `/search?${search}` : "/search";
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-300 bg-white/70 px-8 py-16 text-center dark:border-zinc-700 dark:bg-zinc-950/70">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">
        No Results
      </p>
      <h2 className="mt-4 text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
        Nothing found for "{query}"
      </h2>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
        Try another title, romaji name, or japanese name.
      </p>
    </div>
  );
}

function SearchPrompt() {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white/80 px-8 py-16 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">
        Start Searching
      </p>
      <h2 className="mt-4 text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
        Find anime and manga by title
      </h2>
      <p className="mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
        Search by English, romaji, or Japanese titles. You can filter the results to anime or manga only.
      </p>
    </div>
  );
}

function ResultCard({
  href,
  imageUrl,
  title,
  subtitle,
  meta,
  score,
  icon,
}: {
  href: string;
  imageUrl: string | null;
  title: string;
  subtitle: string | null;
  meta: string[];
  score: number | null;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-indigo-800"
    >
      <div className="flex h-full flex-col">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400 dark:text-zinc-600">
              {icon}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div>
            <h3 className="line-clamp-2 text-lg font-black leading-tight text-zinc-900 dark:text-zinc-50">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-1 line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {meta.map((item) => (
              <span
                key={item}
                className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-end justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              {icon}
              Details
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {score ? score.toFixed(2) : "N/A"}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                Score
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function SearchPage(props: PageProps<"/search">) {
  const { q: qParam, type: typeParam } = await props.searchParams;
  const query = (getSingleValue(qParam) ?? "").trim();
  const type = parseSearchType(typeParam);
  const hasQuery = query.length > 0;

  const [animeResults, mangaResults] = hasQuery
    ? await Promise.all([
        type !== "manga" ? searchAnime({ query, limit: type === "all" ? 12 : 24 }) : Promise.resolve([]),
        type !== "anime" ? searchManga({ query, limit: type === "all" ? 12 : 24 }) : Promise.resolve([]),
      ])
    : [[], []];

  const totalResults = animeResults.length + mangaResults.length;

  return (
    <main className="min-h-screen bg-zinc-50 py-12 dark:bg-zinc-950/40">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-white px-8 py-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.12),transparent_35%),linear-gradient(to_bottom,transparent,transparent)]" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">
                Search Hub
              </p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
                Search anime and manga
              </h1>
              <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
                Use the header search icon to get here, then search by title and jump straight to the detail page.
              </p>
            </div>

            {hasQuery && (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                  Results
                </p>
                <p className="mt-1 text-3xl font-black text-zinc-900 dark:text-zinc-50">
                  {totalResults}
                </p>
              </div>
            )}
          </div>

          <form action="/search" method="get" className="relative mt-8 grid gap-4 lg:grid-cols-[1fr_auto_auto]">
            <label className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 focus-within:border-indigo-400 focus-within:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:focus-within:border-indigo-700">
              <Search className="h-5 w-5 text-zinc-400" />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search for Naruto, Vagabond, Frieren..."
                className="w-full bg-transparent text-sm font-medium text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-50"
              />
            </label>

            <select
              name="type"
              defaultValue={type}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-bold text-zinc-900 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
            >
              <option value="all">All</option>
              <option value="anime">Anime</option>
              <option value="manga">Manga</option>
            </select>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-black text-white transition-colors hover:bg-indigo-700"
            >
              Search
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-3">
            {(["all", "anime", "manga"] as const).map((currentType) => {
              const isActive = currentType === type;

              return (
                <Link
                  key={currentType}
                  href={buildSearchHref(currentType, query)}
                  className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.2em] transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                  }`}
                >
                  {currentType}
                </Link>
              );
            })}
          </div>
        </section>

        {!hasQuery ? (
          <SearchPrompt />
        ) : totalResults === 0 ? (
          <EmptyState query={query} />
        ) : (
          <div className="flex flex-col gap-10">
            {animeResults.length > 0 && (
              <section className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">
                      Anime
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-zinc-900 dark:text-zinc-50">
                      Matching anime
                    </h2>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {animeResults.map((item) => (
                    <ResultCard
                      key={`anime-${item.id}`}
                      href={`/anime/${item.malId}/${encodeURIComponent(item.title)}`}
                      imageUrl={item.imageUrl}
                      title={item.title}
                      subtitle={item.titleJapanese}
                      meta={[item.type ?? "Anime", item.year ? String(item.year) : "Unknown year"]}
                      score={item.score}
                      icon={<Clapperboard className="h-5 w-5" />}
                    />
                  ))}
                </div>
              </section>
            )}

            {mangaResults.length > 0 && (
              <section className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">
                      Manga
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-zinc-900 dark:text-zinc-50">
                      Matching manga
                    </h2>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {mangaResults.map((item) => (
                    <ResultCard
                      key={`manga-${item.id}`}
                      href={`/manga/${item.malId}/${encodeURIComponent(item.title)}`}
                      imageUrl={item.imageUrl}
                      title={item.title}
                      subtitle={item.titleJapanese}
                      meta={[item.type ?? "Manga", item.status ?? "Unknown status"]}
                      score={item.score}
                      icon={<BookOpenText className="h-5 w-5" />}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
