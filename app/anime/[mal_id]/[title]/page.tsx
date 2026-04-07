import { getAnimeByMalId } from "@/lib/services/anime.service";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ mal_id: string; title: string }> }) {
  const { mal_id } = await params;
  const malId = Number.parseInt(mal_id, 10);

  if (!Number.isFinite(malId) || malId <= 0) {
    return { title: "Anime not found" };
  }

  const anime = await getAnimeByMalId(malId);

  if (!anime) {
    return { title: "Anime not found" };
  }

  return {
    title: `${anime.title} - PrimerAnimeList`,
    description: anime.synopsis?.slice(0, 160) ?? `View details for ${anime.title}`,
  };
}

export default async function AnimeDetailPage({ params }: { params: Promise<{ mal_id: string; title: string }> }) {
  const { mal_id, title: _title } = await params;
  const malId = Number.parseInt(mal_id, 10);

  if (!Number.isFinite(malId) || malId <= 0) {
    notFound();
  }

  const anime = await getAnimeByMalId(malId);

  if (!anime) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="flex flex-col gap-8">
        <Link
          href="/anime/top"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          <span aria-hidden="true">←</span>
          Back to Top Anime
        </Link>

        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex-shrink-0">
            {anime.imageUrl ? (
              <div className="relative h-96 w-64 overflow-hidden rounded-xl border border-zinc-200 shadow-lg dark:border-zinc-800">
                <Image
                  src={anime.imageUrl}
                  alt={anime.title}
                  fill
                  className="object-cover"
                  sizes="256px"
                  priority
                />
              </div>
            ) : (
              <div className="flex h-96 w-64 items-center justify-center rounded-xl bg-zinc-200 dark:bg-zinc-800">
                <span className="text-sm text-zinc-400">No image</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                {anime.title}
              </h1>
              {anime.titleJapanese && (
                <p className="mt-1 text-lg text-zinc-600 dark:text-zinc-400">
                  {anime.titleJapanese}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {anime.rank && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  <span>Rank #{anime.rank}</span>
                </span>
              )}
              {anime.score && (
                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  <span>★ {anime.score.toFixed(2)}</span>
                </span>
              )}
              {anime.type && (
                <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {anime.type}
                </span>
              )}
              {anime.episodes && (
                <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {anime.episodes} episodes
                </span>
              )}
              {anime.status && (
                <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {anime.status}
                </span>
              )}
            </div>

            {anime.synopsis && (
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {anime.synopsis}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {anime.members && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Members</p>
                  <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {anime.members.toLocaleString()}
                  </p>
                </div>
              )}
              {anime.favorites && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Favorites</p>
                  <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {anime.favorites.toLocaleString()}
                  </p>
                </div>
              )}
              {anime.popularity && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Popularity</p>
                  <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    #{anime.popularity}
                  </p>
                </div>
              )}
              {anime.season && anime.year && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Season</p>
                  <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} {anime.year}
                  </p>
                </div>
              )}
              {anime.source && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Source</p>
                  <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {anime.source}
                  </p>
                </div>
              )}
              {anime.rating && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Rating</p>
                  <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {anime.rating}
                  </p>
                </div>
              )}
            </div>

            {anime.genres && Array.isArray(anime.genres) && anime.genres.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Genres</p>
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre: string) => (
                    <span
                      key={genre}
                      className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {anime.studios && Array.isArray(anime.studios) && anime.studios.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Studios</p>
                <div className="flex flex-wrap gap-2">
                  {anime.studios.map((studio: string) => (
                    <span
                      key={studio}
                      className="rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      {studio}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {anime.trailerUrl && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">Trailer</h2>
            <div className="aspect-video w-full max-w-2xl rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
              <iframe
                src={anime.trailerUrl.replace("watch?v=", "embed/")}
                title={`${anime.title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}