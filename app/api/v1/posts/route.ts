import { NextResponse } from "next/server";
import { parseBoolean, parseFiniteInt, parseString, parseStringArrayField, requireAdminApiUser } from "@/lib/admin-api";
import {
  adminCreatePost,
  listAllPostsForAdmin,
  listPublishedPosts,
  serializePost,
  type PostWritePayload,
} from "@/lib/services/post.service";

function slugify(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, "-");
}

function parseAuthorField(value: unknown): Record<string, unknown> | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }
  return null;
}

function readPostPayload(body: Record<string, unknown>): PostWritePayload | { error: string } {
  const title = parseString(body.title);
  const category = parseString(body.category);
  const contentMarkdown = parseString(body.content_markdown ?? body.contentMarkdown);
  const requestedSlug = parseString(body.slug);

  if (!title) {
    return { error: "Title is required" };
  }
  if (!contentMarkdown) {
    return { error: "Content is required" };
  }
  if (!category) {
    return { error: "Category is required" };
  }

  const slug = requestedSlug ?? slugify(title);
  if (!slug || slug.length < 3) {
    return { error: "Slug must have at least 3 chars" };
  }

  return {
    title,
    slug,
    category,
    summary: parseString(body.summary),
    content: parseString(body.content),
    coverImage: parseString(body.cover_image ?? body.coverImage),
    tags: parseStringArrayField(body.tags),
    author: parseAuthorField(body.author),
    readTime: parseFiniteInt(body.read_time ?? body.readTime),
    excerpt: parseString(body.excerpt),
    coverImageUrl: parseString(body.cover_image_url ?? body.coverImageUrl),
    contentMarkdown,
    isPublished: parseBoolean(body.is_published ?? body.isPublished) ?? false,
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const adminMode = url.searchParams.get("admin") === "1";
  const page = parseFiniteInt(url.searchParams.get("page"));
  const limit = parseFiniteInt(url.searchParams.get("limit"));

  if (adminMode) {
    const gate = await requireAdminApiUser();
    if (!gate.ok) {
      return gate.response;
    }

    const result = await listAllPostsForAdmin({ page: page ?? undefined, limit: limit ?? undefined });
    return NextResponse.json({
      data: result.items.map(serializePost),
      pagination: {
        current_page: result.page,
        per_page: result.limit,
        total: result.total,
      },
    });
  }

  const result = await listPublishedPosts({ page: page ?? undefined, limit: limit ?? undefined });
  return NextResponse.json({
    data: result.items.map(serializePost),
    pagination: {
      current_page: result.page,
      per_page: result.limit,
      total: result.total,
      has_next_page: result.page * result.limit < result.total,
    },
  });
}

export async function POST(request: Request) {
  const gate = await requireAdminApiUser();
  if (!gate.ok) {
    return gate.response;
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = readPostPayload(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const created = await adminCreatePost({
    ...parsed,
    createdByUserId: gate.session.user.id,
  });

  if (!created.ok) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }
  if (!created.row) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }

  return NextResponse.json({ data: serializePost(created.row) }, { status: 201 });
}
