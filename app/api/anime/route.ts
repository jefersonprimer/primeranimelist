import { db } from "@/lib/db";
import { ensureDatabase } from "@/lib/db/bootstrap";
import { anime } from "@/lib/db/schema";

export async function GET() {
  await ensureDatabase();
  const data = await db.select().from(anime).limit(20);
  return Response.json(data);
}
