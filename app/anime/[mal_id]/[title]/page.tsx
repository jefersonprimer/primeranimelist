import { getAnimeByMalId, serializeAnime } from "@/lib/services/anime.service";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminDetailEditButton } from "@/app/components/AdminDetailEditButton";
import { WatchlistButton } from "@/app/components/WatchlistButton";
import { AnimeCarouselRecommendation } from "@/app/components/AnimeCarouselRecommendation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ mal_id: string; title: string }>;
}) {
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
    description:
      anime.synopsis?.slice(0, 160) ?? `View details for ${anime.title}`,
  };
}

export default async function AnimeDetailPage({
  params,
}: {
  params: Promise<{ mal_id: string; title: string }>;
}) {
  const { mal_id } = await params;
  const malId = Number.parseInt(mal_id, 10);

  if (!Number.isFinite(malId) || malId <= 0) {
    notFound();
  }

  const rawAnime = await getAnimeByMalId(malId);

  if (!rawAnime) {
    notFound();
  }

  const anime = serializeAnime(rawAnime);
  const recommendationGenres = anime.genres
    .map((genre) => genre.name?.trim())
    .filter((genreName): genreName is string => Boolean(genreName));

  return (
    <div className="mx-auto max-w-7xl bg-white p-4 shadow-sm dark:bg-zinc-950 md:p-6 lg:p-8">
      {/* Title Header */}
      <div className="mb-6 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {anime.title}
          </h1>
          <div className="flex items-center gap-2">
            <AdminDetailEditButton kind="anime" malId={malId} />
            <Link
              href="/anime/top"
              className="text-xs font-medium text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
            >
              Top Anime
            </Link>
          </div>
        </div>
        {anime.title_english && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {anime.title_english}
          </p>
        )}
      </div>

      {/* Tabs Navigation */}
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
                ? "bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 border-x border-t border-zinc-200 dark:border-zinc-800 -mb-px"
                : "text-indigo-600 hover:bg-zinc-100 dark:text-indigo-400 dark:hover:bg-zinc-800"
            }`}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Left Sidebar */}
        <aside className="w-full shrink-0 md:w-[225px]">
          <div className="flex flex-col gap-4">
            {/* Poster */}
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md border border-zinc-200 shadow-sm dark:border-zinc-800">
              {anime.images.webp.large_image_url ? (
                <Image
                  src={anime.images.webp.large_image_url}
                  alt={anime.title}
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

            {/* Watchlist Action */}
            <WatchlistButton
              malId={malId}
              title={anime.title}
              episodes={anime.episodes}
              triggerClassName="flex w-full items-center justify-center gap-2 rounded bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700"
              triggerLabel="Add to List"
            />

            {/* Information Section */}
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
                    {anime.type || "Unknown"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Episodes:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {anime.episodes || "Unknown"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Status:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {anime.status || "Unknown"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Aired:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {anime.aired.string || "Unknown"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Premiered:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400 capitalize">
                    {anime.season && anime.year
                      ? `${anime.season} ${anime.year}`
                      : "Unknown"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Producers:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {anime.producers.length > 0
                      ? anime.producers.map((p, i) => (
                          <span key={i}>
                            <Link
                              href={p.url || "#"}
                              className="text-indigo-600 hover:underline dark:text-indigo-400"
                            >
                              {p.name}
                            </Link>
                            {i < anime.producers.length - 1 ? ", " : ""}
                          </span>
                        ))
                      : "None found"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Licensors:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {anime.licensors.length > 0
                      ? anime.licensors.map((p, i) => (
                          <span key={i}>
                            <Link
                              href={p.url || "#"}
                              className="text-indigo-600 hover:underline dark:text-indigo-400"
                            >
                              {p.name}
                            </Link>
                            {i < anime.licensors.length - 1 ? ", " : ""}
                          </span>
                        ))
                      : "None found"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Studios:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {anime.studios.length > 0
                      ? anime.studios.map((s, i) => (
                          <span key={i}>
                            <Link
                              href={s.url || "#"}
                              className="text-indigo-600 hover:underline dark:text-indigo-400"
                            >
                              {s.name}
                            </Link>
                            {i < anime.studios.length - 1 ? ", " : ""}
                          </span>
                        ))
                      : "None found"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Source:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {anime.source || "Unknown"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Genres:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {anime.genres.length > 0
                      ? anime.genres.map((g, i) => (
                          <span key={i}>
                            <Link
                              href={g.url || "#"}
                              className="text-indigo-600 hover:underline dark:text-indigo-400"
                            >
                              {g.name}
                            </Link>
                            {i < anime.genres.length - 1 ? ", " : ""}
                          </span>
                        ))
                      : "None found"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Duration:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {anime.duration || "Unknown"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Rating:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {anime.rating || "Unknown"}
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
                    {anime.score ? anime.score.toFixed(2) : "N/A"} (scored by{" "}
                    {anime.scored_by?.toLocaleString() || "0"} users)
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Ranked:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    #{anime.rank || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Popularity:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    #{anime.popularity || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Members:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {anime.members?.toLocaleString() || "0"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">
                    Favorites:
                  </span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {anime.favorites?.toLocaleString() || "0"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {/* Stats Summary Box */}
          <div className="mb-6 flex flex-wrap items-center gap-px overflow-hidden rounded border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex min-w-[120px] flex-1 flex-col items-center justify-center border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <span className="bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">
                SCORE
              </span>
              <span className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
                {anime.score ? anime.score.toFixed(2) : "N/A"}
              </span>
              <span className="text-[10px] text-zinc-500">
                {anime.scored_by?.toLocaleString() || 0} users
              </span>
            </div>
            <div className="flex min-w-[100px] flex-1 items-center justify-center gap-4 p-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">
                  #{anime.rank || "N/A"}
                </span>
                <span className="text-[10px] uppercase text-zinc-500">
                  Ranked
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">
                  #{anime.popularity || "N/A"}
                </span>
                <span className="text-[10px] uppercase text-zinc-500">
                  Popularity
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">
                  {anime.members?.toLocaleString() || 0}
                </span>
                <span className="text-[10px] uppercase text-zinc-500">
                  Members
                </span>
              </div>
            </div>
            <div className="hidden flex-1 items-center justify-center border-l border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 lg:flex">
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold capitalize">
                  {anime.season} {anime.year}
                </span>
                <span className="text-[10px] uppercase text-zinc-500">
                  {anime.type}
                </span>
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <section className="mb-8">
            <h2 className="mb-2 border-b border-zinc-200 pb-1 text-sm font-bold text-zinc-900 dark:border-zinc-800 dark:text-zinc-50">
              Synopsis
            </h2>
            <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none">
              <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {anime.synopsis || "No synopsis available."}
              </p>
            </div>
          </section>

          {/* Related / Trailer Section */}
          {anime.trailer.embed_url && (
            <section className="mt-8">
              <h2 className="mb-4 border-b border-zinc-200 pb-1 text-sm font-bold text-zinc-900 dark:border-zinc-800 dark:text-zinc-50">
                Trailer
              </h2>
              <div className="aspect-video w-full max-w-2xl overflow-hidden rounded-md border border-zinc-200 shadow-sm dark:border-zinc-800">
                <iframe
                  src={anime.trailer.embed_url}
                  title={`${anime.title} trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </section>
          )}
        </main>
      </div>

      {recommendationGenres.length > 0 ? (
        <section className="mt-10">
          <AnimeCarouselRecommendation
            title="Recommended anime from similar genres"
            genreNames={recommendationGenres}
            currentMalId={malId}
          />
        </section>
      ) : null}
    </div>
  );
}
