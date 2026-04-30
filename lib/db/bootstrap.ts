import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

let databaseReady: Promise<void> | null = null;
let mangaDatabaseReady: Promise<void> | null = null;

async function createAnimeTable() {
  await db.execute(sql`
    create table if not exists "anime" (
      "id" serial primary key,
      "mal_id" integer not null unique,
      "title" text not null,
      "title_japanese" text,
      "title_english" text,
      "image_url" text,
      "synopsis" text,
      "score" real,
      "scored_by" integer,
      "rank" integer,
      "popularity" integer,
      "episodes" integer,
      "status" text,
      "rating" text,
      "source" text,
      "season" text,
      "year" integer,
      "genres" jsonb,
      "studios" jsonb,
      "producers" jsonb,
      "licensors" jsonb,
      "themes" jsonb,
      "demographics" jsonb,
      "aired_from" timestamp,
      "aired_to" timestamp,
      "is_airing" boolean,
      "trailer_url" text,
      "type" text,
      "members" integer,
      "favorites" integer,
      "duration" text,
      "created_at" timestamp default now(),
      "updated_at" timestamp default now()
    )
  `);

  // Migration: Add missing columns if they don't exist
  try {
    await db.execute(
      sql`alter table "anime" add column if not exists "title_english" text`,
    );
    await db.execute(
      sql`alter table "anime" add column if not exists "producers" jsonb`,
    );
    await db.execute(
      sql`alter table "anime" add column if not exists "licensors" jsonb`,
    );
    await db.execute(
      sql`alter table "anime" add column if not exists "themes" jsonb`,
    );
    await db.execute(
      sql`alter table "anime" add column if not exists "demographics" jsonb`,
    );
    await db.execute(
      sql`alter table "anime" add column if not exists "image_banner_desktop" text`,
    );
    await db.execute(
      sql`alter table "anime" add column if not exists "image_banner_mobile" text`,
    );
    await db.execute(
      sql`alter table "anime" add column if not exists "image_logo" text`,
    );
    await db.execute(
      sql`alter table "anime" add column if not exists "image_thumbnail" text`,
    );
    await db.execute(
      sql`alter table "anime" add column if not exists "image_card_compact" text`,
    );
  } catch (err) {
    console.error("Migration error:", err);
  }
}

async function createMangaTable() {
  await db.execute(sql`
    create table if not exists "manga" (
      "id" serial primary key,
      "mal_id" integer not null unique,
      "title" text not null,
      "title_japanese" text,
      "title_english" text,
      "image_url" text,
      "synopsis" text,
      "background" text,
      "score" real,
      "scored_by" integer,
      "rank" integer,
      "popularity" integer,
      "chapters" integer,
      "volumes" integer,
      "status" text,
      "publishing" boolean,
      "genres" jsonb,
      "themes" jsonb,
      "demographics" jsonb,
      "authors" jsonb,
      "serializations" jsonb,
      "published_from" timestamp,
      "published_to" timestamp,
      "type" text,
      "members" integer,
      "favorites" integer,
      "created_at" timestamp default now(),
      "updated_at" timestamp default now()
    )
  `);
}

async function createAuthTables() {
  await db.execute(sql`
    create table if not exists "users" (
      "id" serial primary key,
      "email" text not null unique,
      "password_hash" text not null,
      "full_name" text,
      "username" text,
      "profile_image_url" text,
      "background_image_url" text,
      "created_at" timestamp default now(),
      "updated_at" timestamp default now()
    )
  `);

  await db.execute(sql`
    alter table "users"
    add column if not exists "username" text
  `);

  await db.execute(sql`
    alter table "users"
    add column if not exists "profile_image_url" text
  `);

  await db.execute(sql`
    alter table "users"
    add column if not exists "background_image_url" text
  `);

  await db.execute(sql`
    create table if not exists "sessions" (
      "id" serial primary key,
      "user_id" integer not null references "users"("id") on delete cascade,
      "session_token" text not null unique,
      "expires_at" timestamp not null,
      "created_at" timestamp default now()
    )
  `);
}

