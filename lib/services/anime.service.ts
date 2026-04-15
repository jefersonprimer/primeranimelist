import { db } from "@/lib/db";
import { ensureDatabase } from "@/lib/db/bootstrap";
import { anime } from "@/lib/db/schema";
import { asc, and, count, desc, eq, gt, ilike, isNotNull, or } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

type ListAnimeOptions = {
  page?: number;
  limit?: number;
  filter?: string;
};

type SearchAnimeOptions = {
  query: string;
  limit?: number;
};

type AnimeRow = InferSelectModel<typeof anime>;
type AnimeRelationValue =
  | string
  | {
      mal_id?: number | null;
      type?: string | null;
      name?: string | null;
      url?: string | null;
    };

function formatDateISOString(date: Date | null) {
  return date ? date.toISOString() : null;
}

function buildDateProp(date: Date | null) {
  if (!date) {
    return { day: null, month: null, year: null };
  }

  return {
    day: date.getUTCDate(),
    month: date.getUTCMonth() + 1,
    year: date.getUTCFullYear(),
  };
}

function formatAiredString(from: Date | null, to: Date | null) {
  if (!from && !to) return null;

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  const fromText = from ? formatter.format(from) : "?";
  const toText = to ? formatter.format(to) : "?";

  return `${fromText} to ${toText}`;
}

function slugifyMalTitle(title: string) {
  return title
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[-\s]+/g, "_");
}

function buildMalAnimeUrl(malId: number, title: string) {
  return `https://myanimelist.net/anime/${malId}/${slugifyMalTitle(title)}`;
}

function deriveImageUrls(imageUrl: string | null) {
  if (!imageUrl) {
    return {
      jpg: {
        image_url: null,
        small_image_url: null,
        large_image_url: null,
      },
      webp: {
        image_url: null,
        small_image_url: null,
        large_image_url: null,
      },
    };
  }

  const jpg = {
    image_url: imageUrl,
    small_image_url: imageUrl.replace(/(\.[a-z]+)$/i, "t$1"),
    large_image_url: imageUrl.replace(/(\.[a-z]+)$/i, "l$1"),
  };

  const webpBase = imageUrl.replace(/\.jpg$/i, ".webp");
  const webp = {
    image_url: webpBase,
    small_image_url: webpBase.replace(/(\.[a-z]+)$/i, "t$1"),
    large_image_url: webpBase.replace(/(\.[a-z]+)$/i, "l$1"),
  };

  return { jpg, webp };
}

function extractYoutubeId(url: string | null) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1) || null;
    }

    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v");
    }
  } catch {}

  return null;
}

function buildTrailer(trailerUrl: string | null) {
  const youtubeId = extractYoutubeId(trailerUrl);

  return {
    youtube_id: youtubeId,
    url: trailerUrl,
    embed_url: youtubeId
      ? `https://www.youtube-nocookie.com/embed/${youtubeId}?enablejsapi=1&wmode=opaque&autoplay=1`
      : null,
    images: {
      image_url: null,
      small_image_url: null,
      medium_image_url: null,
      large_image_url: null,
      maximum_image_url: null,
    },
  };
}

function serializeRelationItem(kind: "producer" | "studio" | "genre", value: AnimeRelationValue) {
  if (typeof value === "string") {
    const encoded = encodeURIComponent(value.replace(/\s+/g, "_"));
    const basePath =
      kind === "producer"
        ? "producer"
        : kind === "studio"
          ? "producer"
          : "genre";

    return {
      mal_id: null,
      type: "anime",
      name: value,
      url: `https://myanimelist.net/anime/${basePath}/${encoded}`,
    };
  }

  return {
    mal_id: value.mal_id ?? null,
    type: value.type ?? "anime",
    name: value.name ?? "",
    url: value.url ?? null,
  };
}

function serializeRelationList(values: AnimeRow["genres"], kind: "producer" | "studio" | "genre") {
  if (!Array.isArray(values)) return [];
  return values.map((value) => serializeRelationItem(kind, value as AnimeRelationValue));
}

function buildTitles(row: AnimeRow) {
  const titles = [{ type: "Default", title: row.title }];

  if (row.titleEnglish && row.titleEnglish !== row.title) {
    titles.push({ type: "English", title: row.titleEnglish });
  }

  if (row.titleJapanese && row.titleJapanese !== row.title) {
    titles.push({ type: "Japanese", title: row.titleJapanese });
  }

  return titles;
}

export function serializeAnime(row: AnimeRow) {
  return {
    mal_id: row.malId,
    url: buildMalAnimeUrl(row.malId, row.title),
    images: deriveImageUrls(row.imageUrl),
    trailer: buildTrailer(row.trailerUrl),
    approved: true,
    titles: buildTitles(row),
    title: row.title,
    title_english: row.titleEnglish,
    title_japanese: row.titleJapanese,
    title_synonyms: [],
    type: row.type,
    source: row.source,
    episodes: row.episodes,
    status: row.status,
    airing: row.isAiring,
    aired: {
      from: formatDateISOString(row.airedFrom),
      to: formatDateISOString(row.airedTo),
      prop: {
        from: buildDateProp(row.airedFrom),
        to: buildDateProp(row.airedTo),
      },
      string: formatAiredString(row.airedFrom, row.airedTo),
    },
    duration: row.duration,
    rating: row.rating,
    score: row.score,
    scored_by: row.scoredBy,
    rank: row.rank,
    popularity: row.popularity,
    members: row.members,
    favorites: row.favorites,
    synopsis: row.synopsis,
    background: null,
    season: row.season,
    year: row.year,
    broadcast: {
      day: null,
      time: null,
      timezone: null,
      string: null,
    },
    producers: serializeRelationList(row.producers, "producer"),
    licensors: serializeRelationList(row.licensors, "producer"),
    studios: serializeRelationList(row.studios, "studio"),
    genres: serializeRelationList(row.genres, "genre"),
    explicit_genres: [],
    themes: serializeRelationList(row.themes, "genre"),
    demographics: serializeRelationList(row.demographics, "genre"),
  };
}

export function serializeAnimeListResponse(
  rows: AnimeRow[],
  {
    page,
    limit,
    total,
  }: {
    page: number;
    limit: number;
    total: number;
  }
) {
  return {
    pagination: {
      last_visible_page: Math.max(1, Math.ceil(total / limit)),
      has_next_page: page * limit < total,
      current_page: page,
      items: {
        count: rows.length,
        total,
        per_page: limit,
      },
    },
    data: rows.map(serializeAnime),
  };
}

export function serializeSingleAnimeResponse(row: AnimeRow) {
  return {
    data: serializeAnime(row),
  };
}

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
  "season",
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
    case "season":
      return {
        where: and(eq(anime.season, currentSeason), eq(anime.year, year)),
        orderBy: [asc(anime.rank), desc(anime.members)] as const,
      };
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

export async function searchAnime({ query, limit = 24 }: SearchAnimeOptions) {
  await ensureDatabase();

  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 24;
  const pattern = `%${trimmedQuery}%`;

  return db
    .select()
    .from(anime)
    .where(
      or(
        ilike(anime.title, pattern),
        ilike(anime.titleEnglish, pattern),
        ilike(anime.titleJapanese, pattern)
      )
    )
    .orderBy(asc(anime.rank), desc(anime.members))
    .limit(safeLimit);
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
