import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SeasonAnimeCard } from "@/app/components/SeasonAnimeCard";
import { FilterDropdown } from "@/app/components/FilterDropdown";
import { listSeasonStats } from "@/lib/services/anime.service";

import { DropdownIcon } from "@/app/components/icons/DropdownIcon";
import { ArrowDownUp, Calendar, Filter, FilterIcon } from "lucide-react";

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

const SEASON_CONFIG: Record<
  Season,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  winter: {
    label: "Winter",
    color: "text-blue-400",
    bg: "from-blue-500/10",
    border: "border-blue-500/20",
    dot: "bg-blue-400",
  },
  spring: {
    label: "Spring",
    color: "text-green-400",
    bg: "from-green-500/10",
    border: "border-green-500/20",
    dot: "bg-green-400",
  },
  summer: {
    label: "Summer",
    color: "text-orange-400",
    bg: "from-orange-500/10",
    border: "border-orange-500/20",
    dot: "bg-orange-400",
  },
  fall: {
    label: "Fall",
    color: "text-red-400",
    bg: "from-red-500/10",
    border: "border-red-500/20",
    dot: "bg-red-400",
  },
};

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

  const [res, stats] = await Promise.all([
    fetch(apiUrl.toString(), { cache: "no-store" }),
    listSeasonStats(),
  ]);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to load season anime (${res.status}): ${text}`);
  }

  const data = (await res.json()) as SeasonApiResponse;
  const seasonItems = normalizeSeasonItems(data);
  const availableYears = Array.isArray(data.availableYears)
    ? data.availableYears
    : [];

  const statsMap = new Map<string, number>();
  for (const s of stats) {
    statsMap.set(`${s.year}-${s.season}`, s.count);
  }

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
    <div className="relative min-h-screen">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,#3b82f610,transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6  pb-10">
            <div className="space-y-1.5">
              <h1 className="text-[22px] sm:text-[28px] font-black tracking-tight text-white">
                Season Anime
              </h1>
            </div>

            <div className="relative z-20 flex flex-wrap items-center lg:justify-end gap-1">
              <FilterDropdown className="group relative">
                <summary className="list-none cursor-pointer flex items-center border-none gap-2 p-2.5 text-[#A0A0A0] transition-colors hover:bg-[#23252B] hover:text-white group-open:bg-[#23252B] group-open:text-white">
                  <span className="text-sm font-bold uppercase whitespace-nowrap">
                    {season} {year}
                  </span>
                  <DropdownIcon size={24} />
                </summary>
                <div className="absolute right-0 z-9999 max-h-[70vh] overflow-y-auto no-scrollbar w-[240px] bg-[#23252B] shadow-2xl">
                  <div className="flex flex-col py-2">
                    {availableYears.flatMap((y) =>
                      [...SEASONS].reverse().map((s) => {
                        const active = s === season && y === year;
                        const count = statsMap.get(`${y}-${s}`) ?? 0;
                        return (
                          <Link
                            key={`${y}-${s}`}
                            href={buildSeasonPagePath(y, s, filters)}
                            className={`flex items-center justify-between px-3 py-2 text-sm font-bold uppercase transition-all ${
                              active
                                ? "bg-[#1D1E22] text-white"
                                : "text-[#A0A0A0] hover:bg-[#1D1E22] hover:text-white"
                            }`}
                          >
                            <span className="capitalize">
                              {s} {y}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-medium opacity-50">
                                {count}
                              </span>
                            </div>
                          </Link>
                        );
                      }),
                    )}
                  </div>
                </div>
              </FilterDropdown>

              <FilterDropdown className="group relative">
                <summary className="list-none cursor-pointer flex items-center border-none gap-2 p-2.5 text-[#A0A0A0] transition-colors hover:bg-[#23252B] hover:text-white group-open:bg-[#23252B] group-open:text-white">
                  <FilterIcon size={20} />
                  <span className="text-sm font-bold uppercase whitespace-nowrap">
                    Type: {TYPE_FILTER_LABELS[filters.type]}
                  </span>
                  <DropdownIcon size={24} />
                </summary>
                <div className="absolute right-0 z-9999 min-w-[200px] bg-[#23252B] py-2.5 shadow-2xl">
                  <div className="flex flex-col">
                    {TYPE_FILTERS.map((tf) => {
                      const active = tf === filters.type;
                      return (
                        <Link
                          key={tf}
                          href={buildSeasonPagePath(year, season, {
                            ...filters,
                            type: tf,
                          })}
                          className={`flex items-center justify-between px-3 py-2 text-sm font-bold transition-all ${
                            active
                              ? "bg-[#1D1E22] text-white"
                              : "text-[#A0A0A0] hover:bg-[#1D1E22] hover:text-white"
                          }`}
                        >
                          {TYPE_FILTER_LABELS[tf]}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </FilterDropdown>

              <FilterDropdown className="group relative">
                <summary className="list-none cursor-pointer flex items-center border-none gap-2 p-2.5 text-[#A0A0A0] transition-colors hover:bg-[#23252B] hover:text-white group-open:bg-[#23252B] group-open:text-white">
                  <ArrowDownUp size={20} />
                  <span className="text-sm font-bold uppercase whitespace-nowrap">
                    Sort: {SORT_LABELS[filters.sort]}
                  </span>
                  <DropdownIcon size={24} />
                </summary>
                <div className="absolute right-0 z-9999 min-w-[200px] bg-[#23252B] py-2.5 shadow-2xl">
                  <div className="flex flex-col">
                    {SORT_OPTIONS.map((option) => {
                      const active = option === filters.sort;
                      return (
                        <Link
                          key={option}
                          href={buildSeasonPagePath(year, season, {
                            ...filters,
                            sort: option,
                          })}
                          className={`flex items-center justify-between px-3 py-2 text-sm font-bold transition-all ${
                            active
                              ? "bg-[#1D1E22] text-white"
                              : "text-[#A0A0A0] hover:bg-[#1D1E22] hover:text-white"
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
                <summary className="list-none cursor-pointer flex items-center border-none gap-2 p-2.5 text-[#A0A0A0] transition-colors hover:bg-[#23252B] hover:text-white group-open:bg-[#23252B] group-open:text-white">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    role="img"
                    fill="currentColor"
                  >
                    <path d="M9 18a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2h6zM21 4a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2h18zm-6 7a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2h12z" />
                  </svg>
                  <span className="text-sm font-bold uppercase whitespace-nowrap">
                    Advanced
                  </span>
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
                  <DropdownIcon size={24} />
                </summary>
                <div className="absolute right-0 z-9999 w-[300px] bg-[#23252B] p-5 shadow-2xl">
                  <form method="get" className="flex flex-col gap-6">
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
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#A0A0A0]">
                          Genre
                        </label>
                        <select
                          name="genre"
                          defaultValue={filters.genre ?? ""}
                          className="w-full rounded-lg border border-white/10 bg-[#1D1E22] px-4 py-2.5 text-sm font-bold text-white outline-none transition-all focus:border-indigo-500"
                        >
                          <option value="">All Genres</option>
                          {genreOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#A0A0A0]">
                          Theme
                        </label>
                        <select
                          name="theme"
                          defaultValue={filters.theme ?? ""}
                          className="w-full rounded-lg border border-white/10 bg-[#1D1E22] px-4 py-2.5 text-sm font-bold text-white outline-none transition-all focus:border-indigo-500"
                        >
                          <option value="">All Themes</option>
                          {themeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#A0A0A0]">
                          Demographic
                        </label>
                        <select
                          name="demographic"
                          defaultValue={filters.demographic ?? ""}
                          className="w-full rounded-lg border border-white/10 bg-[#1D1E22] px-4 py-2.5 text-sm font-bold text-white outline-none transition-all focus:border-indigo-500"
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

                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <button
                        type="submit"
                        className="flex-1 bg-indigo-600 px-4 py-2.5 text-xs font-black uppercase text-white hover:bg-indigo-500 transition-all hover:cursor-pointer"
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
                        className="border border-white/10 px-4 py-2.5 text-xs font-black uppercase text-[#A0A0A0] hover:bg-white/5 hover:text-white transition-all"
                      >
                        Reset
                      </Link>
                    </div>
                  </form>
                </div>
              </FilterDropdown>

              <FilterDropdown className="group relative">
                <summary className="list-none cursor-pointer flex items-center border-none gap-2 p-2.5 text-[#A0A0A0] transition-colors hover:bg-[#23252B] hover:text-white group-open:bg-[#23252B] group-open:text-white">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-[10px] font-black text-white">
                    18
                  </span>
                  <span className="text-sm font-bold uppercase whitespace-nowrap">
                    Safety
                  </span>
                  {(filters.kids || filters.r18) && (
                    <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  )}
                  <DropdownIcon size={24} />
                </summary>
                <div className="absolute right-0 z-9999 min-w-[200px] bg-[#23252B] p-4 shadow-2xl">
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
                      <label className="flex items-center justify-between cursor-pointer group/label">
                        <span className="text-xs font-bold uppercase text-[#A0A0A0] group-hover/label:text-white transition-colors">
                          Kids Friendly
                        </span>
                        <input
                          type="checkbox"
                          name="kids"
                          value="1"
                          defaultChecked={filters.kids}
                          className="h-4 w-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-0"
                        />
                      </label>

                      <label className="flex items-center justify-between cursor-pointer group/label">
                        <span className="text-xs font-bold uppercase text-[#A0A0A0] group-hover/label:text-red-400 transition-colors">
                          Adult (R18+)
                        </span>
                        <input
                          type="checkbox"
                          name="r18"
                          value="1"
                          defaultChecked={filters.r18}
                          className="h-4 w-4 rounded border-white/10 bg-white/5 text-red-600 focus:ring-0"
                        />
                      </label>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <button
                        type="submit"
                        className="flex-1 bg-white text-black px-4 py-2 text-xs font-black uppercase hover:bg-zinc-200 transition-all"
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
          <div className="flex flex-wrap items-center justify-between gap-4 py-2 -mt-14">
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
                  className="text-xs font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors hover:cursor-pointer"
                >
                  Reset All Filters
                </Link>
              )}
            </div>
          </div>
        </div>

        {seasonItems.length === 0 ? (
          <div className="rounded-3xl border border-white/5 bg-white/[0.02] px-6 py-24 text-center">
            <div className="mx-auto w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
              <Calendar size={20} className="text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No Anime Found
            </h3>
            <p className="text-[#A0A0A0] text-sm">
              We couldn't find any anime for {titleCase(season)} {year}.
            </p>
          </div>
        ) : visibleSections.length === 0 ? (
          <div className="rounded-3xl border border-white/5 bg-white/[0.02] px-6 py-24 text-center">
            <div className="mx-auto w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
              <FilterIcon size={20} className="text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Matches</h3>
            <p className="text-[#A0A0A0] text-sm mb-8">
              No {TYPE_FILTER_LABELS[filters.type]} titles match your current
              filters.
            </p>
            <Link
              href={buildSeasonPagePath(year, season, {
                ...filters,
                type: "all",
              })}
              className="inline-flex px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-black uppercase text-xs hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
            >
              Show All Types
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-24">
            {visibleSections.map((section) => (
              <section
                key={section.key}
                aria-labelledby={`season-section-${section.key}`}
              >
                <div className="flex items-center gap-6 mb-10">
                  <h2
                    id={`season-section-${section.key}`}
                    className="text-sm font-black uppercase tracking-[0.3em] text-white/40"
                  >
                    {section.label}
                  </h2>
                  <div className="h-px flex-1 bg-white/5" />
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                    {section.items.length} Shows
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
