import { db } from "@/lib/db";
import { ensureDatabase } from "@/lib/db/bootstrap";
import { anime } from "@/lib/db/schema";
import { asc, count, desc, eq, gt, isNotNull, and } from "drizzle-orm";

type ListAnimeOptions = {
  page?: number;
  limit?: number;
  filter?: string;
};

const VALID_TOP_ANIME_FILTERS = [
  "airing",
  "upcoming",
  "tv",
  "movie",
  "ova",
  "ona",
  "special",
  "bypopularity",
  "favorite",
] as const;

export type TopAnimeFilter = (typeof VALID_TOP_ANIME_FILTERS)[number];

export function parseTopAnimeFilter(value: string | string[] | undefined): TopAnimeFilter | null {
  const rawValue = Array.isArray(value) ? value[0] : value;
  if (!rawValue) return null;
  return (VALID_TOP_ANIME_FILTERS as readonly string[]).includes(rawValue) ? (rawValue as TopAnimeFilter) : null;
}

function buildTopAnimeQuery(filter: TopAnimeFilter | null) {
  if (!filter) {
    return {
      where: and(isNotNull(anime.rank), gt(anime.rank, 0)),
      orderBy: [asc(anime.rank), desc(anime.members)] as const,
    };
  }

  const now = new Date();
  const month = now.getUTCMonth() + 1; // 1-12
  const year = now.getUTCFullYear();
  const currentSeason = month <= 3 ? "winter" : month <= 6 ? "spring" : month <= 9 ? "summer" : "fall";
  const nextSeason =
    currentSeason === "winter"
      ? "spring"
      : currentSeason === "spring"
        ? "summer"
        : currentSeason === "summer"
          ? "fall"
          : "winter";
  const nextYear = currentSeason === "fall" ? year + 1 : year;

  switch (filter) {
    case "airing":
      return {
        where: and(
          eq(anime.season, currentSeason),
          eq(anime.year, year),
          eq(anime.isAiring, true),
          isNotNull(anime.score),
          gt(anime.score, 0)
        ),
        orderBy: [desc(anime.score), desc(anime.members)] as const,
      };
    case "upcoming":
      return {
        where: and(eq(anime.season, nextSeason), eq(anime.year, nextYear)),
        orderBy: [desc(anime.members), desc(anime.favorites)] as const,
      };
    case "tv":
      return {
        where: and(isNotNull(anime.rank), gt(anime.rank, 0), eq(anime.type, "TV")),
        orderBy: [asc(anime.rank), desc(anime.members)] as const,
      };
    case "movie":
      return {
        where: and(isNotNull(anime.rank), gt(anime.rank, 0), eq(anime.type, "Movie")),
        orderBy: [asc(anime.rank), desc(anime.members)] as const,
      };
    case "ova":
      return {
        where: and(isNotNull(anime.rank), gt(anime.rank, 0), eq(anime.type, "OVA")),
        orderBy: [asc(anime.rank), desc(anime.members)] as const,
      };
    case "ona":
      return {
        where: and(isNotNull(anime.rank), gt(anime.rank, 0), eq(anime.type, "ONA")),
        orderBy: [asc(anime.rank), desc(anime.members)] as const,
      };
    case "special":
      return {
        where: and(isNotNull(anime.rank), gt(anime.rank, 0), eq(anime.type, "Special")),
        orderBy: [asc(anime.rank), desc(anime.members)] as const,
      };
    case "bypopularity":
      return {
        where: and(isNotNull(anime.popularity), gt(anime.popularity, 0)),
        orderBy: [asc(anime.popularity), desc(anime.members)] as const,
      };
    case "favorite":
      return {
        where: and(isNotNull(anime.favorites), gt(anime.favorites, 0)),
        orderBy: [desc(anime.favorites), desc(anime.members)] as const,
      };
  }
}

export async function listAnime({ page = 1, limit = 50, filter }: ListAnimeOptions = {}) {
  await ensureDatabase();

  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 50;
  const offset = (safePage - 1) * safeLimit;
  const parsedFilter = parseTopAnimeFilter(filter);
  const { where, orderBy } = buildTopAnimeQuery(parsedFilter);

  const [items, [{ total }]] = await Promise.all([
    db
      .select()
      .from(anime)
      .where(where)
      .orderBy(...orderBy)
      .limit(safeLimit)
      .offset(offset),
    db
      .select({ total: count() })
      .from(anime)
      .where(where),
  ]);

  return {
    items,
    limit: safeLimit,
    page: safePage,
    filter: parsedFilter,
    total,
    totalPages: Math.max(1, Math.ceil(total / safeLimit)),
  };
}

export async function getAnimeByMalId(malId: number) {
  await ensureDatabase();

  const result = await db
    .select()
    .from(anime)
    .where(eq(anime.malId, malId))
    .limit(1);

  return result[0] ?? null;
}

const VALID_SEASONS = ["winter", "spring", "summer", "fall"] as const;
export type AnimeSeason = (typeof VALID_SEASONS)[number];

type ListAnimeBySeasonYearOptions = {
  season: AnimeSeason;
  year: number;
  limit?: number;
};

export async function listAvailableAnimeYears() {
  await ensureDatabase();

  const rows = await db
    .selectDistinct({ year: anime.year })
    .from(anime)
    .where(and(isNotNull(anime.year), gt(anime.year, 0)))
    .orderBy(desc(anime.year));

  return rows.map((row) => row.year!).filter((year): year is number => Number.isFinite(year));
}

export async function listAnimeBySeasonYear({ season, year, limit = 200 }: ListAnimeBySeasonYearOptions) {
  await ensureDatabase();

  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 200;
  const safeYear = Number.isFinite(year) && year > 0 ? Math.floor(year) : year;

  const items = await db
    .select()
    .from(anime)
    .where(and(eq(anime.season, season), eq(anime.year, safeYear)))
    .orderBy(asc(anime.rank), desc(anime.members), asc(anime.title))
    .limit(safeLimit);

  return { items, season, year: safeYear, limit: safeLimit };
}

export async function getAnimeBySeason({ season, year, limit }: ListAnimeBySeasonYearOptions) {
  return listAnimeBySeasonYear({ season, year, limit });
}

export function isValidAnimeSeason(value: string): value is AnimeSeason {
  return (VALID_SEASONS as readonly string[]).includes(value);
}
