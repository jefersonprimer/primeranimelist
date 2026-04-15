import { getMangaByMalId, serializeSingleMangaResponse } from "@/lib/services/manga.service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ mal_id: string }> }
) {
  const { mal_id } = await params;
  const malId = Number.parseInt(mal_id, 10);

  if (!Number.isFinite(malId) || malId <= 0) {
    return Response.json({ error: "Invalid manga ID" }, { status: 400 });
  }

  const manga = await getMangaByMalId(malId);

  if (!manga) {
    return Response.json({ error: "Manga not found" }, { status: 404 });
  }

  return Response.json(serializeSingleMangaResponse(manga));
}
