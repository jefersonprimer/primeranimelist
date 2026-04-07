import { db } from "@/lib/db";
import { ensureDatabase } from "@/lib/db/bootstrap";
import { anime } from "@/lib/db/schema";
import { asc, count, isNotNull } from "drizzle-orm";

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
      .where(isNotNull(anime.rank))
      .orderBy(asc(anime.rank))
      .limit(safeLimit)
      .offset(offset),
    db
      .select({ total: count() })
      .from(anime)
      .where(isNotNull(anime.rank)),
  ]);

  return {
    items,
    limit: safeLimit,
    page: safePage,
    total,
    totalPages: Math.max(1, Math.ceil(total / safeLimit)),
  };
}
