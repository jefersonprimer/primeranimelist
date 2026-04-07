import { listAnime } from "@/lib/services/anime.service";

export async function GET() {
  const data = await listAnime();
  return Response.json(data);
}
