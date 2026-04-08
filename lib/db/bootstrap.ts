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

export async function ensureDatabase() {
  if (!databaseReady) {
    databaseReady = createAnimeTable();
  }

  await databaseReady;
}

export async function ensureMangaDatabase() {
  if (!mangaDatabaseReady) {
    mangaDatabaseReady = createMangaTable();
  }

  await mangaDatabaseReady;
}
