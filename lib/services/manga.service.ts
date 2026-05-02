import { db } from "@/lib/db";
import { ensureDatabase } from "@/lib/db/bootstrap";
import { manga } from "@/lib/db/schema";
import { and, asc, count, desc, eq, gt, ilike, isNotNull, or, sql } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

type ListMangaOptions = {
  page?: number;
  limit?: number;
  filter?: string;
};

type SearchMangaOptions = {
  query: string;
  limit?: number;
};

type MangaRow = InferSelectModel<typeof manga>;
type MangaRelationValue =
  | string
  | {
      mal_id?: number | null;
      type?: string | null;
      name?: string | null;
      url?: string | null;
    }
  | {
      type?: string | null;
      name?: string | null;
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

function formatPublishedString(from: Date | null, to: Date | null) {
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

function buildMalMangaUrl(malId: number, title: string) {
  return `https://myanimelist.net/manga/${malId}/${slugifyMalTitle(title)}`;
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

function buildTitles(row: MangaRow) {
  const titles = [{ type: "Default", title: row.title }];

  if (row.titleJapanese && row.titleJapanese !== row.title) {
    titles.push({ type: "Japanese", title: row.titleJapanese });
  }

  if (row.titleEnglish && row.titleEnglish !== row.title) {
    titles.push({ type: "English", title: row.titleEnglish });
  }

  return titles;
}

function serializeRelationItem(kind: "genre" | "author" | "serialization", value: MangaRelationValue) {
  if (typeof value === "string") {
    const encoded = encodeURIComponent(value.replace(/\s+/g, "_"));
    const basePath =
      kind === "author"
        ? "people"
        : kind === "serialization"
          ? "magazine"
          : "genre";

    return {
      mal_id: null,
      type: "manga",
      name: value,
      url: `https://myanimelist.net/manga/${basePath}/${encoded}`,
    };
  }

  if (kind === "author") {
    return {
      mal_id: "mal_id" in value ? value.mal_id ?? null : null,
      type: value.type ?? "people",
      name: value.name ?? "",
      url:
        "url" in value && value.url
          ? value.url
          : value.name
            ? `https://myanimelist.net/people/${encodeURIComponent(value.name.replace(/\s+/g, "_"))}`
            : null,
    };
  }

  return {
    mal_id: "mal_id" in value ? value.mal_id ?? null : null,
    type: value.type ?? "manga",
    name: value.name ?? "",
    url:
      "url" in value && value.url
        ? value.url
        : value.name
          ? `https://myanimelist.net/manga/${kind === "serialization" ? "magazine" : "genre"}/${encodeURIComponent(
              value.name.replace(/\s+/g, "_")
            )}`
          : null,
  };
}

function serializeRelationList(values: MangaRow["genres"], kind: "genre" | "author" | "serialization") {
  if (!Array.isArray(values)) return [];
  return values.map((value) => serializeRelationItem(kind, value as MangaRelationValue));
}

export function serializeManga(row: MangaRow) {
  return {
    mal_id: row.malId,
    url: buildMalMangaUrl(row.malId, row.title),
    images: deriveImageUrls(row.imageUrl),
    approved: true,
    titles: buildTitles(row),
    title: row.title,
    title_english: row.titleEnglish,
    title_japanese: row.titleJapanese,
    title_synonyms: [],
    type: row.type,
    chapters: row.chapters,
    volumes: row.volumes,
    status: row.status,
    publishing: row.publishing,
    published: {
      from: formatDateISOString(row.publishedFrom),
      to: formatDateISOString(row.publishedTo),
      prop: {
        from: buildDateProp(row.publishedFrom),
        to: buildDateProp(row.publishedTo),
      },
      string: formatPublishedString(row.publishedFrom, row.publishedTo),
    },
    score: row.score,
    scored: row.score,
    scored_by: row.scoredBy,
    rank: row.rank,
    popularity: row.popularity,
    members: row.members,
    favorites: row.favorites,
    synopsis: row.synopsis,
    background: row.background,
    authors: serializeRelationList(row.authors, "author"),
    serializations: serializeRelationList(row.serializations, "serialization"),
    genres: serializeRelationList(row.genres, "genre"),
    explicit_genres: [],
    themes: serializeRelationList(row.themes, "genre"),
    demographics: serializeRelationList(row.demographics, "genre"),
  };
}

export function serializeMangaListResponse(
  rows: MangaRow[],
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
    data: rows.map(serializeManga),
  };
}

export function serializeSingleMangaResponse(row: MangaRow) {
  return {
    data: serializeManga(row),
  };
}

type ListMangaByGenreOptions = {
  genreName: string;
  page?: number;
  limit?: number;
  sort?: "popular" | "newest" | "popular_newest";
};

export async function listMangaByGenre({
  genreName,
  page = 1,
  limit = 50,
  sort = "popular",
}: ListMangaByGenreOptions) {
  await ensureDatabase();

  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 50;
  const offset = (safePage - 1) * safeLimit;
  const genreFilter = sql<boolean>`${manga.genres} ? ${genreName}`;

  const orderBy =
    sort === "newest"
      ? ([
          sql`${manga.publishedFrom} desc nulls last`,
          desc(manga.createdAt),
          desc(manga.members),
          asc(manga.title),
        ] as const)
      : sort === "popular_newest"
        ? ([
            sql`${manga.popularity} asc nulls last`,
            sql`${manga.publishedFrom} desc nulls last`,
            desc(manga.members),
            asc(manga.title),
          ] as const)
        : ([
            sql`${manga.popularity} asc nulls last`,
            desc(manga.members),
            asc(manga.title),
          ] as const);

  const [items, [{ total }]] = await Promise.all([
    db
      .select()
      .from(manga)
      .where(genreFilter)
      .orderBy(...orderBy)
      .limit(safeLimit)
      .offset(offset),
    db.select({ total: count() }).from(manga).where(genreFilter),
  ]);

  return {
    items,
    limit: safeLimit,
    page: safePage,
    total,
    totalPages: Math.max(1, Math.ceil(total / safeLimit)),
  };
}

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

export async function searchManga({ query, limit = 24 }: SearchMangaOptions) {
  await ensureDatabase();

  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 24;
  const pattern = `%${trimmedQuery}%`;

  return db
    .select()
    .from(manga)
    .where(
      or(
        ilike(manga.title, pattern),
        ilike(manga.titleEnglish, pattern),
        ilike(manga.titleJapanese, pattern)
      )
    )
    .orderBy(asc(manga.rank), desc(manga.members))
    .limit(safeLimit);
}

export type MangaAdminWrite = {
  malId: number;
  title: string;
  titleJapanese?: string | null;
  titleEnglish?: string | null;
  imageUrl?: string | null;
  synopsis?: string | null;
  background?: string | null;
  score?: number | null;
  scoredBy?: number | null;
  rank?: number | null;
  popularity?: number | null;
  chapters?: number | null;
  volumes?: number | null;
  status?: string | null;
  publishing?: boolean | null;
  genres?: string[] | null;
  themes?: string[] | null;
  demographics?: string[] | null;
  authors?: string[] | null;
  serializations?: string[] | null;
  publishedFrom?: Date | null;
  publishedTo?: Date | null;
  type?: string | null;
  members?: number | null;
  favorites?: number | null;
};

export type MangaAdminPatch = Partial<Omit<MangaAdminWrite, "malId">>;

export async function adminCreateManga(payload: MangaAdminWrite) {
  await ensureDatabase();

  const existing = await getMangaByMalId(payload.malId);
  if (existing) {
    return { ok: false as const, error: "duplicate_mal_id" };
  }

  await db.insert(manga).values({
    malId: payload.malId,
    title: payload.title,
    titleJapanese: payload.titleJapanese ?? null,
    titleEnglish: payload.titleEnglish ?? null,
    imageUrl: payload.imageUrl ?? null,
    synopsis: payload.synopsis ?? null,
    background: payload.background ?? null,
    score: payload.score ?? null,
    scoredBy: payload.scoredBy ?? null,
    rank: payload.rank ?? null,
    popularity: payload.popularity ?? null,
    chapters: payload.chapters ?? null,
    volumes: payload.volumes ?? null,
    status: payload.status ?? null,
    publishing: payload.publishing ?? null,
    genres: payload.genres ?? null,
    themes: payload.themes ?? null,
    demographics: payload.demographics ?? null,
    authors: payload.authors ?? null,
    serializations: payload.serializations ?? null,
    publishedFrom: payload.publishedFrom ?? null,
    publishedTo: payload.publishedTo ?? null,
    type: payload.type ?? null,
    members: payload.members ?? null,
    favorites: payload.favorites ?? null,
    updatedAt: new Date(),
  });

  const row = await getMangaByMalId(payload.malId);
  return { ok: true as const, row };
}

export async function adminUpdateMangaByMalId(malId: number, patch: MangaAdminPatch) {
  await ensureDatabase();

  const existing = await getMangaByMalId(malId);
  if (!existing) {
    return { ok: false as const, error: "not_found" };
  }

  const updates: Partial<MangaRow> = { updatedAt: new Date() };

  if (patch.title !== undefined) updates.title = patch.title;
  if (patch.titleJapanese !== undefined) updates.titleJapanese = patch.titleJapanese;
  if (patch.titleEnglish !== undefined) updates.titleEnglish = patch.titleEnglish;
  if (patch.imageUrl !== undefined) updates.imageUrl = patch.imageUrl;
  if (patch.synopsis !== undefined) updates.synopsis = patch.synopsis;
  if (patch.background !== undefined) updates.background = patch.background;
  if (patch.score !== undefined) updates.score = patch.score;
  if (patch.scoredBy !== undefined) updates.scoredBy = patch.scoredBy;
  if (patch.rank !== undefined) updates.rank = patch.rank;
  if (patch.popularity !== undefined) updates.popularity = patch.popularity;
  if (patch.chapters !== undefined) updates.chapters = patch.chapters;
  if (patch.volumes !== undefined) updates.volumes = patch.volumes;
  if (patch.status !== undefined) updates.status = patch.status;
  if (patch.publishing !== undefined) updates.publishing = patch.publishing;
  if (patch.genres !== undefined) updates.genres = patch.genres;
  if (patch.themes !== undefined) updates.themes = patch.themes;
  if (patch.demographics !== undefined) updates.demographics = patch.demographics;
  if (patch.authors !== undefined) updates.authors = patch.authors;
  if (patch.serializations !== undefined) updates.serializations = patch.serializations;
  if (patch.publishedFrom !== undefined) updates.publishedFrom = patch.publishedFrom;
  if (patch.publishedTo !== undefined) updates.publishedTo = patch.publishedTo;
  if (patch.type !== undefined) updates.type = patch.type;
  if (patch.members !== undefined) updates.members = patch.members;
  if (patch.favorites !== undefined) updates.favorites = patch.favorites;

  const touchedFields = Object.keys(updates).filter((key) => key !== "updatedAt");
  if (touchedFields.length === 0) {
    return { ok: true as const, row: existing };
  }

  await db.update(manga).set(updates).where(eq(manga.malId, malId));

  const row = await getMangaByMalId(malId);
  return { ok: true as const, row };
}
