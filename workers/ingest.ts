import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { ensureDatabase } from "@/lib/db/bootstrap";
import { anime } from "@/lib/db/schema";

const JIKAN_BASE = "https://api.jikan.moe/v4";

const endpoints = [
  { url: "/top/anime", label: "top geral" },
  { url: "/top/anime?filter=bypopularity", label: "mais populares" },
  { url: "/top/anime?filter=airing", label: "em exibição" },
];

const MAX_PAGES = 3;
const REQUEST_DELAY = 2500; // 2.5s entre requests (Jikan tem rate limit)

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseAnime(item: any) {
  return {
    malId: item.mal_id,
    title: item.title,
    titleJapanese: item.title_japanese,
    imageUrl: item.images?.jpg?.image_url,
    synopsis: item.synopsis,
    score: item.score,
    scoredBy: item.scored_by,
    rank: item.rank,
    popularity: item.popularity,
    episodes: item.episodes,
    status: item.status,
    rating: item.rating,
    source: item.source,
    season: item.season,
    year: item.year,
    genres: item.genres?.map((g: any) => g.name) || [],
    studios: item.studios?.map((s: any) => s.name) || [],
    airedFrom: item.aired?.from ? new Date(item.aired.from) : null,
    airedTo: item.aired?.to ? new Date(item.aired.to) : null,
    isAiring: item.aired?.prop?.from?.day !== null || item.status === "Currently Airing",
    trailerUrl: item.trailer?.url,
    type: item.type,
    members: item.members,
    favorites: item.favorites,
    duration: item.duration,
  };
}

async function saveAnime(data: any) {
  const malId = data.mal_id || data.malId;

  if (!malId) {
    console.warn("⚠️ Item sem mal_id, pulando:", data.title || data.mal_id);
    return;
  }

  const existing = await db
    .select()
    .from(anime)
    .where(eq(anime.malId, malId))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(anime)
      .set({ ...parseAnime(data), updatedAt: new Date() })
      .where(eq(anime.malId, malId));
  } else {
    await db.insert(anime).values(parseAnime(data));
  }
}

async function fetchPage(endpoint: string, page: number) {
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${JIKAN_BASE}${endpoint}${separator}page=${page}`;
  const res = await fetch(url);

  if (!res.ok) {
    if (res.status === 429) {
      console.log("Rate limit, aguardando 5s...");
      await sleep(5000);
      return fetchPage(endpoint, page);
    }
    throw new Error(`Jikan API error: ${res.status}`);
  }

  return res.json();
}

async function processEndpoint(endpoint: string, label: string) {
  console.log(`\n📌 Processando: ${label}`);

  let page = 1;
  let hasNext = true;
  let total = 0;

  while (hasNext && page <= MAX_PAGES) {
    console.log(`  Página ${page}/${MAX_PAGES}...`);

    const json = await fetchPage(endpoint, page);

    for (const item of json.data) {
      await saveAnime(item);
      total++;
    }

    hasNext = json.pagination?.has_next_page ?? false;
    page++;

    if (hasNext && page <= MAX_PAGES) {
      await sleep(REQUEST_DELAY);
    }
  }

  console.log(`  ✅ ${total} animes salvos`);
  return total;
}

async function run() {
  console.log("🚀 Iniciando ingestão de animes do Jikan API\n");
  await ensureDatabase();

  let totalGeral = 0;

  for (const [index, { url, label }] of endpoints.entries()) {
    const count = await processEndpoint(url, label);
    totalGeral += count;

    if (index < endpoints.length - 1) {
      console.log("⏳ Aguardando 5s antes do próximo endpoint...");
      await sleep(5000);
    }
  }

  console.log(`\n✅ Conclusão! Total: ${totalGeral} animes processados`);
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Erro:", err);
  process.exit(1);
});
