import { db } from "@/lib/db";
import { ensureDatabase } from "@/lib/db/bootstrap";
import {
  manga,
  mangaWatchlist,
  MANGA_WATCHLIST_STATUSES,
  type MangaWatchlistStatus,
} from "@/lib/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";

export interface MangaWatchlistFormInput {
  status: string;
  volumesRead: number;
  chaptersRead: number;
  score?: number | null;
  startDate?: string | null;
  finishDate?: string | null;
}

export interface MangaWatchlistEntryView {
  id: number;
  status: MangaWatchlistStatus;
  volumesRead: number;
  chaptersRead: number;
  score: number | null;
  startDate: string | null;
  finishDate: string | null;
  manga: {
    malId: number;
    title: string;
    imageUrl: string | null;
    totalVolumes: number | null;
    totalChapters: number | null;
  };
}

const mangaWatchlistStatusSet = new Set<string>(MANGA_WATCHLIST_STATUSES);

function parseOptionalDate(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value: Date | null) {
  if (!value) {
    return null;
  }

  return value.toISOString().slice(0, 10);
}

function validateProgress(
  label: string,
  value: number,
  total: number | null,
) {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${label} must be a positive integer or zero`);
  }

  if (total !== null && value > total) {
    throw new Error(`${label} cannot be greater than ${total}`);
  }
}

function validatePayload(
  payload: MangaWatchlistFormInput,
  totalVolumes: number | null,
  totalChapters: number | null,
) {
  if (!mangaWatchlistStatusSet.has(payload.status)) {
    throw new Error("Invalid manga watchlist status");
  }

  const volumesRead = Number(payload.volumesRead);
  const chaptersRead = Number(payload.chaptersRead);

  validateProgress("Volumes read", volumesRead, totalVolumes);
  validateProgress("Chapters read", chaptersRead, totalChapters);

  let score: number | null = null;
  if (payload.score !== null && payload.score !== undefined && payload.score !== "") {
    score = Number(payload.score);
    if (Number.isNaN(score) || score < 0 || score > 10) {
      throw new Error("Your score must be between 0 and 10");
    }
  }

  const startDate = parseOptionalDate(payload.startDate);
  if (payload.startDate && !startDate) {
    throw new Error("Invalid start date");
  }

  const finishDate = parseOptionalDate(payload.finishDate);
  if (payload.finishDate && !finishDate) {
    throw new Error("Invalid finish date");
  }

  if (startDate && finishDate && finishDate < startDate) {
    throw new Error("Finish date cannot be before start date");
  }

  return {
    status: payload.status as MangaWatchlistStatus,
    volumesRead,
    chaptersRead,
    score,
    startDate,
    finishDate,
  };
}

function mapMangaWatchlistRow(row: {
  watchlist: typeof mangaWatchlist.$inferSelect;
  manga: Pick<typeof manga.$inferSelect, "malId" | "title" | "imageUrl" | "volumes" | "chapters">;
}): MangaWatchlistEntryView {
  return {
    id: row.watchlist.id,
    status: row.watchlist.status,
    volumesRead: row.watchlist.volumesRead,
    chaptersRead: row.watchlist.chaptersRead,
    score: row.watchlist.score,
    startDate: formatDate(row.watchlist.startDate),
    finishDate: formatDate(row.watchlist.finishDate),
    manga: {
      malId: row.manga.malId,
      title: row.manga.title,
      imageUrl: row.manga.imageUrl,
      totalVolumes: row.manga.volumes,
      totalChapters: row.manga.chapters,
    },
  };
}

async function getMangaByMalId(malId: number) {
  const [mangaRecord] = await db
    .select({
      id: manga.id,
      malId: manga.malId,
      title: manga.title,
      imageUrl: manga.imageUrl,
      volumes: manga.volumes,
      chapters: manga.chapters,
    })
    .from(manga)
    .where(eq(manga.malId, malId))
    .limit(1);

  return mangaRecord ?? null;
}

export async function getMangaWatchlistEntryByMalId(userId: number, malId: number) {
  await ensureDatabase();

  const result = await db
    .select({
      watchlist: mangaWatchlist,
      manga: {
        malId: manga.malId,
        title: manga.title,
        imageUrl: manga.imageUrl,
        volumes: manga.volumes,
        chapters: manga.chapters,
      },
    })
    .from(mangaWatchlist)
    .innerJoin(manga, eq(mangaWatchlist.mangaId, manga.id))
    .where(and(eq(mangaWatchlist.userId, userId), eq(manga.malId, malId)))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return mapMangaWatchlistRow(result[0]);
}

export async function listMangaWatchlistEntries(userId: number) {
  await ensureDatabase();

  const result = await db
    .select({
      watchlist: mangaWatchlist,
      manga: {
        malId: manga.malId,
        title: manga.title,
        imageUrl: manga.imageUrl,
        volumes: manga.volumes,
        chapters: manga.chapters,
      },
    })
    .from(mangaWatchlist)
    .innerJoin(manga, eq(mangaWatchlist.mangaId, manga.id))
    .where(eq(mangaWatchlist.userId, userId))
    .orderBy(desc(mangaWatchlist.updatedAt), desc(mangaWatchlist.createdAt));

  return result.map(mapMangaWatchlistRow);
}

export async function listMangaWatchlistEntriesByMalIds(userId: number, malIds: number[]) {
  await ensureDatabase();

  if (malIds.length === 0) {
    return [];
  }

  const result = await db
    .select({
      watchlist: mangaWatchlist,
      manga: {
        malId: manga.malId,
        title: manga.title,
        imageUrl: manga.imageUrl,
        volumes: manga.volumes,
        chapters: manga.chapters,
      },
    })
    .from(mangaWatchlist)
    .innerJoin(manga, eq(mangaWatchlist.mangaId, manga.id))
    .where(and(eq(mangaWatchlist.userId, userId), inArray(manga.malId, malIds)))
    .orderBy(desc(mangaWatchlist.updatedAt), desc(mangaWatchlist.createdAt));

  return result.map(mapMangaWatchlistRow);
}

export async function upsertMangaWatchlistEntry(
  userId: number,
  malId: number,
  payload: MangaWatchlistFormInput,
) {
  await ensureDatabase();

  const mangaRecord = await getMangaByMalId(malId);
  if (!mangaRecord) {
    throw new Error("Manga not found");
  }

  const validated = validatePayload(payload, mangaRecord.volumes, mangaRecord.chapters);
  const [existingEntry] = await db
    .select()
    .from(mangaWatchlist)
    .where(and(eq(mangaWatchlist.userId, userId), eq(mangaWatchlist.mangaId, mangaRecord.id)))
    .limit(1);

  if (existingEntry) {
    await db
      .update(mangaWatchlist)
      .set({
        ...validated,
        updatedAt: new Date(),
      })
      .where(eq(mangaWatchlist.id, existingEntry.id));
  } else {
    await db.insert(mangaWatchlist).values({
      userId,
      mangaId: mangaRecord.id,
      ...validated,
      updatedAt: new Date(),
    });
  }

  const savedEntry = await getMangaWatchlistEntryByMalId(userId, malId);
  if (!savedEntry) {
    throw new Error("Failed to save manga watchlist entry");
  }

  return savedEntry;
}

export async function deleteMangaWatchlistEntry(userId: number, malId: number) {
  await ensureDatabase();

  const mangaRecord = await getMangaByMalId(malId);
  if (!mangaRecord) {
    return false;
  }

  const deleted = await db
    .delete(mangaWatchlist)
    .where(and(eq(mangaWatchlist.userId, userId), eq(mangaWatchlist.mangaId, mangaRecord.id)))
    .returning({ id: mangaWatchlist.id });

  return deleted.length > 0;
}
