import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { serializePost } from "@/lib/services/post.service";
import { ensureDatabase } from "@/lib/db/bootstrap";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  await ensureDatabase();
  const session = await getSession();
  const admin = isAdminEmail(session?.user.email);

  const where = admin ? eq(posts.slug, slug) : and(eq(posts.slug, slug), eq(posts.isPublished, true));
  const result = await db.select().from(posts).where(where).limit(1);
  const post = result[0];

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ data: serializePost(post) });
}
