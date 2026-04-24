import { db } from "@/lib/db";
import { ensureDatabase } from "@/lib/db/bootstrap";
import { posts } from "@/lib/db/schema";
import { and, count, desc, eq } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

type PostRow = InferSelectModel<typeof posts>;

export type PostWritePayload = {
  title: string;
  slug: string;
  category: string;
  summary?: string | null;
  content?: string | null;
  coverImage?: string | null;
  tags?: string[] | null;
  author?: Record<string, unknown> | null;
  readTime?: number | null;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  contentMarkdown: string;
  isPublished?: boolean;
  createdByUserId?: number | null;
};

export type PostPatchPayload = Partial<Omit<PostWritePayload, "createdByUserId">>;

function formatIso(date: Date | null) {
  return date ? date.toISOString() : null;
}

export function serializePost(row: PostRow) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    summary: row.summary,
    content: row.content,
    cover_image: row.coverImage,
    tags: row.tags,
    author: row.author,
    read_time: row.readTime,
    excerpt: row.excerpt,
    cover_image_url: row.coverImageUrl,
    content_markdown: row.contentMarkdown,
    is_published: row.isPublished,
    published_at: formatIso(row.publishedAt),
    created_at: formatIso(row.createdAt),
    updated_at: formatIso(row.updatedAt),
  };
}

export async function listPublishedPosts({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
  await ensureDatabase();
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10;
  const offset = (safePage - 1) * safeLimit;

  const where = eq(posts.isPublished, true);
  const [items, [{ total }]] = await Promise.all([
    db.select().from(posts).where(where).orderBy(desc(posts.publishedAt), desc(posts.createdAt)).limit(safeLimit).offset(offset),
    db.select({ total: count() }).from(posts).where(where),
  ]);

  return {
    items,
    page: safePage,
    limit: safeLimit,
    total,
  };
}

export async function listAllPostsForAdmin({ page = 1, limit = 20 }: { page?: number; limit?: number } = {}) {
  await ensureDatabase();
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 20;
  const offset = (safePage - 1) * safeLimit;

  const [items, [{ total }]] = await Promise.all([
    db.select().from(posts).orderBy(desc(posts.createdAt)).limit(safeLimit).offset(offset),
    db.select({ total: count() }).from(posts),
  ]);

  return {
    items,
    page: safePage,
    limit: safeLimit,
    total,
  };
}

export async function getPublishedPostBySlug(slug: string) {
  await ensureDatabase();
  const result = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.isPublished, true)))
    .limit(1);
  return result[0] ?? null;
}

export async function getPostById(id: number) {
  await ensureDatabase();
  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return result[0] ?? null;
}

export async function adminCreatePost(payload: PostWritePayload) {
  await ensureDatabase();
  const existing = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, payload.slug)).limit(1);
  if (existing.length > 0) {
    return { ok: false as const, error: "duplicate_slug" };
  }

  const now = new Date();
  await db.insert(posts).values({
    slug: payload.slug,
    title: payload.title,
    category: payload.category,
    summary: payload.summary ?? null,
    content: payload.content ?? null,
    coverImage: payload.coverImage ?? null,
    tags: payload.tags ?? null,
    author: payload.author ?? null,
    readTime: payload.readTime ?? null,
    excerpt: payload.excerpt ?? null,
    coverImageUrl: payload.coverImageUrl ?? null,
    contentMarkdown: payload.contentMarkdown,
    isPublished: payload.isPublished ?? false,
    publishedAt: payload.isPublished ? now : null,
    createdByUserId: payload.createdByUserId ?? null,
    updatedAt: now,
  });

  const row = await db.select().from(posts).where(eq(posts.slug, payload.slug)).limit(1);
  return { ok: true as const, row: row[0] ?? null };
}

export async function adminUpdatePostById(id: number, patch: PostPatchPayload) {
  await ensureDatabase();
  const existing = await getPostById(id);
  if (!existing) {
    return { ok: false as const, error: "not_found" };
  }

  if (patch.slug && patch.slug !== existing.slug) {
    const slugTaken = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, patch.slug)).limit(1);
    if (slugTaken.length > 0) {
      return { ok: false as const, error: "duplicate_slug" };
    }
  }

  const updates: Partial<PostRow> = {
    updatedAt: new Date(),
  };

  if (patch.title !== undefined) updates.title = patch.title;
  if (patch.slug !== undefined) updates.slug = patch.slug;
  if (patch.category !== undefined) updates.category = patch.category;
  if (patch.summary !== undefined) updates.summary = patch.summary;
  if (patch.content !== undefined) updates.content = patch.content;
  if (patch.coverImage !== undefined) updates.coverImage = patch.coverImage;
  if (patch.tags !== undefined) updates.tags = patch.tags;
  if (patch.author !== undefined) updates.author = patch.author;
  if (patch.readTime !== undefined) updates.readTime = patch.readTime;
  if (patch.excerpt !== undefined) updates.excerpt = patch.excerpt;
  if (patch.coverImageUrl !== undefined) updates.coverImageUrl = patch.coverImageUrl;
  if (patch.contentMarkdown !== undefined) updates.contentMarkdown = patch.contentMarkdown;
  if (patch.isPublished !== undefined) {
    updates.isPublished = patch.isPublished;
    updates.publishedAt = patch.isPublished ? existing.publishedAt ?? new Date() : null;
  }

  await db.update(posts).set(updates).where(eq(posts.id, id));
  const row = await getPostById(id);
  return { ok: true as const, row };
}
