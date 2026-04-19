import {
  adminCreateManga,
  listManga,
  parseTopMangaFilter,
  serializeMangaListResponse,
  serializeSingleMangaResponse,
  type MangaAdminWrite,
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

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pageRaw = url.searchParams.get("page");
  const limitRaw = url.searchParams.get("limit");
  const filterRaw = url.searchParams.get("filter");

  const page = pageRaw ? Number.parseInt(pageRaw, 10) : undefined;
  const limit = limitRaw ? Number.parseInt(limitRaw, 10) : undefined;

  const result = await listManga({
    page,
    limit,
    filter: filterRaw ?? undefined,
  });

  return Response.json({
    ...serializeMangaListResponse(result.items, {
      page: result.page,
      limit: result.limit,
      total: result.total,
    }),
    filter: parseTopMangaFilter(filterRaw ?? undefined),
  });
}

function readMangaAdminPayload(body: Record<string, unknown>): MangaAdminWrite | { error: string } {
  const malId = parseFiniteInt(body.mal_id ?? body.malId);
  const title = parseString(body.title);

  if (!malId || malId <= 0) {
    return { error: "Invalid mal_id" };
  }
  if (!title) {
    return { error: "Title is required" };
  }

  return {
    malId,
    title,
    titleJapanese: parseString(body.title_japanese ?? body.titleJapanese),
    titleEnglish: parseString(body.title_english ?? body.titleEnglish),
    imageUrl: parseString(body.image_url ?? body.imageUrl),
    synopsis: parseString(body.synopsis),
    background: parseString(body.background),
    score: parseFiniteNumber(body.score),
    scoredBy: parseFiniteInt(body.scored_by ?? body.scoredBy),
    rank: parseFiniteInt(body.rank),
    popularity: parseFiniteInt(body.popularity),
    chapters: parseFiniteInt(body.chapters),
    volumes: parseFiniteInt(body.volumes),
    status: parseString(body.status),
    publishing: parseBoolean(body.publishing),
    genres: parseStringArrayField(body.genres),
    themes: parseStringArrayField(body.themes),
    demographics: parseStringArrayField(body.demographics),
    authors: parseStringArrayField(body.authors),
    serializations: parseStringArrayField(body.serializations),
    publishedFrom: parseIsoDate(body.published_from ?? body.publishedFrom),
    publishedTo: parseIsoDate(body.published_to ?? body.publishedTo),
    type: parseString(body.type),
    members: parseFiniteInt(body.members),
    favorites: parseFiniteInt(body.favorites),
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

  const payload = readMangaAdminPayload(body);
  if ("error" in payload) {
    return NextResponse.json({ error: payload.error }, { status: 400 });
  }

  const result = await adminCreateManga(payload);
  if (!result.ok) {
    return NextResponse.json({ error: "Manga with this mal_id already exists" }, { status: 409 });
  }

  if (!result.row) {
    return NextResponse.json({ error: "Failed to create manga" }, { status: 500 });
  }

  return NextResponse.json(serializeSingleMangaResponse(result.row), { status: 201 });
}
