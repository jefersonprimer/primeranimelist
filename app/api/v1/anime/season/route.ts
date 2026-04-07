import { isValidAnimeSeason, listAnimeBySeasonYear, listAvailableAnimeYears } from "@/lib/services/anime.service";

function getCurrentSeason(date = new Date()) {
  const month = date.getMonth(); // 0-11
  if (month <= 2) return "winter";
  if (month <= 5) return "spring";
  if (month <= 8) return "summer";
  return "fall";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const seasonParam = (url.searchParams.get("season") ?? getCurrentSeason()).toLowerCase();
  const yearParam = url.searchParams.get("year");
  const year = Number.parseInt(yearParam ?? `${new Date().getFullYear()}`, 10);

  if (!isValidAnimeSeason(seasonParam)) {
    return Response.json({ error: "Invalid season. Use winter, spring, summer, or fall." }, { status: 400 });
  }

  if (!Number.isFinite(year) || year <= 0) {
    return Response.json({ error: "Invalid year" }, { status: 400 });
  }

  const [data, availableYears] = await Promise.all([
    listAnimeBySeasonYear({ season: seasonParam, year }),
    listAvailableAnimeYears(),
  ]);

  return Response.json({
    ...data,
    availableYears,
  });
}

