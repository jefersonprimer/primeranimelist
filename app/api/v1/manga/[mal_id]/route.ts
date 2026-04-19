import {
  adminUpdateMangaByMalId,
  getMangaByMalId,
  serializeSingleMangaResponse,
  type MangaAdminPatch,
} from "@/lib/services/manga.service";
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
    return Response.json({ error: "Invalid manga ID" }, { status: 400 });
  }

  const manga = await getMangaByMalId(malId);

  if (!manga) {
    return Response.json({ error: "Manga not found" }, { status: 404 });
  }

  return Response.json(serializeSingleMangaResponse(manga));
}

function buildMangaPatch(body: Record<string, unknown>): MangaAdminPatch | { error: string } {
  const patch: MangaAdminPatch = {};

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
  if ("synopsis" in body) {
    patch.synopsis = parseString(body.synopsis);
  }
  if ("background" in body) {
    patch.background = parseString(body.background);
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
  if ("chapters" in body) {
    patch.chapters = parseFiniteInt(body.chapters);
  }
  if ("volumes" in body) {
    patch.volumes = parseFiniteInt(body.volumes);
  }
  if ("status" in body) {
    patch.status = parseString(body.status);
  }
  if ("publishing" in body) {
    patch.publishing = parseBoolean(body.publishing);
  }
  if ("genres" in body) {
    patch.genres = parseStringArrayField(body.genres);
  }
  if ("themes" in body) {
    patch.themes = parseStringArrayField(body.themes);
  }
  if ("demographics" in body) {
    patch.demographics = parseStringArrayField(body.demographics);
  }
  if ("authors" in body) {
    patch.authors = parseStringArrayField(body.authors);
  }
  if ("serializations" in body) {
    patch.serializations = parseStringArrayField(body.serializations);
  }
  if ("published_from" in body || "publishedFrom" in body) {
    patch.publishedFrom = parseIsoDate(body.published_from ?? body.publishedFrom);
  }
  if ("published_to" in body || "publishedTo" in body) {
    patch.publishedTo = parseIsoDate(body.published_to ?? body.publishedTo);
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
    return NextResponse.json({ error: "Invalid manga ID" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const patch = buildMangaPatch(body);
  if ("error" in patch) {
    return NextResponse.json({ error: patch.error }, { status: 400 });
  }

  const result = await adminUpdateMangaByMalId(malId, patch);
  if (!result.ok) {
    return NextResponse.json({ error: "Manga not found" }, { status: 404 });
  }

  if (!result.row) {
    return NextResponse.json({ error: "Failed to update manga" }, { status: 500 });
  }

  return NextResponse.json(serializeSingleMangaResponse(result.row));
}
