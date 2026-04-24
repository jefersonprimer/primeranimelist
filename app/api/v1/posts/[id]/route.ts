import { NextResponse } from "next/server";
import { parseBoolean, parseFiniteInt, parseString, parseStringArrayField, requireAdminApiUser } from "@/lib/admin-api";
import { adminUpdatePostById, getPostById, serializePost, type PostPatchPayload } from "@/lib/services/post.service";

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

function buildPostPatch(body: Record<string, unknown>): PostPatchPayload | { error: string } {
  const patch: PostPatchPayload = {};

  if ("title" in body) {
    const title = parseString(body.title);
    if (!title) return { error: "Title cannot be empty" };
    patch.title = title;

    const incomingSlug = parseString(body.slug);
    if (!incomingSlug) {
      patch.slug = slugify(title);
    }
  }

  if ("slug" in body) {
    const slug = parseString(body.slug);
    if (!slug) return { error: "Slug cannot be empty" };
    patch.slug = slug;
  }
  if ("category" in body) {
    const category = parseString(body.category);
    if (!category) return { error: "Category cannot be empty" };
    patch.category = category;
  }
  if ("summary" in body && !("excerpt" in body)) patch.excerpt = parseString(body.summary);
  if ("content" in body) patch.content = parseString(body.content);
  if (("cover_image" in body || "coverImage" in body) && !("cover_image_url" in body || "coverImageUrl" in body)) {
    patch.coverImageUrl = parseString(body.cover_image ?? body.coverImage);
  }
  if ("tags" in body) {
    patch.tags = parseStringArrayField(body.tags);
  }
  if ("author" in body) {
    patch.author = parseAuthorField(body.author);
  }
  if ("read_time" in body || "readTime" in body) {
    patch.readTime = parseFiniteInt(body.read_time ?? body.readTime);
  }
  if ("excerpt" in body) patch.excerpt = parseString(body.excerpt);
  if ("cover_image_url" in body || "coverImageUrl" in body) {
    patch.coverImageUrl = parseString(body.cover_image_url ?? body.coverImageUrl);
  }
  if ("content_markdown" in body || "contentMarkdown" in body) {
    const content = parseString(body.content_markdown ?? body.contentMarkdown);
    if (!content) return { error: "Content cannot be empty" };
    patch.contentMarkdown = content;
  }
  if ("is_published" in body || "isPublished" in body) {
    patch.isPublished = parseBoolean(body.is_published ?? body.isPublished) ?? false;
  }

  return patch;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireAdminApiUser();
  if (!gate.ok) {
    return gate.response;
  }

  const { id } = await params;
  const postId = parseFiniteInt(id);
  if (!postId || postId <= 0) {
    return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
  }

  const post = await getPostById(postId);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ data: serializePost(post) });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireAdminApiUser();
  if (!gate.ok) {
    return gate.response;
  }

  const { id } = await params;
  const postId = parseFiniteInt(id);
  if (!postId || postId <= 0) {
    return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const patch = buildPostPatch(body);
  if ("error" in patch) {
    return NextResponse.json({ error: patch.error }, { status: 400 });
  }

  const updated = await adminUpdatePostById(postId, patch);
  if (!updated.ok) {
    if (updated.error === "duplicate_slug") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  if (!updated.row) {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }

  return NextResponse.json({ data: serializePost(updated.row) });
}
