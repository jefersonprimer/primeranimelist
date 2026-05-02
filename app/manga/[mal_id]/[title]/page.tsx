import {
  getMangaByMalId,
  serializeManga,
} from "@/lib/services/manga.service";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminDetailEditButton } from "@/app/components/AdminDetailEditButton";
import { MangaWatchlistButton } from "@/app/components/MangaWatchlistButton";
import { MangaCarouselRecommendation } from "@/app/components/MangaCarouselRecommendation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ mal_id: string; title: string }>;
}) {
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
    description:
      manga.synopsis?.slice(0, 160) ?? `View details for ${manga.title}`,
  };
}

export default async function MangaDetailPage({
  params,
}: {
  params: Promise<{ mal_id: string; title: string }>;
}) {
  const { mal_id } = await params;
  const malId = Number.parseInt(mal_id, 10);

  if (!Number.isFinite(malId) || malId <= 0) {
    notFound();
  }

  const rawManga = await getMangaByMalId(malId);

  if (!rawManga) {
    notFound();
  }

  const manga = serializeManga(rawManga);
  const recommendationGenres = manga.genres
    .map((genre) => genre.name?.trim())
    .filter((genreName): genreName is string => Boolean(genreName));

  return (
    <div className="mx-auto max-w-7xl bg-white p-4 shadow-sm dark:bg-zinc-950 md:p-6 lg:p-8">
      <div className="mb-6 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {manga.title}
          </h1>
          <div className="flex items-center gap-2">
            <AdminDetailEditButton kind="manga" malId={malId} />
            <Link
              href="/manga/top"
              className="text-xs font-medium text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
            >
              Top Manga
            </Link>
          </div>
        </div>
        {manga.title_english && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {manga.title_english}
          </p>
        )}
      </div>

      <div className="mb-6 flex overflow-x-auto border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
        {[
          "Details",
          "Characters & Staff",
          "Episodes",
          "Videos",
          "Stats",
          "Reviews",
          "Recommendations",
          "News",
          "Forum",
          "Clubs",
          "Pictures",
        ].map((tab, index) => (
          <div
            key={tab}
            className={`cursor-pointer whitespace-nowrap px-4 py-2 text-xs font-bold transition-colors ${
              index === 0
                ? "-mb-px border-x border-t border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                : "text-indigo-600 hover:bg-zinc-100 dark:text-indigo-400 dark:hover:bg-zinc-800"
            }`}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <aside className="w-full shrink-0 md:w-[225px]">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md border border-zinc-200 shadow-sm dark:border-zinc-800">
              {manga.images.webp.large_image_url ? (
                <Image
                  src={manga.images.webp.large_image_url}
                  alt={manga.title}
                  fill
                  className="object-cover"
                  sizes="225px"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                  <span className="text-xs text-zinc-400">No Image</span>
                </div>
              )}
            </div>

            <MangaWatchlistButton
              malId={malId}
              title={manga.title}
              volumes={manga.volumes}
              chapters={manga.chapters}
              triggerClassName="flex w-full items-center justify-center gap-2 rounded bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700"
              triggerLabel="Add to List"
            />

            <div className="mt-4">
              <h3 className="mb-2 border-b border-zinc-200 pb-1 text-sm font-bold text-zinc-900 dark:border-zinc-800 dark:text-zinc-50">
                Information
              </h3>
              <div className="flex flex-col gap-2 text-xs">
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Type:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {manga.type || "Unknown"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Volumes:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {manga.volumes ?? "Unknown"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Chapters:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {manga.chapters ?? "Unknown"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Status:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {manga.status || "Unknown"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Published:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {manga.published.string || "Unknown"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Authors:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {manga.authors.length > 0
                      ? manga.authors.map((a, i) => (
                          <span key={i}>
                            <Link
                              href={a.url || "#"}
                              className="text-indigo-600 hover:underline dark:text-indigo-400"
                            >
                              {a.name}
                            </Link>
                            {i < manga.authors.length - 1 ? ", " : ""}
                          </span>
                        ))
                      : "None found"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Serialization:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {manga.serializations.length > 0
                      ? manga.serializations.map((s, i) => (
                          <span key={i}>
                            <Link
                              href={s.url || "#"}
                              className="text-indigo-600 hover:underline dark:text-indigo-400"
                            >
                              {s.name}
                            </Link>
                            {i < manga.serializations.length - 1 ? ", " : ""}
                          </span>
                        ))
                      : "None found"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Genres:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {manga.genres.length > 0
                      ? manga.genres.map((g, i) => (
                          <span key={i}>
                            <Link
                              href={g.url || "#"}
                              className="text-indigo-600 hover:underline dark:text-indigo-400"
                            >
                              {g.name}
                            </Link>
                            {i < manga.genres.length - 1 ? ", " : ""}
                          </span>
                        ))
                      : "None found"}
                  </span>
                </div>
              </div>

              <h3 className="mb-2 mt-4 border-b border-zinc-200 pb-1 text-sm font-bold text-zinc-900 dark:border-zinc-800 dark:text-zinc-50">
                Statistics
              </h3>
              <div className="flex flex-col gap-2 text-xs">
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Score:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {manga.score ? manga.score.toFixed(2) : "N/A"} (scored by{" "}
                    {manga.scored_by?.toLocaleString() || "0"} users)
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Ranked:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    #{manga.rank || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Popularity:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    #{manga.popularity || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Members:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {manga.members?.toLocaleString() || "0"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Favorites:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {manga.favorites?.toLocaleString() || "0"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="mb-6 flex flex-wrap items-center gap-px overflow-hidden rounded border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex min-w-[120px] flex-1 flex-col items-center justify-center border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <span className="bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">
                SCORE
              </span>
              <span className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
                {manga.score ? manga.score.toFixed(2) : "N/A"}
              </span>
              <span className="text-[10px] text-zinc-500">
                {manga.scored_by?.toLocaleString() || 0} users
              </span>
            </div>
            <div className="flex min-w-[100px] flex-1 items-center justify-center gap-4 p-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">
                  #{manga.rank || "N/A"}
                </span>
                <span className="text-[10px] uppercase text-zinc-500">
                  Ranked
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">
                  #{manga.popularity || "N/A"}
                </span>
                <span className="text-[10px] uppercase text-zinc-500">
                  Popularity
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">
                  {manga.members?.toLocaleString() || 0}
                </span>
                <span className="text-[10px] uppercase text-zinc-500">
                  Members
                </span>
              </div>
            </div>
            <div className="hidden flex-1 items-center justify-center border-l border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 lg:flex">
              <div className="flex flex-col items-center">
                <span className="text-center text-sm font-bold capitalize">
                  {manga.publishing !== null && manga.publishing !== undefined
                    ? manga.publishing
                      ? "Publishing"
                      : "Finished"
                    : manga.status || "Unknown"}
                </span>
                <span className="text-[10px] uppercase text-zinc-500">
                  {manga.type}
                </span>
              </div>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="mb-2 border-b border-zinc-200 pb-1 text-sm font-bold text-zinc-900 dark:border-zinc-800 dark:text-zinc-50">
              Synopsis
            </h2>
            <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none">
              <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {manga.synopsis || "No synopsis available."}
              </p>
            </div>
          </section>

          {manga.background ? (
            <section className="mt-8">
              <h2 className="mb-4 border-b border-zinc-200 pb-1 text-sm font-bold text-zinc-900 dark:border-zinc-800 dark:text-zinc-50">
                Background
              </h2>
              <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none">
                <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {manga.background}
                </p>
              </div>
            </section>
          ) : null}
        </main>
      </div>

      {recommendationGenres.length > 0 ? (
        <section className="mt-10">
          <MangaCarouselRecommendation
            title="Recommended manga from similar genres"
            genreNames={recommendationGenres}
            currentMalId={malId}
          />
        </section>
      ) : null}
    </div>
  );
}
