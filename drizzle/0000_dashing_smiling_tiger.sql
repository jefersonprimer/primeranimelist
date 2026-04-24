CREATE TABLE "anime" (
	"id" serial PRIMARY KEY NOT NULL,
	"mal_id" integer NOT NULL,
	"title" text NOT NULL,
	"title_japanese" text,
	"title_english" text,
	"image_url" text,
	"image_banner_desktop" text,
	"image_banner_mobile" text,
	"image_logo" text,
	"image_thumbnail" text,
	"image_card_compact" text,
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
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "anime_mal_id_unique" UNIQUE("mal_id")
);
--> statement-breakpoint
CREATE TABLE "anime_watchlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"anime_id" integer NOT NULL,
	"status" text DEFAULT 'Plan to Watch' NOT NULL,
	"episodes_watched" integer DEFAULT 0 NOT NULL,
	"score" real,
	"start_date" timestamp,
	"finish_date" timestamp,
	"is_favorite" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "manga" (
	"id" serial PRIMARY KEY NOT NULL,
	"mal_id" integer NOT NULL,
	"title" text NOT NULL,
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
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "manga_mal_id_unique" UNIQUE("mal_id")
);
--> statement-breakpoint
CREATE TABLE "manga_watchlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"manga_id" integer NOT NULL,
	"status" text DEFAULT 'Plan to Read' NOT NULL,
	"volumes_read" integer DEFAULT 0 NOT NULL,
	"chapters_read" integer DEFAULT 0 NOT NULL,
	"score" real,
	"start_date" timestamp,
	"finish_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"content" text,
	"cover_image" text,
	"tags" text[],
	"category" text DEFAULT 'general' NOT NULL,
	"author" jsonb,
	"read_time" integer,
	"excerpt" text,
	"cover_image_url" text,
	"content_markdown" text NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"created_by_user_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"session_token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"full_name" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "anime_watchlist" ADD CONSTRAINT "anime_watchlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anime_watchlist" ADD CONSTRAINT "anime_watchlist_anime_id_anime_id_fk" FOREIGN KEY ("anime_id") REFERENCES "public"."anime"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manga_watchlist" ADD CONSTRAINT "manga_watchlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manga_watchlist" ADD CONSTRAINT "manga_watchlist_manga_id_manga_id_fk" FOREIGN KEY ("manga_id") REFERENCES "public"."manga"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "anime_watchlist_user_anime_idx" ON "anime_watchlist" USING btree ("user_id","anime_id");--> statement-breakpoint
CREATE INDEX "anime_watchlist_user_id_idx" ON "anime_watchlist" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "manga_watchlist_user_manga_idx" ON "manga_watchlist" USING btree ("user_id","manga_id");--> statement-breakpoint
CREATE INDEX "manga_watchlist_user_id_idx" ON "manga_watchlist" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "posts_category_idx" ON "posts" USING btree ("category");--> statement-breakpoint
CREATE INDEX "posts_is_published_idx" ON "posts" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");