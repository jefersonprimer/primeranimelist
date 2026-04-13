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
    await db.execute(sql`alter table "anime" add column if not exists "title_english" text`);
    await db.execute(sql`alter table "anime" add column if not exists "producers" jsonb`);
    await db.execute(sql`alter table "anime" add column if not exists "licensors" jsonb`);
    await db.execute(sql`alter table "anime" add column if not exists "themes" jsonb`);
    await db.execute(sql`alter table "anime" add column if not exists "demographics" jsonb`);
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
      "created_at" timestamp default now(),
      "updated_at" timestamp default now()
    )
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

export async function ensureDatabase() {
  if (!databaseReady) {
    databaseReady = (async () => {
      await createAnimeTable();
      await createAuthTables();
    })();
  }

  await databaseReady;
}

export async function ensureMangaDatabase() {
  if (!mangaDatabaseReady) {
    mangaDatabaseReady = createMangaTable();
  }

  await mangaDatabaseReady;
}
