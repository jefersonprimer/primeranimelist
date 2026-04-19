import {
  adminUpdateAnimeByMalId,
  getAnimeByMalId,
  serializeSingleAnimeResponse,
  type AnimeAdminPatch,
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

  return Response.json(serializeSingleAnimeResponse(anime));
}

function buildAnimePatch(body: Record<string, unknown>): AnimeAdminPatch | { error: string } {
  const patch: AnimeAdminPatch = {};

  if ("title" in body) {
    const title = parseString(body.title);
    if (!title) {
      return { error: "Title cannot be empty" };
    }
    patch.title = title;
  }

  if ("title_japanese" in body || "titleJapanese" in body) {
    patch.titleJapanese = parseString(body.title_japanese ?? body.titleJapanese);
  }
  if ("title_english" in body || "titleEnglish" in body) {
    patch.titleEnglish = parseString(body.title_english ?? body.titleEnglish);
  }
  if ("image_url" in body || "imageUrl" in body) {
    patch.imageUrl = parseString(body.image_url ?? body.imageUrl);
  }
  if ("image_banner_desktop" in body || "imageBannerDesktop" in body) {
    patch.imageBannerDesktop = parseString(body.image_banner_desktop ?? body.imageBannerDesktop);
  }
  if ("image_banner_mobile" in body || "imageBannerMobile" in body) {
    patch.imageBannerMobile = parseString(body.image_banner_mobile ?? body.imageBannerMobile);
  }
  if ("image_logo" in body || "imageLogo" in body) {
    patch.imageLogo = parseString(body.image_logo ?? body.imageLogo);
  }
  if ("image_thumbnail" in body || "imageThumbnail" in body) {
    patch.imageThumbnail = parseString(body.image_thumbnail ?? body.imageThumbnail);
  }
  if ("image_card_compact" in body || "imageCardCompact" in body) {
    patch.imageCardCompact = parseString(body.image_card_compact ?? body.imageCardCompact);
  }
  if ("synopsis" in body) {
    patch.synopsis = parseString(body.synopsis);
  }
  if ("score" in body) {
    patch.score = parseFiniteNumber(body.score);
  }
  if ("scored_by" in body || "scoredBy" in body) {
    patch.scoredBy = parseFiniteInt(body.scored_by ?? body.scoredBy);
  }
  if ("rank" in body) {
    patch.rank = parseFiniteInt(body.rank);
  }
  if ("popularity" in body) {
    patch.popularity = parseFiniteInt(body.popularity);
  }
  if ("episodes" in body) {
    patch.episodes = parseFiniteInt(body.episodes);
  }
  if ("status" in body) {
    patch.status = parseString(body.status);
  }
  if ("rating" in body) {
    patch.rating = parseString(body.rating);
  }
  if ("source" in body) {
    patch.source = parseString(body.source);
  }
  if ("season" in body) {
    const seasonRaw = parseString(body.season);
    patch.season = seasonRaw ? seasonRaw.toLowerCase() : null;
  }
  if ("year" in body) {
    patch.year = parseFiniteInt(body.year);
  }
  if ("genres" in body) {
    patch.genres = parseStringArrayField(body.genres);
  }
  if ("studios" in body) {
    patch.studios = parseStringArrayField(body.studios);
  }
  if ("producers" in body) {
    patch.producers = parseStringArrayField(body.producers);
  }
  if ("licensors" in body) {
    patch.licensors = parseStringArrayField(body.licensors);
  }
  if ("themes" in body) {
    patch.themes = parseStringArrayField(body.themes);
  }
  if ("demographics" in body) {
    patch.demographics = parseStringArrayField(body.demographics);
  }
  if ("aired_from" in body || "airedFrom" in body) {
    patch.airedFrom = parseIsoDate(body.aired_from ?? body.airedFrom);
  }
  if ("aired_to" in body || "airedTo" in body) {
    patch.airedTo = parseIsoDate(body.aired_to ?? body.airedTo);
  }
  if ("is_airing" in body || "isAiring" in body || "airing" in body) {
    patch.isAiring = parseBoolean(body.is_airing ?? body.isAiring ?? body.airing);
  }
  if ("trailer_url" in body || "trailerUrl" in body) {
    patch.trailerUrl = parseString(body.trailer_url ?? body.trailerUrl);
  }
  if ("type" in body) {
    patch.type = parseString(body.type);
  }
  if ("members" in body) {
    patch.members = parseFiniteInt(body.members);
  }
  if ("favorites" in body) {
    patch.favorites = parseFiniteInt(body.favorites);
  }
  if ("duration" in body) {
    patch.duration = parseString(body.duration);
  }

  return patch;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ mal_id: string }> }
) {
  const gate = await requireAdminApiUser();
  if (!gate.ok) {
    return gate.response;
  }

  const { mal_id } = await params;
  const malId = Number.parseInt(mal_id, 10);

  if (!Number.isFinite(malId) || malId <= 0) {
    return NextResponse.json({ error: "Invalid anime ID" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const patch = buildAnimePatch(body);
  if ("error" in patch) {
    return NextResponse.json({ error: patch.error }, { status: 400 });
  }

  const result = await adminUpdateAnimeByMalId(malId, patch);
  if (!result.ok) {
    return NextResponse.json({ error: "Anime not found" }, { status: 404 });
  }

  if (!result.row) {
    return NextResponse.json({ error: "Failed to update anime" }, { status: 500 });
  }

  return NextResponse.json(serializeSingleAnimeResponse(result.row));
}
