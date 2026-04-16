import { searchAnime } from "@/lib/services/anime.service";
import { searchManga } from "@/lib/services/manga.service";
import { AnimeCard } from "@/app/components/AnimeCard";
import { MangaCard } from "@/app/components/MangaCard";
import { SearchControls } from "./SearchControls";

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center dark:border-zinc-700 dark:bg-zinc-950">
      <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
        Nothing found for "{query}"
      </h2>
    </div>
  );
}

export default async function SearchPage(props: PageProps<"/search">) {
  const { q: qParam } = await props.searchParams;
  const query = (getSingleValue(qParam) ?? "").trim();
  const hasQuery = query.length > 0;

  const [animeResults, mangaResults] = hasQuery
    ? await Promise.all([searchAnime({ query, limit: 12 }), searchManga({ query, limit: 12 })])
    : [[], []];

  const totalResults = animeResults.length + mangaResults.length;

  return (
    <main className="min-h-screen bg-[#151515] py-12">
      <div className="mx-auto max-w-6xl px-6">
        <section>
          <SearchControls query={query} />

          {hasQuery && (
            <div className="mt-8">
              {totalResults === 0 ? (
                <EmptyState query={query} />
              ) : (
                <div className="flex flex-col gap-10">
                  {animeResults.length > 0 && (
                    <section className="flex flex-col gap-4">
                      <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50">Anime</h2>
                      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {animeResults.map((item) => (
                          <AnimeCard
                            key={`anime-${item.id}`}
                            malId={item.malId}
                            title={item.title}
                            imageUrl={item.imageUrl}
                            rating={item.rating}
                            score={item.score}
                            members={item.members}
                            episodes={item.episodes}
                            synopsis={item.synopsis}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {mangaResults.length > 0 && (
                    <section className="flex flex-col gap-4">
                      <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50">Manga</h2>
                      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {mangaResults.map((item) => (
                          <MangaCard
                            key={`manga-${item.id}`}
                            malId={item.malId}
                            title={item.title}
                            imageUrl={item.imageUrl}
                            score={item.score}
                            type={item.type}
                            chapters={item.chapters}
                            volumes={item.volumes}
                            rank={item.rank ?? undefined}
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
