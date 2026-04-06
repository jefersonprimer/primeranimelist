import { db } from "@/lib/db";
import { ensureDatabase } from "@/lib/db/bootstrap";
import { anime } from "@/lib/db/schema";

export async function listAnime() {
  await ensureDatabase();
  return db.select().from(anime).limit(20);
}
