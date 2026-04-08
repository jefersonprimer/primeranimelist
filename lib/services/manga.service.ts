import { db } from "@/lib/db";
import { ensureDatabase } from "@/lib/db/bootstrap";
import { manga } from "@/lib/db/schema";
import { and, asc, count, desc, eq, gt, isNotNull } from "drizzle-orm";

type ListMangaOptions = {
  page?: number;
  limit?: number;
  filter?: string;
};

const VALID_TOP_MANGA_FILTERS = [
  "manga",
  "oneshots",
  "doujin",
  "novels",
  "manhwa",
  "manhua",
  "bypopularity",
  "favorite",
] as const;

export type TopMangaFilter = (typeof VALID_TOP_MANGA_FILTERS)[number];

export function parseTopMangaFilter(value: string | string[] | undefined): TopMangaFilter | null {
  const rawValue = Array.isArray(value) ? value[0] : value;
  if (!rawValue) return null;
  return (VALID_TOP_MANGA_FILTERS as readonly string[]).includes(rawValue) ? (rawValue as TopMangaFilter) : null;
}

function buildTopMangaQuery(filter: TopMangaFilter | null) {
  if (!filter) {
    return {
      where: and(isNotNull(manga.rank), gt(manga.rank, 0)),
      orderBy: [asc(manga.rank), desc(manga.members)] as const,
    };
  }

  switch (filter) {
    case "manga":
      return {
        where: and(isNotNull(manga.rank), gt(manga.rank, 0), eq(manga.type, "Manga")),
        orderBy: [asc(manga.rank), desc(manga.members)] as const,
      };
    case "oneshots":
      return {
        where: and(isNotNull(manga.rank), gt(manga.rank, 0), eq(manga.type, "One-shot")),
        orderBy: [asc(manga.rank), desc(manga.members)] as const,
      };
    case "doujin":
      return {
        where: and(isNotNull(manga.rank), gt(manga.rank, 0), eq(manga.type, "Doujinshi")),
        orderBy: [asc(manga.rank), desc(manga.members)] as const,
      };
    case "novels":
      return {
        where: and(isNotNull(manga.rank), gt(manga.rank, 0), eq(manga.type, "Novel")),
        orderBy: [asc(manga.rank), desc(manga.members)] as const,
      };
    case "manhwa":
      return {
        where: and(isNotNull(manga.rank), gt(manga.rank, 0), eq(manga.type, "Manhwa")),
        orderBy: [asc(manga.rank), desc(manga.members)] as const,
      };
    case "manhua":
      return {
        where: and(isNotNull(manga.rank), gt(manga.rank, 0), eq(manga.type, "Manhua")),
        orderBy: [asc(manga.rank), desc(manga.members)] as const,
      };
    case "bypopularity":
      return {
        where: and(isNotNull(manga.popularity), gt(manga.popularity, 0)),
        orderBy: [asc(manga.popularity), desc(manga.members)] as const,
      };
    case "favorite":
      return {
        where: and(isNotNull(manga.favorites), gt(manga.favorites, 0)),
        orderBy: [desc(manga.favorites), desc(manga.members)] as const,
      };
  }
}

export async function listManga({ page = 1, limit = 50, filter }: ListMangaOptions = {}) {
  await ensureDatabase();

  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 50;
  const offset = (safePage - 1) * safeLimit;
  const parsedFilter = parseTopMangaFilter(filter);
  const { where, orderBy } = buildTopMangaQuery(parsedFilter);

  const [items, [{ total }]] = await Promise.all([
    db
      .select()
      .from(manga)
      .where(where)
      .orderBy(...orderBy)
      .limit(safeLimit)
      .offset(offset),
    db
      .select({ total: count() })
      .from(manga)
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

export async function getMangaByMalId(malId: number) {
  await ensureDatabase();

  const result = await db
    .select()
    .from(manga)
    .where(eq(manga.malId, malId))
    .limit(1);

  return result[0] ?? null;
}

