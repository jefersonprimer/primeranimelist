import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SeasonAnimeCard } from "@/app/components/SeasonAnimeCard";
import { FilterDropdown } from "@/app/components/FilterDropdown";
import { DropdownIcon } from "@/app/components/icons/DropdownIcon";

export const dynamic = "force-dynamic";

const SEASONS = ["winter", "spring", "summer", "fall"] as const;
type Season = (typeof SEASONS)[number];

function isSeason(value: string): value is Season {
  return (SEASONS as readonly string[]).includes(value);
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const SortIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 16 4 4 4-4" />
    <path d="M7 20V4" />
    <path d="m21 8-4-4-4 4" />
    <path d="M17 4v16" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

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
  rating?: string | null;
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
  rating?: string | null;
};

function normalizeNames(values: NamedRelation[] | string[] | null | undefined) {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => (typeof value === "string" ? value : value.name))
    .filter(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0,
    );
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
    rating: item.rating ?? null,
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

function isTvContinuing(
  item: SeasonAnimeItem,
  season: Season,
  year: number,
): boolean {
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

function groupSeasonItems(
  items: SeasonAnimeItem[],
  season: Season,
  year: number,
) {
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
      const key = isTvContinuing(item, season, year)
        ? "tv_continuing"
        : "tv_new";
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
  return (TYPE_FILTERS as readonly string[]).includes(v)
    ? (v as TypeFilter)
    : "all";
}

const SORT_OPTIONS = [
  "default",
  "members",
  "score",
  "start-date",
  "title",
  "studio",
  "licensor",
] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

const SORT_LABELS: Record<SortOption, string> = {
  default: "Default",
  members: "Members",
  score: "Score",
  "start-date": "Start date",
  title: "Title",
  studio: "Studio",
  licensor: "Licensor",
};

type SeasonFilters = {
  type: TypeFilter;
  sort: SortOption;
  genre: string | null;
  theme: string | null;
  demographic: string | null;
  kids: boolean;
  r18: boolean;
};

function getSingleValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseBooleanFlag(raw: string | string[] | undefined) {
  const value = getSingleValue(raw)?.trim().toLowerCase();
  return value === "1" || value === "true" || value === "on" || value === "yes";
}

function parseSortOption(raw: string | string[] | undefined): SortOption {
  const value = getSingleValue(raw)?.trim().toLowerCase() ?? "";
  return (SORT_OPTIONS as readonly string[]).includes(value)
    ? (value as SortOption)
    : "default";
}

function parseOptionalFilter(raw: string | string[] | undefined) {
  const value = getSingleValue(raw)?.trim();
  return value ? value : null;
}

function buildSeasonPagePath(
  year: number,
  season: string,
  filters: SeasonFilters,
): string {
  const path = `/anime/season/${year}/${season}`;
  const params = new URLSearchParams();

  if (filters.type !== "all") params.set("type", filters.type);
  if (filters.sort !== "default") params.set("sort", filters.sort);
  if (filters.genre) params.set("genre", filters.genre);
  if (filters.theme) params.set("theme", filters.theme);
  if (filters.demographic) params.set("demographic", filters.demographic);
  if (filters.kids) params.set("kids", "1");
  if (filters.r18) params.set("r18", "1");

  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

function filterSectionsByType(
  sections: SeasonSection[],
  filter: TypeFilter,
): SeasonSection[] {
  if (filter === "all") return sections;
  if (filter === "tv") {
    return sections.filter(
      (s) => s.key === "tv_new" || s.key === "tv_continuing",
    );
  }
  return sections.filter((s) => s.key === filter);
}

function getFirstRelationValue(values: string[] | null | undefined) {
  const value = values?.[0]?.trim();
  return value ? value : "";
}

function normalizeText(value: string) {
  return value.trim().toLocaleLowerCase();
}

function matchesNamedFilter(
  values: string[] | null | undefined,
  selected: string | null,
) {
  if (!selected) return true;
  const target = normalizeText(selected);
  return (values ?? []).some((value) => normalizeText(value) === target);
}

function matchesAudienceFilters(
  item: SeasonAnimeItem,
  kids: boolean,
  r18: boolean,
) {
  if (!kids && !r18) return true;

  const rating = (item.rating ?? "").toLocaleLowerCase();
  const genreValues = (item.genres ?? []).map((genre) =>
    genre.toLocaleLowerCase(),
  );
  const kidsMatch = /kids|children|all ages/.test(rating);
  const r18Match = /^rx\b/.test(rating) || genreValues.includes("hentai");

  return (kids && kidsMatch) || (r18 && r18Match);
}

function filterSeasonItems(items: SeasonAnimeItem[], filters: SeasonFilters) {
  return items.filter((item) => {
    if (!matchesNamedFilter(item.genres, filters.genre)) return false;
    if (!matchesNamedFilter(item.themes, filters.theme)) return false;
    if (!matchesNamedFilter(item.demographics, filters.demographic))
      return false;
    if (!matchesAudienceFilters(item, filters.kids, filters.r18)) return false;
    return true;
  });
}

function compareNullableNumberDesc(a: number | null, b: number | null) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return b - a;
}

function compareNullableDateAsc(
  a: string | Date | null,
  b: string | Date | null,
) {
  const aTime = a ? new Date(a).getTime() : Number.POSITIVE_INFINITY;
  const bTime = b ? new Date(b).getTime() : Number.POSITIVE_INFINITY;
  return aTime - bTime;
}

function compareTextAsc(a: string, b: string) {
  return a.localeCompare(b, "en-US", { sensitivity: "base" });
}

function sortSeasonItems(items: SeasonAnimeItem[], sort: SortOption) {
  if (sort === "default") {
    return items;
  }

  return [...items].sort((a, b) => {
    switch (sort) {
      case "members": {
        const diff = compareNullableNumberDesc(a.members, b.members);
        return diff || compareTextAsc(a.title, b.title);
      }
      case "score": {
        const diff = compareNullableNumberDesc(a.score, b.score);
        return diff || compareTextAsc(a.title, b.title);
      }
      case "start-date": {
        const diff = compareNullableDateAsc(a.airedFrom, b.airedFrom);
        return diff || compareTextAsc(a.title, b.title);
      }
      case "title":
        return compareTextAsc(a.title, b.title);
      case "studio": {
        const diff = compareTextAsc(
          getFirstRelationValue(a.studios),
          getFirstRelationValue(b.studios),
        );
        return diff || compareTextAsc(a.title, b.title);
      }
      case "licensor": {
        const diff = compareTextAsc(
          getFirstRelationValue(a.licensors),
          getFirstRelationValue(b.licensors),
        );
        return diff || compareTextAsc(a.title, b.title);
      }
      default:
        return 0;
    }
  });
}

function getUniqueNamedOptions(
  items: SeasonAnimeItem[],
  key: "genres" | "themes" | "demographics",
) {
  const values = new Set<string>();

  for (const item of items) {
    for (const value of item[key] ?? []) {
      const trimmed = value.trim();
      if (trimmed) values.add(trimmed);
    }
  }

  return [...values].sort((a, b) => compareTextAsc(a, b));
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
  const filters: SeasonFilters = {
    type: parseTypeFilter(sp.type),
    sort: parseSortOption(sp.sort),
    genre: parseOptionalFilter(sp.genre),
    theme: parseOptionalFilter(sp.theme),
    demographic: parseOptionalFilter(sp.demographic),
    kids: parseBooleanFlag(sp.kids),
    r18: parseBooleanFlag(sp.r18),
  };

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
  const availableYears = Array.isArray(data.availableYears)
    ? data.availableYears
    : [];
  const previousAvailableYear = availableYears
    .filter((y) => y < year)
    .sort((a, b) => b - a)[0];
  const showBackToCurrent = year !== new Date().getFullYear();
  const currentYear = new Date().getFullYear();
  const filteredItems = filterSeasonItems(seasonItems, filters);
  const sortedItems = sortSeasonItems(filteredItems, filters.sort);
  const allSections = groupSeasonItems(sortedItems, season, year);
  const visibleSections = filterSectionsByType(allSections, filters.type);
  const genreOptions = getUniqueNamedOptions(seasonItems, "genres");
  const themeOptions = getUniqueNamedOptions(seasonItems, "themes");
  const demographicOptions = getUniqueNamedOptions(seasonItems, "demographics");
  const hasExtraFilters =
    filters.sort !== "default" ||
    filters.genre !== null ||
    filters.theme !== null ||
    filters.demographic !== null ||
    filters.kids ||
    filters.r18;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        <h1 className="text-[28px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Season Anime
        </h1>

        {/* Filter & Navigation Card */}
        <div className="relative z-20 flex flex-col gap-2 border border-zinc-200 bg-white/70 backdrop-blur-xl p-2 shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-950/70 dark:shadow-none">
          {/* Top Row: Year & Season Navigation */}
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                {previousAvailableYear ? (
                  <Link
                    href={buildSeasonPagePath(
                      previousAvailableYear,
                      season,
                      filters,
                    )}
                    className="p-2 rounded-lg text-zinc-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm dark:text-zinc-400 dark:hover:bg-zinc-800 transition-all"
                    aria-label="Previous year"
                  >
                    <ChevronLeftIcon />
                  </Link>
                ) : (
                  <span className="p-2 text-zinc-300 dark:text-zinc-700">
                    <ChevronLeftIcon />
                  </span>
                )}

                <div className="px-4 py-1 flex flex-col items-center min-w-[120px]">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    Current Period
                  </span>
                  <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                    {titleCase(season)} {year}
                  </span>
                </div>

                <Link
                  href={buildSeasonPagePath(year + 1, season, filters)}
                  className="p-2 rounded-lg text-zinc-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm dark:text-zinc-400 dark:hover:bg-zinc-800 transition-all"
                  aria-label="Next year"
                >
                  <ChevronRightIcon />
                </Link>
              </div>

              {showBackToCurrent && (
                <Link
                  href={buildSeasonPagePath(currentYear, season, filters)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-black hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition-colors border border-indigo-100 dark:border-indigo-900"
                >
                  <CalendarIcon />
                  Current
                </Link>
              )}
            </div>

            <nav className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-x-auto no-scrollbar">
              {SEASONS.map((s) => {
                const active = s === season;
                return (
                  <Link
                    key={s}
                    href={buildSeasonPagePath(year, s, filters)}
                    className={`flex-1 min-w-[90px] text-center px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      active
                        ? "bg-white text-indigo-600 shadow-md shadow-indigo-200/20 dark:bg-zinc-800 dark:text-indigo-400 dark:shadow-none"
                        : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                    }`}
                  >
                    {s}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Row: Filters & Sort */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center p-1 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 overflow-x-auto no-scrollbar">
              {TYPE_FILTERS.map((tf) => {
                const active = tf === filters.type;
                return (
                  <Link
                    key={tf}
                    href={buildSeasonPagePath(year, season, {
                      ...filters,
                      type: tf,
                    })}
                    className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                      active
                        ? "bg-white text-zinc-900 shadow-sm border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:border-zinc-700"
                        : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                    }`}
                  >
                    {TYPE_FILTER_LABELS[tf]}
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <FilterDropdown className="group relative">
                <summary className="list-none cursor-pointer flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-bold text-zinc-700 shadow-sm transition-all hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400">
                  <SortIcon />
                  <span>Sort: {SORT_LABELS[filters.sort]}</span>
                  <DropdownIcon size={16} />
                </summary>
                <div className="absolute left-0 lg:left-auto lg:right-0 z-9999 mt-2 min-w-[220px] rounded-2xl border border-zinc-200 bg-white/95 backdrop-blur-xl p-2 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950/95">
                  <div className="flex flex-col gap-1">
                    {SORT_OPTIONS.map((option) => {
                      const active = option === filters.sort;
                      return (
                        <Link
                          key={option}
                          href={buildSeasonPagePath(year, season, {
                            ...filters,
                            sort: option,
                          })}
                          className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                            active
                              ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
                          }`}
                        >
                          {SORT_LABELS[option]}
                          {active && (
                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </FilterDropdown>

              <FilterDropdown className="group relative">
                <summary className="list-none cursor-pointer flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-bold text-zinc-700 shadow-sm transition-all hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400">
                  <FilterIcon />
                  <span>Advanced</span>
                  {(filters.genre || filters.theme || filters.demographic) && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-black text-white">
                      {
                        [
                          filters.genre,
                          filters.theme,
                          filters.demographic,
                        ].filter(Boolean).length
                      }
                    </span>
                  )}
                  <DropdownIcon size={16} />
                </summary>
                <div className="absolute left-0 lg:left-auto lg:right-0 z-9999 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-zinc-200 bg-white/95 backdrop-blur-xl p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950/95">
                  <form method="get" className="flex flex-col gap-5">
                    {filters.type !== "all" && (
                      <input type="hidden" name="type" value={filters.type} />
                    )}
                    {filters.sort !== "default" && (
                      <input type="hidden" name="sort" value={filters.sort} />
                    )}
                    {filters.kids && (
                      <input type="hidden" name="kids" value="1" />
                    )}
                    {filters.r18 && (
                      <input type="hidden" name="r18" value="1" />
                    )}

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                          Genre
                        </label>
                        <select
                          name="genre"
                          defaultValue={filters.genre ?? ""}
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-bold text-zinc-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 outline-none transition-all"
                        >
                          <option value="">All Genres</option>
                          {genreOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                          Theme
                        </label>
                        <select
                          name="theme"
                          defaultValue={filters.theme ?? ""}
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-bold text-zinc-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 outline-none transition-all"
                        >
                          <option value="">All Themes</option>
                          {themeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                          Demographic
                        </label>
                        <select
                          name="demographic"
                          defaultValue={filters.demographic ?? ""}
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-bold text-zinc-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 outline-none transition-all"
                        >
                          <option value="">All Demographics</option>
                          {demographicOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <button
                        type="submit"
                        className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:shadow-indigo-600/30 transition-all"
                      >
                        Apply Filters
                      </button>
                      <Link
                        href={buildSeasonPagePath(year, season, {
                          ...filters,
                          genre: null,
                          theme: null,
                          demographic: null,
                        })}
                        className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 transition-all"
                      >
                        Reset
                      </Link>
                    </div>
                  </form>
                </div>
              </FilterDropdown>

              <FilterDropdown className="group relative">
                <summary className="list-none cursor-pointer flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-bold text-zinc-700 shadow-sm transition-all hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400">
                  <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-zinc-100 text-[10px] font-black dark:bg-zinc-900">
                    18
                  </span>
                  <span>Safety</span>
                  {(filters.kids || filters.r18) && (
                    <span className="flex h-2 w-2 rounded-full bg-indigo-600" />
                  )}
                  <DropdownIcon size={16} />
                </summary>
                <div className="absolute right-0 z-9999 mt-2 min-w-[200px] rounded-2xl border border-zinc-200 bg-white/95 backdrop-blur-xl p-4 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950/95">
                  <form method="get" className="flex flex-col gap-4">
                    {filters.type !== "all" && (
                      <input type="hidden" name="type" value={filters.type} />
                    )}
                    {filters.sort !== "default" && (
                      <input type="hidden" name="sort" value={filters.sort} />
                    )}
                    {filters.genre && (
                      <input type="hidden" name="genre" value={filters.genre} />
                    )}
                    {filters.theme && (
                      <input type="hidden" name="theme" value={filters.theme} />
                    )}
                    {filters.demographic && (
                      <input
                        type="hidden"
                        name="demographic"
                        value={filters.demographic}
                      />
                    )}

                    <div className="space-y-3">
                      <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          Kids Friendly
                        </span>
                        <input
                          type="checkbox"
                          name="kids"
                          value="1"
                          defaultChecked={filters.kids}
                          className="h-5 w-5 rounded-lg border-zinc-300 text-indigo-600 focus:ring-indigo-500/20 transition-all"
                        />
                      </label>

                      <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-red-500 transition-colors">
                          Adult (R18+)
                        </span>
                        <input
                          type="checkbox"
                          name="r18"
                          value="1"
                          defaultChecked={filters.r18}
                          className="h-5 w-5 rounded-lg border-zinc-300 text-red-600 focus:ring-red-500/20 transition-all"
                        />
                      </label>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <button
                        type="submit"
                        className="flex-1 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-black text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all"
                      >
                        Apply
                      </button>
                    </div>
                  </form>
                </div>
              </FilterDropdown>
            </div>
          </div>

          {/* Results Summary & Active Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              {hasExtraFilters && (
                <Link
                  href={buildSeasonPagePath(year, season, {
                    ...filters,
                    sort: "default",
                    genre: null,
                    theme: null,
                    demographic: null,
                    kids: false,
                    r18: false,
                  })}
                  className="text-[11px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                >
                  Reset All Filters
                </Link>
              )}
            </div>
          </div>
        </div>

        {seasonItems.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-zinc-200 bg-white/50 px-6 py-20 text-center dark:border-zinc-800 dark:bg-zinc-950/50">
            <div className="mx-auto w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mb-4">
              <CalendarIcon />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-1">
              No Anime Found
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              We couldn't find any anime for {titleCase(season)} {year}.
            </p>
          </div>
        ) : visibleSections.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-zinc-200 bg-white/50 px-6 py-20 text-center dark:border-zinc-800 dark:bg-zinc-950/50">
            <div className="mx-auto w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mb-4">
              <FilterIcon />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-1">
              No Matches
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
              No {TYPE_FILTER_LABELS[filters.type]} titles match your current
              filters.
            </p>
            <Link
              href={buildSeasonPagePath(year, season, {
                ...filters,
                type: "all",
              })}
              className="inline-flex px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-sm hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
            >
              Show All Types
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-16">
            {visibleSections.map((section) => (
              <section
                key={section.key}
                aria-labelledby={`season-section-${section.key}`}
              >
                <div className="flex items-center gap-4 mb-8">
                  <h2
                    id={`season-section-${section.key}`}
                    className="text-lg font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-50"
                  >
                    {section.label}
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-zinc-200 to-transparent dark:from-zinc-800" />
                  <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                    {section.items.length} Shows
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {section.items.map((anime) => (
                    <SeasonAnimeCard
                      key={anime.malId}
                      anime={{
                        ...anime,
                        airedFrom: anime.airedFrom
                          ? new Date(anime.airedFrom)
                          : null,
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