async function createWatchlistTable() {
  await db.execute(sql`
    create table if not exists "anime_watchlist" (
      "id" serial primary key,
      "user_id" integer not null references "users"("id") on delete cascade,
      "anime_id" integer not null references "anime"("id") on delete cascade,
      "status" text not null default 'Plan to Watch',
      "episodes_watched" integer not null default 0,
      "score" real,
      "start_date" timestamp,
      "finish_date" timestamp,
      "is_favorite" boolean not null default false,
      "created_at" timestamp default now(),
      "updated_at" timestamp default now(),
      unique ("user_id", "anime_id")
    )
  `);

  await db.execute(sql`
    create index if not exists "anime_watchlist_user_id_idx"
    on "anime_watchlist" ("user_id")
  `);
}

async function createMangaWatchlistTable() {
  await db.execute(sql`
    create table if not exists "manga_watchlist" (
      "id" serial primary key,
      "user_id" integer not null references "users"("id") on delete cascade,
      "manga_id" integer not null references "manga"("id") on delete cascade,
      "status" text not null default 'Plan to Read',
      "volumes_read" integer not null default 0,
      "chapters_read" integer not null default 0,
      "score" real,
      "start_date" timestamp,
      "finish_date" timestamp,
      "created_at" timestamp default now(),
      "updated_at" timestamp default now(),
      unique ("user_id", "manga_id")
    )
  `);

  await db.execute(sql`
    create index if not exists "manga_watchlist_user_id_idx"
    on "manga_watchlist" ("user_id")
  `);
}

async function createPostsTable() {
  await db.execute(sql`
    create table if not exists "posts" (
      "id" serial primary key,
      "slug" text not null unique,
      "title" text not null,
      "summary" text ,
      "cover_image" text,
      "tags" text[],
      "category" text not null default 'general',
      "author" jsonb,
      "read_time" integer,
      "excerpt" text,
      "cover_image_url" text,
      "content_markdown" text not null,
      "is_published" boolean not null default false,
      "published_at" timestamp,
      "created_by_user_id" integer references "users"("id") on delete set null,
      "created_at" timestamp default now(),
      "updated_at" timestamp default now()
    )
  `);

  await db.execute(sql`
    create index if not exists "posts_slug_idx"
    on "posts" ("slug")
  `);

  await db.execute(sql`
    alter table "posts"
    add column if not exists "category" text not null default 'general'
  `);

  await db.execute(sql`
    alter table "posts"
    add column if not exists "summary" text
  `);

  await db.execute(sql`
    alter table "posts"
    add column if not exists "cover_image" text
  `);

  await db.execute(sql`
    alter table "posts"
    add column if not exists "tags" text[]
  `);

  await db.execute(sql`
    alter table "posts"
    add column if not exists "author" jsonb
  `);

  await db.execute(sql`
    alter table "posts"
    add column if not exists "read_time" integer
  `);

  await db.execute(sql`
    alter table "posts"
    add column if not exists "excerpt" text
  `);

  await db.execute(sql`
    alter table "posts"
    add column if not exists "cover_image_url" text
  `);

  await db.execute(sql`
    alter table "posts"
    add column if not exists "content_markdown" text not null default ''
  `);

  await db.execute(sql`
    alter table "posts"
    add column if not exists "is_published" boolean not null default false
  `);

  await db.execute(sql`
    alter table "posts"
    add column if not exists "published_at" timestamp
  `);

  await db.execute(sql`
    alter table "posts"
    add column if not exists "created_by_user_id" integer references "users"("id") on delete set null
  `);

  await db.execute(sql`
    update "posts"
    set "excerpt" = coalesce("excerpt", "summary")
    where "excerpt" is null and "summary" is not null
  `);

  await db.execute(sql`
    update "posts"
    set "cover_image_url" = coalesce("cover_image_url", "cover_image")
    where "cover_image_url" is null and "cover_image" is not null
  `);

  await db.execute(sql`
    alter table "posts"
    drop column if exists "content"
  `);
}

export async function ensureDatabase() {
  if (!databaseReady) {
    databaseReady = (async () => {
      await createAnimeTable();
      await createMangaTable();
      await createAuthTables();
      await createWatchlistTable();
      await createMangaWatchlistTable();
      await createPostsTable();
    })();
  }

  await databaseReady;
}

export async function ensureMangaDatabase() {
  if (!mangaDatabaseReady) {
    mangaDatabaseReady = (async () => {
      await createMangaTable();
      await createAuthTables();
      await createMangaWatchlistTable();
    })();
  }

  await mangaDatabaseReady;
}
