import { pgTable, serial, text, integer, real, jsonb, timestamp, boolean, uniqueIndex, index } from "drizzle-orm/pg-core";

export const WATCHLIST_STATUSES = [
  "Watching",
  "Completed",
  "On-Hold",
  "Dropped",
  "Plan to Watch",
] as const;

export type WatchlistStatus = (typeof WATCHLIST_STATUSES)[number];

export const MANGA_WATCHLIST_STATUSES = [
  "Reading",
  "Completed",
  "On-Hold",
  "Dropped",
  "Plan to Read",
] as const;

export type MangaWatchlistStatus = (typeof MANGA_WATCHLIST_STATUSES)[number];

export const anime = pgTable("anime", {
  id: serial("id").primaryKey(),
  malId: integer("mal_id").unique().notNull(),
  title: text("title").notNull(),
  titleJapanese: text("title_japanese"),
  titleEnglish: text("title_english"),
  imageUrl: text("image_url"),
  imageBannerDesktop: text("image_banner_desktop"),
  imageBannerMobile: text("image_banner_mobile"),
  imageLogo: text("image_logo"),
  imageThumbnail: text("image_thumbnail"),
  imageCardCompact: text("image_card_compact"),
  synopsis: text("synopsis"),
  score: real("score"),
  scoredBy: integer("scored_by"),
  rank: integer("rank"),
  popularity: integer("popularity"),
  episodes: integer("episodes"),
  status: text("status"),
  rating: text("rating"),
  source: text("source"),
  season: text("season"),
  year: integer("year"),
  genres: jsonb("genres").$type<string[] | null>(),
  studios: jsonb("studios").$type<string[] | null>(),
  producers: jsonb("producers").$type<string[] | null>(),
  licensors: jsonb("licensors").$type<string[] | null>(),
  themes: jsonb("themes").$type<string[] | null>(),
  demographics: jsonb("demographics").$type<string[] | null>(),
  airedFrom: timestamp("aired_from"),
  airedTo: timestamp("aired_to"),
  isAiring: boolean("is_airing"),
  trailerUrl: text("trailer_url"),
  type: text("type"),
  members: integer("members"),
  favorites: integer("favorites"),
  duration: text("duration"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const manga = pgTable("manga", {
  id: serial("id").primaryKey(),
  malId: integer("mal_id").unique().notNull(),
  title: text("title").notNull(),
  titleJapanese: text("title_japanese"),
  titleEnglish: text("title_english"),
  imageUrl: text("image_url"),
  synopsis: text("synopsis"),
  background: text("background"),
  score: real("score"),
  scoredBy: integer("scored_by"),
  rank: integer("rank"),
  popularity: integer("popularity"),
  chapters: integer("chapters"),
  volumes: integer("volumes"),
  status: text("status"),
  publishing: boolean("publishing"),
  genres: jsonb("genres").$type<string[] | null>(),
  themes: jsonb("themes").$type<string[] | null>(),
  demographics: jsonb("demographics").$type<string[] | null>(),
  authors: jsonb("authors").$type<string[] | null>(),
  serializations: jsonb("serializations").$type<string[] | null>(),
  publishedFrom: timestamp("published_from"),
  publishedTo: timestamp("published_to"),
  type: text("type"),
  members: integer("members"),
  favorites: integer("favorites"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  sessionToken: text("session_token").unique().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  userIdIdx: index("sessions_user_id_idx").on(table.userId),
}));

export const animeWatchlist = pgTable(
  "anime_watchlist",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    animeId: integer("anime_id").references(() => anime.id, { onDelete: "cascade" }).notNull(),
    status: text("status").$type<WatchlistStatus>().notNull().default("Plan to Watch"),
    episodesWatched: integer("episodes_watched").notNull().default(0),
    score: real("score"),
    startDate: timestamp("start_date"),
    finishDate: timestamp("finish_date"),
    isFavorite: boolean("is_favorite").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    userAnimeUnique: uniqueIndex("anime_watchlist_user_anime_idx").on(table.userId, table.animeId),
    userIdIdx: index("anime_watchlist_user_id_idx").on(table.userId),
  })
);

export const mangaWatchlist = pgTable(
  "manga_watchlist",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    mangaId: integer("manga_id").references(() => manga.id, { onDelete: "cascade" }).notNull(),
    status: text("status").$type<MangaWatchlistStatus>().notNull().default("Plan to Read"),
    volumesRead: integer("volumes_read").notNull().default(0),
    chaptersRead: integer("chapters_read").notNull().default(0),
    score: real("score"),
    startDate: timestamp("start_date"),
    finishDate: timestamp("finish_date"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    userMangaUnique: uniqueIndex("manga_watchlist_user_manga_idx").on(table.userId, table.mangaId),
    userIdIdx: index("manga_watchlist_user_id_idx").on(table.userId),
  })
);

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    summary: text("summary"),
    coverImage: text("cover_image"),
    tags: text("tags").array(),
    category: text("category").notNull().default("general"),
    author: jsonb("author").$type<Record<string, unknown> | null>(),
    readTime: integer("read_time"),
    excerpt: text("excerpt"),
    coverImageUrl: text("cover_image_url"),
    contentMarkdown: text("content_markdown").notNull(),
    isPublished: boolean("is_published").notNull().default(false),
    publishedAt: timestamp("published_at"),
    createdByUserId: integer("created_by_user_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    slugUnique: uniqueIndex("posts_slug_idx").on(table.slug),
    categoryIdx: index("posts_category_idx").on(table.category),
    isPublishedIdx: index("posts_is_published_idx").on(table.isPublished),
  })
);
