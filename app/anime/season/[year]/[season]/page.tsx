import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SeasonAnimeCard } from "@/app/components/SeasonAnimeCard";

export const dynamic = "force-dynamic";

const SEASONS = ["winter", "spring", "summer", "fall"] as const;
type Season = (typeof SEASONS)[number];

function isSeason(value: string): value is Season {
  return (SEASONS as readonly string[]).includes(value);
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

type SeasonAnimeItem = {
  malId: number;
  title: string;
  titleJapanese: string | null;
  titleEnglish: string | null;
  title_english?: string | null;
  imageUrl: string | null;
  type: string | null;
  season: string | null;
  year: number | null;
  episodes: number | null;
  duration: string | null;
  producers: string[] | null;
  licensors: string[] | null;
  genres: string[] | null;
  synopsis: string | null;
  studios: string[] | null;
  source: string | null;
  themes: string[] | null;
  demographics: string[] | null;
  score: number | null;
  members: number | null;
  airedFrom: string | Date | null;
};

type SeasonApiResponse = {
  items?: SeasonAnimeItem[];
  data?: JikanSeasonAnimeItem[];
  season: Season;
  year: number;
  availableYears: number[];
};

type NamedRelation = {
  name?: string | null;
};

type JikanSeasonAnimeItem = {
  mal_id: number;
  title: string;
  title_japanese: string | null;
  title_english: string | null;
  images?: {
    jpg?: {
      image_url?: string | null;
    } | null;
  } | null;
  type: string | null;
  season: string | null;
  year: number | null;
  episodes: number | null;
  duration: string | null;
  producers?: NamedRelation[] | null;
  licensors?: NamedRelation[] | null;
  genres?: NamedRelation[] | null;
  synopsis: string | null;
  studios?: NamedRelation[] | null;
  source: string | null;
  themes?: NamedRelation[] | null;
  demographics?: NamedRelation[] | null;
  score: number | null;
  members: number | null;
  aired?: {
    from?: string | null;
  } | null;
};

function normalizeNames(values: NamedRelation[] | string[] | null | undefined) {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => (typeof value === "string" ? value : value.name))
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0);
}

function normalizeSeasonItems(payload: SeasonApiResponse): SeasonAnimeItem[] {
  if (Array.isArray(payload.items)) {
    return payload.items;
  }

  if (!Array.isArray(payload.data)) {
    return [];
  }

  return payload.data.map((item) => ({
    malId: item.mal_id,
    title: item.title,
    titleJapanese: item.title_japanese,
    titleEnglish: item.title_english,
    title_english: item.title_english,
    imageUrl: item.images?.jpg?.image_url ?? null,
    type: item.type,
    season: item.season,
    year: item.year,
    episodes: item.episodes,
    duration: item.duration,
    producers: normalizeNames(item.producers),
    licensors: normalizeNames(item.licensors),
    genres: normalizeNames(item.genres),
    synopsis: item.synopsis,
    studios: normalizeNames(item.studios),
    source: item.source,
    themes: normalizeNames(item.themes),
    demographics: normalizeNames(item.demographics),
    score: item.score,
    members: item.members,
    airedFrom: item.aired?.from ?? null,
  }));
}

type SeasonSectionKey =
  | "tv_new"
  | "tv_continuing"
  | "ona"
  | "ova"
  | "movie"
  | "special"
  | "other";

const SECTION_ORDER: SeasonSectionKey[] = [
  "tv_new",
  "tv_continuing",
  "ona",
  "ova",
  "movie",
  "special",
  "other",
];

const SECTION_LABELS: Record<SeasonSectionKey, string> = {
  tv_new: "TV - New",
  tv_continuing: "TV - Continuing",
  ona: "ONA",
  ova: "OVA",
  movie: "Movie",
  special: "Special",
  other: "Other",
};

function seasonChartStartUtc(season: Season, year: number): Date {
  switch (season) {
    case "winter":
      return new Date(Date.UTC(year - 1, 11, 1));
    case "spring":
      return new Date(Date.UTC(year, 3, 1));
    case "summer":
      return new Date(Date.UTC(year, 6, 1));
    case "fall":
      return new Date(Date.UTC(year, 9, 1));
  }
}

function isTvContinuing(item: SeasonAnimeItem, season: Season, year: number): boolean {
  const raw = item.airedFrom;
  if (raw == null) return false;
  const aired = typeof raw === "string" ? new Date(raw) : raw;
  if (Number.isNaN(aired.getTime())) return false;
  return aired.getTime() < seasonChartStartUtc(season, year).getTime();
}

type NonTvSectionKey = Exclude<SeasonSectionKey, "tv_new" | "tv_continuing">;

