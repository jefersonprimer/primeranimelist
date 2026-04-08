import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { ensureMangaDatabase } from "@/lib/db/bootstrap";
import { manga } from "@/lib/db/schema";

const JIKAN_BASE = "https://api.jikan.moe/v4";

const REQUEST_DELAY = 2500; // 2.5s entre requests (Jikan tem rate limit)

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseManga(item: any) {
  return {
    malId: item.mal_id,
    title: item.title,
    titleJapanese: item.title_japanese,
    titleEnglish: item.title_english,
    imageUrl: item.images?.jpg?.image_url,
    synopsis: item.synopsis,
    background: item.background,
    score: item.score,
    scoredBy: item.scored_by,
    rank: item.rank,
    popularity: item.popularity,
    chapters: item.chapters,
    volumes: item.volumes,
    status: item.status,
    publishing: item.publishing,
    genres: item.genres?.map((g: any) => g.name) || [],
    themes: item.themes?.map((t: any) => t.name) || [],
    demographics: item.demographics?.map((d: any) => d.name) || [],
    authors: item.authors?.map((a: any) => ({ name: a.name, type: a.type })) || [],
    serializations: item.serializations?.map((s: any) => s.name) || [],
    publishedFrom: item.published?.from ? new Date(item.published.from) : null,
    publishedTo: item.published?.to ? new Date(item.published.to) : null,
    type: item.type,
    members: item.members,
    favorites: item.favorites,
  };
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

export async function run() {
  console.log("🚀 Iniciando ingestão de mangás do Jikan API (top/manga)\n");
  await ensureMangaDatabase();

  let page = 1;
  let hasNext = true;
  let totalNew = 0;
  let totalUpdated = 0;

  while (hasNext) {
    console.log(`📄 Página ${page}...`);

    const json = await fetchPage("/top/manga", page);
    const items = json.data;

    for (const item of items) {
      const malId = item.mal_id;
      const rank = item.rank;

      // Verifica se já existe no banco
      const existing = await db
        .select()
        .from(manga)
        .where(eq(manga.malId, malId))
        .limit(1);

      if (existing.length > 0) {
        // Já existe - atualiza
        await db
          .update(manga)
          .set({ ...parseManga(item), updatedAt: new Date() })
          .where(eq(manga.malId, malId));
        totalUpdated++;
      } else {
        // Novo manga - insere
        await db.insert(manga).values(parseManga(item));
        totalNew++;
        console.log(`  ✨ Novo: #${rank} - ${item.title}`);
      }
    }

    hasNext = json.pagination?.has_next_page ?? false;
    page++;

    console.log(
      `  📊 Página ${page - 1}: ${items.length} mangás (novos: ${totalNew}, atualizados: ${totalUpdated})`
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

if (import.meta.url === `file://${process.argv[1]}`) {
  run().catch((err) => {
    console.error("❌ Erro:", err);
    process.exit(1);
  });
}
