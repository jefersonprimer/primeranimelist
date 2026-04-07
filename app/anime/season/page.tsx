import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function getCurrentSeason(date = new Date()) {
  const month = date.getMonth(); // 0-11
  if (month <= 2) return "winter";
  if (month <= 5) return "spring";
  if (month <= 8) return "summer";
  return "fall";
}

export default async function AnimeSeasonPage(props: PageProps<"/anime/season">) {
  const { season: seasonParam, year: yearParam } = await props.searchParams;

  const currentYear = new Date().getFullYear();
  const currentSeason = getCurrentSeason();
  const seasonRaw = Array.isArray(seasonParam) ? seasonParam[0] : seasonParam;
  const yearRaw = Array.isArray(yearParam) ? yearParam[0] : yearParam;

  const season = (seasonRaw ?? currentSeason).toLowerCase();
  const yearParsed = Number.parseInt(yearRaw ?? `${currentYear}`, 10);
  const year = Number.isFinite(yearParsed) && yearParsed > 0 ? yearParsed : currentYear;

  redirect(`/anime/season/${year}/${encodeURIComponent(season)}`);
}

