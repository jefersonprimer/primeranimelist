import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const SEASONS = ["winter", "spring", "summer", "fall"] as const;
type Season = (typeof SEASONS)[number];

function isSeason(value: string): value is Season {
  return (SEASONS as readonly string[]).includes(value);
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

type SeasonApiResponse = {
  items: Array<{
    id: number;
    malId: number;
    title: string;
    imageUrl: string | null;
  }>;
  season: Season;
  year: number;
  availableYears: number[];
};

export default async function AnimeSeasonByYearPage({
  params,
  searchParams,
}: {
  params: Promise<{ year: string; season: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { year: yearParam, season: seasonParam } = await params;
  await searchParams;

  const seasonCandidate = decodeURIComponent(seasonParam).toLowerCase();
  if (!isSeason(seasonCandidate)) {
    notFound();
  }

  const yearParsed = Number.parseInt(yearParam, 10);
  if (!Number.isFinite(yearParsed) || yearParsed <= 0) {
    notFound();
  }

  const year = yearParsed;
  const season = seasonCandidate;

  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const apiUrl = new URL("/api/v1/anime/season", `${protocol}://${host}`);
  apiUrl.searchParams.set("season", season);
  apiUrl.searchParams.set("year", `${year}`);

  const res = await fetch(apiUrl.toString(), { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to load season anime (${res.status}): ${text}`);
  }

  const data = (await res.json()) as SeasonApiResponse;
  const availableYears = Array.isArray(data.availableYears) ? data.availableYears : [];
  const previousAvailableYear = availableYears.filter((y) => y < year).sort((a, b) => b - a)[0];
  const showBackToCurrent = year !== new Date().getFullYear();
  const currentYear = new Date().getFullYear();

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 uppercase italic">
            Anime by Season
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">Browse anime by season and year</p>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white/80 px-4 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              {previousAvailableYear ? (
                <Link
                  href={`/anime/season/${previousAvailableYear}/${season}`}
                  className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-3 py-2 text-sm font-black text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
                  aria-label="Go to previous year"
                  title="Go to previous year"
                >
                  …
                </Link>
              ) : (
                <span
                  className="inline-flex items-center justify-center rounded-full border border-zinc-100 px-3 py-2 text-sm font-black text-zinc-300 dark:border-zinc-900 dark:text-zinc-700"
                  aria-hidden="true"
                >
                  …
                </span>
              )}

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                  Filters
                </p>
                <p className="mt-1 text-base font-bold text-zinc-900 dark:text-zinc-50">
                  {titleCase(season)} {year}
                </p>
              </div>

              {showBackToCurrent && (
                <Link
                  href={`/anime/season/${currentYear}/${season}`}
                  className="ml-1 inline-flex items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-black text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900"
                  aria-label="Back to current year"
                  title="Back to current year"
                >
                  …
                </Link>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {SEASONS.map((s) => {
                const active = s === season;
                return (
                  <Link
                    key={s}
                    href={`/anime/season/${year}/${s}`}
                    className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-black uppercase tracking-wide transition-colors ${
                      active
                        ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
                    }`}
                  >
                    {s}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {data.items.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white px-6 py-12 text-center text-sm font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            No anime found for {titleCase(season)} {year}.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {data.items.map((anime) => (
              <Link
                key={anime.id}
                href={`/anime/${anime.malId}/${encodeURIComponent(anime.title)}`}
                className="group rounded-xl border border-zinc-200 bg-white shadow-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 overflow-hidden"
              >
                <div className="relative aspect-[3/4] w-full bg-zinc-100 dark:bg-zinc-900">
                  {anime.imageUrl ? (
                    <Image
                      src={anime.imageUrl}
                      alt={anime.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-zinc-400">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-black leading-tight text-zinc-900 dark:text-zinc-50 overflow-hidden text-ellipsis whitespace-nowrap">
                    {anime.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

