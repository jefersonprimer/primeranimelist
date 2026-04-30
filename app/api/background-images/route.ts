import { db } from "@/lib/db";
import { ensureDatabase } from "@/lib/db/bootstrap";
import { anime } from "@/lib/db/schema";
import { desc, isNotNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await ensureDatabase();

    const rows = await db
      .select({
        id: anime.id,
        anime_name: anime.title,
        image_url: anime.imageBannerDesktop,
      })
      .from(anime)
      .where(isNotNull(anime.imageBannerDesktop))
      .orderBy(desc(anime.updatedAt))
      .limit(60);

    return NextResponse.json(
      rows.filter((row) => Boolean(row.image_url)),
    );
  } catch (error: any) {
    console.error("Background images GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
