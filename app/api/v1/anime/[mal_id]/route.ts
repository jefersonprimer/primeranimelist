import { getAnimeByMalId } from "@/lib/services/anime.service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ mal_id: string }> }
) {
  const { mal_id } = await params;
  const malId = Number.parseInt(mal_id, 10);

  if (!Number.isFinite(malId) || malId <= 0) {
    return Response.json({ error: "Invalid anime ID" }, { status: 400 });
  }

  const anime = await getAnimeByMalId(malId);

  if (!anime) {
    return Response.json({ error: "Anime not found" }, { status: 404 });
  }

  return Response.json(anime);
}