function nonTvSectionKeyForType(type: string | null): NonTvSectionKey {
  const t = (type ?? "").trim().toLowerCase();
  if (t === "ona") return "ona";
  if (t === "ova") return "ova";
  if (t === "movie") return "movie";
  if (t === "special") return "special";
  return "other";
}

function groupSeasonItems(items: SeasonAnimeItem[], season: Season, year: number) {
  const buckets: Record<SeasonSectionKey, SeasonAnimeItem[]> = {
    tv_new: [],
    tv_continuing: [],
    ona: [],
    ova: [],
    movie: [],
    special: [],
    other: [],
  };
  for (const item of items) {
    const t = (item.type ?? "").trim().toLowerCase();
    if (t === "tv") {
      const key = isTvContinuing(item, season, year) ? "tv_continuing" : "tv_new";
      buckets[key].push(item);
    } else {
      buckets[nonTvSectionKeyForType(item.type)].push(item);
    }
  }
  return SECTION_ORDER.map((key) => ({
    key,
    label: SECTION_LABELS[key],
    items: buckets[key],
  })).filter((s) => s.items.length > 0);
}

type SeasonSection = ReturnType<typeof groupSeasonItems>[number];

const TYPE_FILTERS = ["all", "tv", "ona", "ova", "movie", "special"] as const;
type TypeFilter = (typeof TYPE_FILTERS)[number];

const TYPE_FILTER_LABELS: Record<TypeFilter, string> = {
  all: "All",
  tv: "TV",
  ona: "ONA",
  ova: "OVA",
  movie: "Movie",
  special: "Special",
};

function parseTypeFilter(raw: string | string[] | undefined): TypeFilter {
  const v = (Array.isArray(raw) ? raw[0] : raw)?.trim().toLowerCase() ?? "";
  return (TYPE_FILTERS as readonly string[]).includes(v) ? (v as TypeFilter) : "all";
}

function seasonPagePath(year: number, season: string, typeFilter: TypeFilter): string {
  const path = `/anime/season/${year}/${season}`;
  if (typeFilter === "all") return path;
  return `${path}?type=${typeFilter}`;
}

function filterSectionsByType(sections: SeasonSection[], filter: TypeFilter): SeasonSection[] {
  if (filter === "all") return sections;
  if (filter === "tv") {
    return sections.filter((s) => s.key === "tv_new" || s.key === "tv_continuing");
  }
  return sections.filter((s) => s.key === filter);
}

export default async function AnimeSeasonByYearPage({
  params,
  searchParams,
}: {
  params: Promise<{ year: string; season: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { year: yearParam, season: seasonParam } = await params;
  const sp = (await searchParams) ?? {};
  const typeFilter = parseTypeFilter(sp.type);

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
  const seasonItems = normalizeSeasonItems(data);
  const availableYears = Array.isArray(data.availableYears) ? data.availableYears : [];
  const previousAvailableYear = availableYears.filter((y) => y < year).sort((a, b) => b - a)[0];
  const showBackToCurrent = year !== new Date().getFullYear();
  const currentYear = new Date().getFullYear();

  const allSections = groupSeasonItems(seasonItems, season, year);
  const visibleSections = filterSectionsByType(allSections, typeFilter);

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="flex flex-col gap-8">
        <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 uppercase italic">
          Season Anime
        </h1>

        <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white/80 px-4 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              {previousAvailableYear ? (
                <Link
                  href={seasonPagePath(previousAvailableYear, season, typeFilter)}
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
                  href={seasonPagePath(currentYear, season, typeFilter)}
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
                    href={seasonPagePath(year, s, typeFilter)}
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

          <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Type</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {TYPE_FILTERS.map((tf) => {
                const active = tf === typeFilter;
                return (
                  <Link
                    key={tf}
                    href={seasonPagePath(year, season, tf)}
                    className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-black tracking-wide transition-colors ${
                      active
                        ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
                    }`}
                  >
                    {TYPE_FILTER_LABELS[tf]}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {seasonItems.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white px-6 py-12 text-center text-sm font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            No anime found for {titleCase(season)} {year}.
          </div>
        ) : visibleSections.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white px-6 py-12 text-center text-sm font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            No {TYPE_FILTER_LABELS[typeFilter]} titles for {titleCase(season)} {year}.{" "}
            <Link
              href={seasonPagePath(year, season, "all")}
              className="font-bold text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400"
            >
              Show all
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {visibleSections.map((section) => (
              <section key={section.key} aria-labelledby={`season-section-${section.key}`}>
                <h2
                  id={`season-section-${section.key}`}
                  className="flex items-center justify-center mb-4 text-sm bg-[#333333] tracking-wide text-[#e0e0e0] p-2"
                >
                  {section.label}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {section.items.map((anime) => (
                    <SeasonAnimeCard
                      key={anime.malId}
                      anime={{
                        ...anime,
                        airedFrom: anime.airedFrom ? new Date(anime.airedFrom) : null
                      }}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
