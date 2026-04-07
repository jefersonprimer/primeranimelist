import { db } from "@/lib/db";
import { ensureDatabase } from "@/lib/db/bootstrap";
import { anime } from "@/lib/db/schema";
import { asc, count, desc, eq, gt, isNotNull, and } from "drizzle-orm";

type ListAnimeOptions = {
  page?: number;
  limit?: number;
};

export async function listAnime({ page = 1, limit = 50 }: ListAnimeOptions = {}) {
  await ensureDatabase();

  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 50;
  const offset = (safePage - 1) * safeLimit;

  const [items, [{ total }]] = await Promise.all([
    db
      .select()
      .from(anime)
      .where(gt(anime.rank, 0))
      .orderBy(asc(anime.rank), desc(anime.members))
      .limit(safeLimit)
      .offset(offset),
    db
      .select({ total: count() })
      .from(anime)
      .where(gt(anime.rank, 0)),
  ]);

  return {
    items,
    limit: safeLimit,
    page: safePage,
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
