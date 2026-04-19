import {
  adminCreateAnime,
  isValidAnimeSeason,
  listAnime,
  listAnimeBySeasonYear,
  parseTopAnimeFilter,
  serializeAnimeListResponse,
  serializeSingleAnimeResponse,
  type AnimeAdminWrite,
} from "@/lib/services/anime.service";
import {
  parseBoolean,
  parseFiniteInt,
  parseFiniteNumber,
  parseIsoDate,
  parseString,
  parseStringArrayField,
  requireAdminApiUser,
} from "@/lib/admin-api";
import { NextResponse } from "next/server";

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

function readAnimeAdminPayload(body: Record<string, unknown>): AnimeAdminWrite | { error: string } {
  const malId = parseFiniteInt(body.mal_id ?? body.malId);
  const title = parseString(body.title);

  if (!malId || malId <= 0) {
    return { error: "Invalid mal_id" };
  }
  if (!title) {
    return { error: "Title is required" };
  }

  const seasonRaw = parseString(body.season);
  const season = seasonRaw ? seasonRaw.toLowerCase() : null;

  return {
    malId,
    title,
    titleJapanese: parseString(body.title_japanese ?? body.titleJapanese),
    titleEnglish: parseString(body.title_english ?? body.titleEnglish),
    imageUrl: parseString(body.image_url ?? body.imageUrl),
    imageBannerDesktop: parseString(body.image_banner_desktop ?? body.imageBannerDesktop),
    imageBannerMobile: parseString(body.image_banner_mobile ?? body.imageBannerMobile),
    imageLogo: parseString(body.image_logo ?? body.imageLogo),
    imageThumbnail: parseString(body.image_thumbnail ?? body.imageThumbnail),
    imageCardCompact: parseString(body.image_card_compact ?? body.imageCardCompact),
    synopsis: parseString(body.synopsis),
    score: parseFiniteNumber(body.score),
    scoredBy: parseFiniteInt(body.scored_by ?? body.scoredBy),
    rank: parseFiniteInt(body.rank),
    popularity: parseFiniteInt(body.popularity),
    episodes: parseFiniteInt(body.episodes),
    status: parseString(body.status),
    rating: parseString(body.rating),
    source: parseString(body.source),
    season,
    year: parseFiniteInt(body.year),
    genres: parseStringArrayField(body.genres),
    studios: parseStringArrayField(body.studios),
    producers: parseStringArrayField(body.producers),
    licensors: parseStringArrayField(body.licensors),
    themes: parseStringArrayField(body.themes),
    demographics: parseStringArrayField(body.demographics),
    airedFrom: parseIsoDate(body.aired_from ?? body.airedFrom),
    airedTo: parseIsoDate(body.aired_to ?? body.airedTo),
    isAiring: parseBoolean(body.is_airing ?? body.isAiring ?? body.airing),
    trailerUrl: parseString(body.trailer_url ?? body.trailerUrl),
    type: parseString(body.type),
    members: parseFiniteInt(body.members),
    favorites: parseFiniteInt(body.favorites),
    duration: parseString(body.duration),
  };
}

export async function POST(request: Request) {
  const gate = await requireAdminApiUser();
  if (!gate.ok) {
    return gate.response;
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payload = readAnimeAdminPayload(body);
  if ("error" in payload) {
    return NextResponse.json({ error: payload.error }, { status: 400 });
  }

  const result = await adminCreateAnime(payload);
  if (!result.ok) {
    return NextResponse.json({ error: "Anime with this mal_id already exists" }, { status: 409 });
  }

  if (!result.row) {
    return NextResponse.json({ error: "Failed to create anime" }, { status: 500 });
  }

  return NextResponse.json(serializeSingleAnimeResponse(result.row), { status: 201 });
}
