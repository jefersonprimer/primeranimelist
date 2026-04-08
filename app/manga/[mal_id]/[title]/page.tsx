import { getMangaByMalId } from "@/lib/services/manga.service";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

function toNameList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && "name" in item && typeof (item as any).name === "string") {
        return (item as any).name as string;
      }
      return null;
    })
    .filter((v): v is string => typeof v === "string" && v.length > 0);
}

export async function generateMetadata({ params }: { params: Promise<{ mal_id: string; title: string }> }) {
  const { mal_id } = await params;
  const malId = Number.parseInt(mal_id, 10);

  if (!Number.isFinite(malId) || malId <= 0) {
    return { title: "Manga not found" };
  }

  const manga = await getMangaByMalId(malId);

  if (!manga) {
    return { title: "Manga not found" };
  }

  return {
    title: `${manga.title} - PrimerAnimeList`,
    description: manga.synopsis?.slice(0, 160) ?? `View details for ${manga.title}`,
  };
}

export default async function MangaDetailPage({ params }: { params: Promise<{ mal_id: string; title: string }> }) {
  const { mal_id, title: _title } = await params;
  const malId = Number.parseInt(mal_id, 10);

  if (!Number.isFinite(malId) || malId <= 0) {
    notFound();
  }

  const manga = await getMangaByMalId(malId);

  if (!manga) {
    notFound();
  }

  const genres = toNameList(manga.genres);
  const authors = toNameList(manga.authors);

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="flex flex-col gap-8">
        <Link
          href="/manga/top"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          <span aria-hidden="true">←</span>
          Back to Top Manga
        </Link>

        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex-shrink-0">
            {manga.imageUrl ? (
              <div className="relative h-96 w-64 overflow-hidden rounded-xl border border-zinc-200 shadow-lg dark:border-zinc-800">
                <Image
                  src={manga.imageUrl}
                  alt={manga.title}
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
                {manga.title}
              </h1>
              {(manga.titleEnglish || manga.titleJapanese) && (
                <div className="mt-1 space-y-1">
                  {manga.titleEnglish && (
                    <p className="text-lg text-zinc-600 dark:text-zinc-400">
                      {manga.titleEnglish}
                    </p>
                  )}
                  {manga.titleJapanese && (
                    <p className="text-lg text-zinc-600 dark:text-zinc-400">
                      {manga.titleJapanese}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {manga.rank && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  <span>Rank #{manga.rank}</span>
                </span>
              )}
              {manga.score && (
                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  <span>★ {manga.score.toFixed(2)}</span>
                </span>
              )}
              {manga.type && (
                <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {manga.type}
                </span>
              )}
              {manga.chapters && (
                <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {manga.chapters} chapters
                </span>
              )}
              {manga.volumes && (
                <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {manga.volumes} volumes
                </span>
              )}
              {manga.status && (
                <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {manga.status}
                </span>
              )}
            </div>

            {manga.synopsis && (
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {manga.synopsis}
                </p>
              </div>
            )}

            {manga.background && (
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Background</h2>
                <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {manga.background}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {manga.members && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Members</p>
                  <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {manga.members.toLocaleString()}
                  </p>
                </div>
              )}
              {manga.favorites && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Favorites</p>
                  <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {manga.favorites.toLocaleString()}
                  </p>
                </div>
              )}
              {manga.popularity && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Popularity</p>
                  <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    #{manga.popularity}
                  </p>
                </div>
              )}
              {typeof manga.publishing === "boolean" && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Publishing</p>
                  <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {manga.publishing ? "Yes" : "No"}
                  </p>
                </div>
              )}
            </div>

            {genres.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Genres</p>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre, idx) => (
                    <span
                      key={`${genre}-${idx}`}
                      className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {authors.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Authors</p>
                <div className="flex flex-wrap gap-2">
                  {authors.map((author, idx) => (
                    <span
                      key={`${author}-${idx}`}
                      className="rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      {author}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

