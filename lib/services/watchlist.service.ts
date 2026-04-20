import { db } from "@/lib/db";
import { ensureDatabase } from "@/lib/db/bootstrap";
import { anime, animeWatchlist, WATCHLIST_STATUSES, type WatchlistStatus } from "@/lib/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";

export interface WatchlistFormInput {
  status: string;
  episodesWatched: number;
  score?: number | null;
  startDate?: string | null;
  finishDate?: string | null;
  isFavorite?: boolean;
}

export interface WatchlistEntryView {
  id: number;
  status: WatchlistStatus;
  episodesWatched: number;
  score: number | null;
  startDate: string | null;
  finishDate: string | null;
  isFavorite: boolean;
  anime: {
    malId: number;
    title: string;
    imageUrl: string | null;
    totalEpisodes: number | null;
  };
}

const watchlistStatusSet = new Set<string>(WATCHLIST_STATUSES);

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

function validatePayload(payload: WatchlistFormInput, totalEpisodes: number | null) {
  if (!watchlistStatusSet.has(payload.status)) {
    throw new Error("Invalid watchlist status");
  }

  const episodesWatched = Number(payload.episodesWatched);
  if (!Number.isInteger(episodesWatched) || episodesWatched < 0) {
    throw new Error("Episodes watched must be a positive integer or zero");
  }

  if (totalEpisodes !== null && episodesWatched > totalEpisodes) {
    throw new Error(`Episodes watched cannot be greater than ${totalEpisodes}`);
  }

  let score: number | null = null;
  if (payload.score !== null && payload.score !== undefined) {
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
    status: payload.status as WatchlistStatus,
    episodesWatched,
    score,
    startDate,
    finishDate,
    isFavorite: Boolean(payload.isFavorite),
  };
}

function mapWatchlistRow(row: {
  watchlist: typeof animeWatchlist.$inferSelect;
  anime: Pick<typeof anime.$inferSelect, "malId" | "title" | "imageUrl" | "episodes">;
}): WatchlistEntryView {
  return {
    id: row.watchlist.id,
    status: row.watchlist.status,
    episodesWatched: row.watchlist.episodesWatched,
    score: row.watchlist.score,
    startDate: formatDate(row.watchlist.startDate),
    finishDate: formatDate(row.watchlist.finishDate),
    isFavorite: row.watchlist.isFavorite,
    anime: {
      malId: row.anime.malId,
      title: row.anime.title,
      imageUrl: row.anime.imageUrl,
      totalEpisodes: row.anime.episodes,
    },
  };
}

async function getAnimeByMalId(malId: number) {
  const [animeRecord] = await db
    .select({
      id: anime.id,
      malId: anime.malId,
      title: anime.title,
      imageUrl: anime.imageUrl,
      episodes: anime.episodes,
    })
    .from(anime)
    .where(eq(anime.malId, malId))
    .limit(1);

  return animeRecord ?? null;
}

export async function getWatchlistEntryByMalId(userId: number, malId: number) {
  await ensureDatabase();

  const result = await db
    .select({
      watchlist: animeWatchlist,
      anime: {
        malId: anime.malId,
        title: anime.title,
        imageUrl: anime.imageUrl,
        episodes: anime.episodes,
      },
    })
    .from(animeWatchlist)
    .innerJoin(anime, eq(animeWatchlist.animeId, anime.id))
    .where(and(eq(animeWatchlist.userId, userId), eq(anime.malId, malId)))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return mapWatchlistRow(result[0]);
}

export async function listWatchlistEntries(userId: number) {
  await ensureDatabase();

  const result = await db
    .select({
      watchlist: animeWatchlist,
      anime: {
        malId: anime.malId,
        title: anime.title,
        imageUrl: anime.imageUrl,
        episodes: anime.episodes,
      },
    })
    .from(animeWatchlist)
    .innerJoin(anime, eq(animeWatchlist.animeId, anime.id))
    .where(eq(animeWatchlist.userId, userId))
    .orderBy(desc(animeWatchlist.updatedAt), desc(animeWatchlist.createdAt));

  return result.map(mapWatchlistRow);
}

export async function listWatchlistEntriesByMalIds(userId: number, malIds: number[]) {
  await ensureDatabase();

  if (malIds.length === 0) {
    return [];
  }

  const result = await db
    .select({
      watchlist: animeWatchlist,
      anime: {
        malId: anime.malId,
        title: anime.title,
        imageUrl: anime.imageUrl,
        episodes: anime.episodes,
      },
    })
    .from(animeWatchlist)
    .innerJoin(anime, eq(animeWatchlist.animeId, anime.id))
    .where(and(eq(animeWatchlist.userId, userId), inArray(anime.malId, malIds)))
    .orderBy(desc(animeWatchlist.updatedAt), desc(animeWatchlist.createdAt));

  return result.map(mapWatchlistRow);
}

export async function upsertWatchlistEntry(userId: number, malId: number, payload: WatchlistFormInput) {
  await ensureDatabase();

  const animeRecord = await getAnimeByMalId(malId);
  if (!animeRecord) {
    throw new Error("Anime not found");
  }

  const validated = validatePayload(payload, animeRecord.episodes);
  const [existingEntry] = await db
    .select()
    .from(animeWatchlist)
    .where(and(eq(animeWatchlist.userId, userId), eq(animeWatchlist.animeId, animeRecord.id)))
    .limit(1);

  if (existingEntry) {
    await db
      .update(animeWatchlist)
      .set({
        ...validated,
        updatedAt: new Date(),
      })
      .where(eq(animeWatchlist.id, existingEntry.id));
  } else {
    await db.insert(animeWatchlist).values({
      userId,
      animeId: animeRecord.id,
      ...validated,
      updatedAt: new Date(),
    });
  }

  const savedEntry = await getWatchlistEntryByMalId(userId, malId);
  if (!savedEntry) {
    throw new Error("Failed to save watchlist entry");
  }

  return savedEntry;
}

export async function deleteWatchlistEntry(userId: number, malId: number) {
  await ensureDatabase();

  const animeRecord = await getAnimeByMalId(malId);
  if (!animeRecord) {
    return false;
  }

  const deleted = await db
    .delete(animeWatchlist)
    .where(and(eq(animeWatchlist.userId, userId), eq(animeWatchlist.animeId, animeRecord.id)))
    .returning({ id: animeWatchlist.id });

  return deleted.length > 0;
}
