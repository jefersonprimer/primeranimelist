import { getSession } from "@/lib/auth";
import {
  deleteWatchlistEntry,
  getWatchlistEntryByMalId,
  listWatchlistEntries,
  upsertWatchlistEntry,
} from "@/lib/services/watchlist.service";
import { NextResponse } from "next/server";

function getMalIdFromRequest(request: Request) {
  const { searchParams } = new URL(request.url);
  const value = searchParams.get("malId");
  if (!value) {
    return null;
  }

  const malId = Number.parseInt(value, 10);
  return Number.isFinite(malId) ? malId : null;
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const malId = getMalIdFromRequest(request);
    if (malId !== null) {
      const entry = await getWatchlistEntryByMalId(session.user.id, malId);
      return NextResponse.json({ entry });
    }

    const entries = await listWatchlistEntries(session.user.id);
    return NextResponse.json({ entries });
  } catch (error: any) {
    console.error("Watchlist GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { malId, ...payload } = await request.json();
    const parsedMalId = Number.parseInt(String(malId), 10);

    if (!Number.isFinite(parsedMalId)) {
      return NextResponse.json({ error: "A valid malId is required" }, { status: 400 });
    }

    const entry = await upsertWatchlistEntry(session.user.id, parsedMalId, payload);
    return NextResponse.json({ entry });
  } catch (error: any) {
    const status = error.message === "Anime not found" ? 404 : 400;
    console.error("Watchlist POST error:", error);
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const malId = getMalIdFromRequest(request);
    if (malId === null) {
      return NextResponse.json({ error: "A valid malId is required" }, { status: 400 });
    }

    const deleted = await deleteWatchlistEntry(session.user.id, malId);
    return NextResponse.json({ deleted });
  } catch (error: any) {
    console.error("Watchlist DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
