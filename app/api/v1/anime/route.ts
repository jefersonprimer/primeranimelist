import {
  isValidAnimeSeason,
  listAnime,
  listAnimeBySeasonYear,
  parseTopAnimeFilter,
  serializeAnimeListResponse,
} from "@/lib/services/anime.service";

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
  const filterRaw = url.searchParams.get("filter");

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

    const result = await listAnimeBySeasonYear({ season, year: year as number, limit: limit ?? 200 });
    return Response.json(
      serializeAnimeListResponse(result.items, {
        page: 1,
        limit: result.limit,
        total: result.items.length,
      })
    );
  }

  const result = await listAnime({
    page,
    limit,
    filter: filterRaw ?? undefined,
  });

  return Response.json({
    ...serializeAnimeListResponse(result.items, {
      page: result.page,
      limit: result.limit,
      total: result.total,
    }),
    filter: parseTopAnimeFilter(filterRaw ?? undefined),
  });
}
