import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ensureDatabase } from "@/lib/db/bootstrap";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateProfileSchema = z.object({
  display_name: z.string().min(1).max(60),
  username: z.string().max(60).optional(),
  profile_image_url: z.string().url().or(z.literal("")).optional(),
  background_image_url: z.string().url().or(z.literal("")).optional(),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureDatabase();

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        display_name: users.fullName,
        profile_image_url: users.profileImageUrl,
        background_image_url: users.backgroundImageUrl,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    return NextResponse.json({ profile: user ?? null });
  } catch (error: any) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = updateProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message ?? "Invalid request payload" },
        { status: 400 },
      );
    }

    const payload = result.data;
    await ensureDatabase();

    const [updated] = await db
      .update(users)
      .set({
        fullName: payload.display_name,
        username: payload.username?.trim() || null,
        profileImageUrl: payload.profile_image_url?.trim() || null,
        backgroundImageUrl: payload.background_image_url?.trim() || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id))
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        display_name: users.fullName,
        profile_image_url: users.profileImageUrl,
        background_image_url: users.backgroundImageUrl,
      });

    return NextResponse.json({ profile: updated });
  } catch (error: any) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
