import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { ensureDatabase } from "@/lib/db/bootstrap";
import { anime } from "@/lib/db/schema";

const JIKAN_BASE = "https://api.jikan.moe/v4";

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

async function run() {
  console.log("🚀 Iniciando ingestão de animes do Jikan API (top/anime)\n");
  await ensureDatabase();

  let page = 1;
  let hasNext = true;
  let totalNew = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;

  while (hasNext) {
    console.log(`📄 Página ${page}...`);

    const json = await fetchPage("/top/anime", page);
    const items = json.data;

    for (const item of items) {
      const malId = item.mal_id;
      const rank = item.rank;

      // Verifica se já existe no banco
      const existing = await db
        .select()
        .from(anime)
        .where(eq(anime.malId, malId))
        .limit(1);

      if (existing.length > 0) {
        // Já existe - atualiza apenas se necessário
        await db
          .update(anime)
          .set({ ...parseAnime(item), updatedAt: new Date() })
          .where(eq(anime.malId, malId));
        totalUpdated++;
      } else {
        // Novo anime - insere
        await db.insert(anime).values(parseAnime(item));
        totalNew++;
        console.log(`  ✨ Novo: #${rank} - ${item.title}`);
      }
    }

    hasNext = json.pagination?.has_next_page ?? false;
    page++;

    console.log(
      `  📊 Página ${page - 1}: ${items.length} animes (novos: ${totalNew}, atualizados: ${totalUpdated})`
    );

    if (hasNext) {
      await sleep(REQUEST_DELAY);
    }
  }

  console.log(`\n✅ Conclusão!`);
  console.log(`  Novos: ${totalNew}`);
  console.log(`  Atualizados: ${totalUpdated}`);
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Erro:", err);
  process.exit(1);
});
