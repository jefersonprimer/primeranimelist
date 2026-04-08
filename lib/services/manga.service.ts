import { db } from "@/lib/db";
import { ensureDatabase } from "@/lib/db/bootstrap";
import { manga } from "@/lib/db/schema";
import { asc, count, desc, eq, gt } from "drizzle-orm";

type ListMangaOptions = {
  page?: number;
  limit?: number;
};

export async function listManga({ page = 1, limit = 50 }: ListMangaOptions = {}) {
  await ensureDatabase();

  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 50;
  const offset = (safePage - 1) * safeLimit;

  const [items, [{ total }]] = await Promise.all([
    db
      .select()
      .from(manga)
      .where(gt(manga.rank, 0))
      .orderBy(asc(manga.rank), desc(manga.members))
      .limit(safeLimit)
      .offset(offset),
    db
      .select({ total: count() })
      .from(manga)
      .where(gt(manga.rank, 0)),
  ]);

  return {
    items,
    limit: safeLimit,
    page: safePage,
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

