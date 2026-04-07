import { isValidAnimeSeason, listAnime, listAnimeBySeasonYear } from "@/lib/services/anime.service";

function getCurrentSeason(date = new Date()) {
  const month = date.getMonth(); // 0-11
  if (month <= 2) return "winter";
  if (month <= 5) return "spring";
  if (month <= 8) return "summer";
  return "fall";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const seasonRaw = url.searchParams.get("season");
  const yearRaw = url.searchParams.get("year");
  const pageRaw = url.searchParams.get("page");
  const limitRaw = url.searchParams.get("limit");

  const year = yearRaw ? Number.parseInt(yearRaw, 10) : undefined;
  const page = pageRaw ? Number.parseInt(pageRaw, 10) : undefined;
  const limit = limitRaw ? Number.parseInt(limitRaw, 10) : undefined;

  if (seasonRaw || yearRaw) {
    const season = (seasonRaw ?? getCurrentSeason()).toLowerCase();

    if (!isValidAnimeSeason(season)) {
      return Response.json({ error: "Invalid season. Use winter, spring, summer, or fall." }, { status: 400 });
    }

    if (!Number.isFinite(year) || (year as number) <= 0) {
      return Response.json({ error: "Invalid year" }, { status: 400 });
    }

    const data = await listAnimeBySeasonYear({ season, year: year as number, limit: limit ?? 200 });
    return Response.json(data);
  }

  const data = await listAnime({ page, limit });
  return Response.json(data);
}
