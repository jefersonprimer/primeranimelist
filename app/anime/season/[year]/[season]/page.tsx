import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SeasonAnimeCard } from "@/app/components/SeasonAnimeCard";
import { FilterDropdown } from "@/app/components/FilterDropdown";

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

const SORT_OPTIONS = ["default", "members", "score", "start-date", "title", "studio", "licensor"] as const;
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
  return (SORT_OPTIONS as readonly string[]).includes(value) ? (value as SortOption) : "default";
}

function parseOptionalFilter(raw: string | string[] | undefined) {
  const value = getSingleValue(raw)?.trim();
  return value ? value : null;
}

function buildSeasonPagePath(year: number, season: string, filters: SeasonFilters): string {
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

function filterSectionsByType(sections: SeasonSection[], filter: TypeFilter): SeasonSection[] {
  if (filter === "all") return sections;
  if (filter === "tv") {
    return sections.filter((s) => s.key === "tv_new" || s.key === "tv_continuing");
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

function matchesNamedFilter(values: string[] | null | undefined, selected: string | null) {
  if (!selected) return true;
  const target = normalizeText(selected);
  return (values ?? []).some((value) => normalizeText(value) === target);
}

function matchesAudienceFilters(item: SeasonAnimeItem, kids: boolean, r18: boolean) {
  if (!kids && !r18) return true;

  const rating = (item.rating ?? "").toLocaleLowerCase();
  const genreValues = (item.genres ?? []).map((genre) => genre.toLocaleLowerCase());
  const kidsMatch = /kids|children|all ages/.test(rating);
  const r18Match = /^rx\b/.test(rating) || genreValues.includes("hentai");

  return (kids && kidsMatch) || (r18 && r18Match);
}

function filterSeasonItems(items: SeasonAnimeItem[], filters: SeasonFilters) {
  return items.filter((item) => {
    if (!matchesNamedFilter(item.genres, filters.genre)) return false;
    if (!matchesNamedFilter(item.themes, filters.theme)) return false;
    if (!matchesNamedFilter(item.demographics, filters.demographic)) return false;
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

function compareNullableDateAsc(a: string | Date | null, b: string | Date | null) {
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
        const diff = compareTextAsc(getFirstRelationValue(a.studios), getFirstRelationValue(b.studios));
        return diff || compareTextAsc(a.title, b.title);
      }
      case "licensor": {
        const diff = compareTextAsc(getFirstRelationValue(a.licensors), getFirstRelationValue(b.licensors));
        return diff || compareTextAsc(a.title, b.title);
      }
      default:
        return 0;
    }
  });
}

function getUniqueNamedOptions(items: SeasonAnimeItem[], key: "genres" | "themes" | "demographics") {
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
  const availableYears = Array.isArray(data.availableYears) ? data.availableYears : [];
  const previousAvailableYear = availableYears.filter((y) => y < year).sort((a, b) => b - a)[0];
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
                  href={buildSeasonPagePath(previousAvailableYear, season, filters)}
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

              <p className="mt-1 text-base font-bold text-zinc-900 dark:text-zinc-50">
                {titleCase(season)} {year}
              </p>

              {showBackToCurrent && (
                <Link
                  href={buildSeasonPagePath(currentYear, season, filters)}
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
                    href={buildSeasonPagePath(year, s, { ...filters })}
                    className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-black tracking-wide transition-colors ${
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

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {TYPE_FILTERS.map((tf) => {
                const active = tf === filters.type;
                return (
                  <Link
                    key={tf}
                    href={buildSeasonPagePath(year, season, { ...filters, type: tf })}
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

            <div className="flex flex-wrap gap-3">
              <FilterDropdown className="group relative">
                <summary className="list-none cursor-pointer rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-black text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900">
                  Sort: {SORT_LABELS[filters.sort]}
                </summary>
                <div className="absolute left-0 z-20 mt-2 min-w-56 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="flex flex-col gap-1">
                    {SORT_OPTIONS.map((option) => {
                      const active = option === filters.sort;
                      return (
                        <Link
                          key={option}
                          href={buildSeasonPagePath(year, season, { ...filters, sort: option })}
                          className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                            active
                              ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                              : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
                          }`}
                        >
                          {SORT_LABELS[option]}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </FilterDropdown>

              <FilterDropdown className="group relative">
                <summary className="list-none cursor-pointer rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-black text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900">
                  Filter
                </summary>
                <div className="absolute left-0 z-20 mt-2 w-[min(24rem,calc(100vw-4rem))] rounded-xl border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
                  <form method="get" className="flex flex-col gap-3">
                    {filters.type !== "all" && <input type="hidden" name="type" value={filters.type} />}
                    {filters.sort !== "default" && <input type="hidden" name="sort" value={filters.sort} />}
                    {filters.kids && <input type="hidden" name="kids" value="1" />}
                    {filters.r18 && <input type="hidden" name="r18" value="1" />}

                    <label className="flex flex-col gap-1 text-sm font-bold text-zinc-700 dark:text-zinc-200">
                      Genre
                      <select
                        name="genre"
                        defaultValue={filters.genre ?? ""}
                        className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                      >
                        <option value="">All genres</option>
                        {genreOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="flex flex-col gap-1 text-sm font-bold text-zinc-700 dark:text-zinc-200">
                      Theme
                      <select
                        name="theme"
                        defaultValue={filters.theme ?? ""}
                        className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                      >
                        <option value="">All themes</option>
                        {themeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="flex flex-col gap-1 text-sm font-bold text-zinc-700 dark:text-zinc-200">
                      Demographic
                      <select
                        name="demographic"
                        defaultValue={filters.demographic ?? ""}
                        className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                      >
                        <option value="">All demographics</option>
                        {demographicOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="submit"
                        className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-black text-white hover:bg-indigo-500"
                      >
                        Apply
                      </button>
                      <Link
                        href={buildSeasonPagePath(year, season, {
                          ...filters,
                          genre: null,
                          theme: null,
                          demographic: null,
                        })}
                        className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-black text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
                      >
                        Clear
                      </Link>
                    </div>
                  </form>
                </div>
              </FilterDropdown>

              <FilterDropdown className="group relative">
                <summary className="list-none cursor-pointer rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-black text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900">
                  Rating
                  {(filters.kids || filters.r18) ? `: ${[filters.kids ? "Kids" : null, filters.r18 ? "R18+" : null].filter(Boolean).join(", ")}` : ""}
                </summary>
                <div className="absolute left-0 z-20 mt-2 min-w-64 rounded-xl border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
                  <form method="get" className="flex flex-col gap-3">
                    {filters.type !== "all" && <input type="hidden" name="type" value={filters.type} />}
                    {filters.sort !== "default" && <input type="hidden" name="sort" value={filters.sort} />}
                    {filters.genre && <input type="hidden" name="genre" value={filters.genre} />}
                    {filters.theme && <input type="hidden" name="theme" value={filters.theme} />}
                    {filters.demographic && <input type="hidden" name="demographic" value={filters.demographic} />}

                    <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-200">
                      <input
                        type="checkbox"
                        name="kids"
                        value="1"
                        defaultChecked={filters.kids}
                        className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      Kids
                    </label>

                    <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-200">
                      <input
                        type="checkbox"
                        name="r18"
                        value="1"
                        defaultChecked={filters.r18}
                        className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      R18+
                    </label>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="submit"
                        className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-black text-white hover:bg-indigo-500"
                      >
                        Apply
                      </button>
                      <Link
                        href={buildSeasonPagePath(year, season, { ...filters, kids: false, r18: false })}
                        className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-black text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
                      >
                        Clear
                      </Link>
                    </div>
                  </form>
                </div>
              </FilterDropdown>
            </div>

            
          </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-zinc-500 dark:text-zinc-400">
                Showing {filteredItems.length} of {seasonItems.length} titles
              </span>
              {hasExtraFilters && (
                <Link
                  href={buildSeasonPagePath(year, season, { ...filters, sort: "default", genre: null, theme: null, demographic: null, kids: false, r18: false })}
                  className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-black text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
                >
                  Clear extra filters
                </Link>
              )}
            </div>

        </div>

        {seasonItems.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white px-6 py-12 text-center text-sm font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            No anime found for {titleCase(season)} {year}.
          </div>
        ) : visibleSections.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white px-6 py-12 text-center text-sm font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            No {TYPE_FILTER_LABELS[filters.type]} titles for {titleCase(season)} {year}.{" "}
            <Link
              href={buildSeasonPagePath(year, season, { ...filters, type: "all" })}
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
